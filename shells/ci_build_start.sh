#!/usr/bin/env bash

NODE_VERSION="$(node -v)"
echo "node version is: " ${NODE_VERSION}
NPM_VERSION="$(npm -v)"
echo "npm version is: " ${NPM_VERSION}

DIR="$( pwd )"
echo "CI DIR is: " ${DIR}

# confirm that following operations are being executed in $DIR
cd $DIR

output="umi4-react-template"

echo "CI BUILD_NUMBER is: " ${BUILD_NUMBER}
if  [ -n "$BUILD_NUMBER" ] ;then
    output="${output}-${BUILD_NUMBER}"
fi

found=$(find . -type d -name "*umi4-react-template*")
echo "Injected found is: " ${found}

bash shells/build.sh

if [ $? -ne 0 ]; then
    echo "build failed, you need to find why!?!?!?!"
    exit -1
fi

if  [ -n "$found" ] ;then
    for foundDir in $found
    do
        bash ${foundDir}/bin/stop.sh
    done
fi

cd $output

# Node service set port 20000
export PORT=20000

BUILD_ID=dontKillMe nohup npm run server &

if [ $? -ne 0 ]; then
    echo "run server failed, you need to find error!!!!!!"
    exit -1
fi

echo "BUILD_ID: " ${BUILD_ID}

if  [ ! -n "$githubUserName" ] ;then
    githubUserName="sanshuiwang"
fi

if  [ -n "$found" ] ;then
    cd $DIR
    rm -rf $found
    echo "Previous deployed: ${found} is removed"
fi
