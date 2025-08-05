#!/bin/bash

#
# Publish takes the content in the htdocs directory and copies it to the S3 bucket indicated by the environment
# variable BUCKET.
#
BUCKET="s3://media.library.caltech.edu"
if [ -f "media.env" ]; then
	echo "Loading environment from media.env"
	. media.env
fi
if [ "$BUCKET_NAME" = "" ]; then
	echo "No bucket to publish, set BUCKET_NAME"
	exit 1
fi

# Invalidate cloud front
do_invalidate_cdn() {
	INVALID_PATH="$1"
	if [ "$DISTRIBUTION_ID" != "" ]; then
		echo "Invalidating CDN"
		aws cloudfront create-invalidation \
			--distribution-id "$DISTRIBUTION_ID" \
			--paths "${INVALID_PATH}"
	else 
		echo "skipping invalidation, DISTRIBUTION_ID not set"
	fi
}


echo "Invalidating CDN for $BUCKET_NAME"

if [ "$1" != "" ]; then
	do_invalidate_cdn "$1"
else
	do_invalidate_cdn '/*'
fi
