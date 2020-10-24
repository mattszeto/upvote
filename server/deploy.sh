#!/bin/bash

echo version?
read VERSION

# inside /server
docker build -t mattszeto/upvote:$VERSION .
docker push mattszeto/upvote:$VERSION
ssh root@138.68.5.108 "docker pull mattszeto/upvote:$VERSION && 
                  docker tag mattszeto/upvote:$VERSION dokku/api:$VERSION && 
                  dokku deploy api $VERSION"