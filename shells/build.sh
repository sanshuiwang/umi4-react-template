#!/usr/bin/env bash

DIR="$( pwd )"
echo "BUILD DIR is: " ${DIR}

# confirm that following operations are being executed in $DIR
cd $DIR

output="umi4-react-template"

echo "BUILD BUILD_NUMBER is: " ${BUILD_NUMBER}
if  [ -n "$BUILD_NUMBER" ] ;then
    output="${output}-${BUILD_NUMBER}"
fi

# 删除之前打包好的项目
rm -rf ./*-zip-dist ./dist ./umi4-react-template*.zip
mkdir ./${output}
mkdir ./${output}/bin

rm -rf package-lock.json

yarn

if [ $? -ne 0 ]; then
    echo "Install dependencies failed, check network first!?!?!?!"
    exit -1
fi

yarn run build

if [ $? -ne 0 ]; then
    echo "Build failed, check your code"
    exit -1
fi

# 移动dist目录到打包目录
mv ./dist ./${output}

# 拷贝server目录到打包目录
cp -r ./server ./${output}

# 拷贝package.json到打包目录
cp ./package.json ./${output}

# 拷贝stop.sh到打包目录
cp ./shells/stop.sh ./${output}/bin

# 进入打包目录
cd ./${output}

# 安装运行时依赖
npm install express --registry=https://registry.npmmirror.com

if [ $? -ne 0 ]; then
    echo "Install runtime [express] dependencies failed, check network first!?!?!?!"
    exit -1
fi

# 退回到打包目录上一级
cd ../

# 生成压缩包
zip -r "${output}.zip" ./${output}
