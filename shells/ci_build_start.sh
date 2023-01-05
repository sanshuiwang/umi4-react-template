#!/usr/bin/env bash

DIR="$(dirname $( cd "$( dirname "$0"  )" && pwd  ) )"

# confirm that following operations are being executed in $DIR
cd $DIR

output="umi4-react-template"

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

export PORT=20000

BUILD_ID=dontKillMe nohup npm run serve &

if  [ ! -n "$githubUserName" ] ;then
    githubUserName="sanshuiwang"
fi

if  [ -n "$found" ] ;then
    cd $DIR
    rm -rf $found
    echo "Previous deployed: ${found} is removed"
fi
