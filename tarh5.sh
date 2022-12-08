#!/bin/bash
taro build --type h5
projectPath=$(pwd)
echo "$projectPath" 
# /f/stateGrid/11tarobaseProject/taroBaseProject
projectName="${projectPath##*/}"
echo "$projectName"
# taroBaseProject
projectLine=$(cat wsgwConfigure.json | grep $projectName )
echo "$projectLine"
#  "taroBaseProject":"taroBaseProject123"
zipFileName=`echo ${projectLine#*:} | sed 's/\"//g' | sed 's/,//g'` 
echo $zipFileName
# taroBaseProject123
zipPath=$projectPath"/dist/h5"
echo $zipPath
# /f/stateGrid/11tarobaseProject/taroBaseProject/dist/h5
cd $zipPath
zip -r $zipFileName $zipFileName