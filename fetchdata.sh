#!/bin/bash

curl -G -d action=getWebAppData -d confid=65 http://cdh.esri.com/2.0/ > curl-sessions.json

F1=sessions.json
F2=curl-sessions.json
S1=$(wc -c $F1 |  cut -f 2 -d ' ')
S2=$(wc -c $F2 |  cut -f 2 -d ' ')

echo "Sizes $S1, $S2"

if [ $S1 -ne $S2 ]; then
  rm $F1
  mv $F2 sessions.json
  node cull.js
  echo "Updated sessions.json."
else 
  echo "Files same size, no need to update."
fi
#rm curl-sessions.json