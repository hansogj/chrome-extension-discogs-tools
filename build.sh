 #!/bin/sh 
rm -rf extension/*
mkdir -p extension
node node_modules/browserify/bin/cmd.js src/discogs.js --standalone discogs > extension/discogs.js 
node node_modules/browserify/bin/cmd.js src/addToCollection.js --standalone discogs.addToCollection > extension/addToCollection.js 
node node_modules/browserify/bin/cmd.js src/addWantList.js --standalone discogs.addWantList > extension/addWantList.js 
node node_modules/browserify/bin/cmd.js src/filterSellers.js --standalone discogs.filterSellers > extension/filterSellers.js 
node node_modules/browserify/bin/cmd.js src/filterRelease.js --standalone discogs.filterRelease > extension/filterRelease.js 
cp assets/* extension/
