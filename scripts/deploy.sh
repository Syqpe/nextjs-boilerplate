#!/usr/bin/env bash

# Usage:
#
# chmod +x ./scripts/deploy.sh

# ./scripts/deploy.sh 1.0.0

set -e;

DOCKER_ORGANIZATION=<%= projectName %>;
DOCKER_PROJECT=front;

AWS_BUCKET=<%= projectName %>;
AWS_PROJECT=front;
AWS_PROFILE=<%= projectName %>;

function build_image() {
    tag=$1;

    docker build \
        --build-arg APP_VERSION=${TAG:=${tag}} \
        -t registry.yandex.net/${DOCKER_ORGANIZATION}/${DOCKER_PROJECT}:${tag} \
        .;

    docker push registry.yandex.net/${DOCKER_ORGANIZATION}/${DOCKER_PROJECT}:${tag};
}

function publish_static() {
    static_version=$1;

    aws s3 \
        --endpoint-url=https://s3.mds.yandex.net \
        --recursive \
        --profile=${AWS_PROFILE} \
        cp .next/static s3://${AWS_BUCKET}/${AWS_PROJECT}/${static_version}/_next/static/;
}

version=$1

if [ -z ${version} ]; then
    version=${USER}-$(date +"%Y-%m-%d_%H-%M-%S");
fi

export NEXT_TELEMETRY_DISABLED=1;

NODE_ENV=production APP_VERSION=${version} npm run build;
npm prune --production;
build_image ${version};
publish_static ${version};

echo -e "Successfully built version: \e[31m${version}\e[0m"
