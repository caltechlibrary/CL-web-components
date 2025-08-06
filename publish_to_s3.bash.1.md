Loading environment from media.env
%publish_to_s3.bash(1) user manual
% R. S. Doiel
% 2025-08-06

# NAME

publish_to_s3.bash

# SYNOPSIS

publish_to_s3.bash [OPTION]

# DESCRIPTION

publish_to_s3.bash copies the web components and related CSS to the s3 bucket based
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
publish_to_s3.bash help
publish_to_s3.bash dry-run
publish_to_s3.bash
~~~

