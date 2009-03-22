#!/usr/bin/env sh

if [ -z "$1" ]; then
echo "ERROR: need to specify version"
  exit
fi

temp_dir="./jquery-simple-tooltip-$1"

mkdir $temp_dir
cp ./jquery.simpletooltip.js $temp_dir
cp ./jquery.simpletooltip-min.js $temp_dir
cp ./index.html $temp_dir
cp ./style.css $temp_dir
cp ./MIT-LICENSE.txt $temp_dir
cp ./README $temp_dir

zip $temp_dir.zip $temp_dir
rm -rf $temp_dir