#!/bin/bash

function usage() {
	APP_NAME="$(basename "$0")"
	cat <<TXT
%${APP_NAME}(1) user manual
% R. S. Doiel
% 2025-08-06

# NAME

${APP_NAME}

# SYNOPSIS

${APP_NAME} [OPTION]

# DESCRIPTION

${APP_NAME} copies the web components and related CSS to the s3 bucket based
on the ENVIRONMENT defined "media.env".

# ENVIRONMENT

The environment required includes the following

BUCKET_NAME
: S3 bucket name, e.g. "s3://media.example.edu"

BASE_URL
: The base URL of the website, e.g. "https://media.example.edu"

DISTRIBUTION_ID
: The AWS assigned identifier for the bucket. Looks like a long string
of uppercase letters with numbers.

# OPTIONS

help, -h, --help
: Display this help page

dry-run, -dry-run, --dry-run
: Do a dry run of the copying process without actually copying the content.

# EXAMPLES

~~~shell
${APP_NAME} help
${APP_NAME} dry-run
${APP_NAME}
~~~

TXT
}

function get_mimetype() {
	FNAME="$(basename "$1")"
	case "$FNAME" in 
        *.bib)
		MIME_TYPE="text/plain; charset=utf-8"
		;;
        *.css)
		MIME_TYPE="text/css; charset=utf-8"
		;;
        *.csv)
		MIME_TYPE="text/csv; charset=utf-8"
		;;
        *.gif)
		MIME_TYPE="image/gif"
		;;
        *.gz)
		MIME_TYPE="application/gzip"
		;;
        *.html)
		MIME_TYPE="text/html; charset=utf-8"
		;;
        *.ico)
		MIME_TYPE="image/x-icon"
		;;
        *.include)
		MIME_TYPE="text/plain; charset=utf-8"
		;;
        *.js)
		MIME_TYPE="text/javascript; charset=utf-8"
		;;
		*.mjs)
		MIME_TYPE="text/javascript; charset=utf-8"
		;;
        *.json)
		MIME_TYPE="application/json; charset=utf-8"
		;;
        *.jsonld)
		MIME_TYPE="application/ld+json; charset=utf-8"
		;;
        *.keys)
		MIME_TYPE="text/plain; charset=utf-8"
		;;
        *.md)
		MIME_TYPE="text/markdown; charset=utf-8"
		;;
        *.png)
		MIME_TYPE="image/png"
		;;
        *.rss)
		MIME_TYPE="application/rss+xml; charset=utf-8"
		;;
        *.svg)
		MIME_TYPE="image/svg+xml; charset=utf-8"
		;;
        *.txt)
		MIME_TYPE="text/plain; charset=utf-8"
		;;
        *.zip)
		MIME_TYPE="application/zip"
		;;
		*)
		MIME_TYPE="application/octet-stream"
		;;
	esac
	# Return a plausible mime type based on file extension
	echo "${MIME_TYPE}"
}

# Copy specific file over based on path provided
function copy_file() {
	FNAME="$1"
	T_PATH="/cl-webcomponents/${FNAME}"
	TARGET="${BUCKET_NAME}${T_PATH}"
	MIME_TYPE="$(get_mimetype "${FNAME}")"
	echo "$(date) Coping from $FNAME with '${MIME_TYPE}' to ${TARGET}"
	if ! aws s3 cp ${DRY_RUN} --acl 'public-read' \
		--content-type "${MIME_TYPE}" \
		"${FNAME}" "${TARGET}"; then
		echo "error encountered, aborting."
		exit 1
	fi
}

# Invalidate cloud front
function invalidate_cdn() {
	INVALID_PATH="$1"
	if [ "$DISTRIBUTION_ID" != "" ]; then
		echo "$(date) Invalidating CDN"
		aws cloudfront create-invalidation \
			--distribution-id "$DISTRIBUTION_ID" \
			--paths "${INVALID_PATH}"
	else 
		echo "skipping invalidation, DISTRIBUTION_ID not set"
	fi
}

# function push_cors_setup() {
# 	aws s3api put-bucket-cors --bucket "${BUCKET_NAME}" --cors-configuration file://cors.json
# }

function copy_javascript_files() {
	# shellcheck disable=SC2012
	ls -1 *.js | while read -r FNAME; do
		copy_file "${FNAME}"
	done;
}

function copy_css_files() {
	# shellcheck disable=SC2012
	ls -1 css/*.css | while read -r FNAME; do
		copy_file "${FNAME}"
	done;
}

#
# Publish takes the content in the htdocs directory and copies it to the S3 bucket indicated by the environment
# variable BUCKET_NAME.
#
BUCKET_NAME=""
if [ -f "media.env" ]; then
	echo "Loading environment from media.env"
	# shellcheck disable=SC1091
	. media.env
fi
if [ "$BUCKET_NAME" = "" ]; then
	echo "No bucket to publish, set BUCKET_NAME"
	exit 1
fi

DRY_RUN=""
case "$1" in
	help|-h|--help)
	usage
	exit 0
	;;
  dry|dry-run|-dry-run|--dry-run)
  DRY_RUN="--dryrun"
  ;;
esac


echo "Copying file htdocs to $BUCKET_NAME"

copy_javascript_files 
copy_css_files
if [ "${DRY_RUN}" = "" ]; then
	invalidate_cdn "/*"
fi
