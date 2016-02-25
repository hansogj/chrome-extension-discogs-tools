 #!/bin/sh 
rm -rf extension/*
mkdir extension
node node_modules/browserify/bin/cmd.js src/addToCollection.js --standalone addToCollection > extension/addToCollection.js 
node node_modules/browserify/bin/cmd.js src/discogs.js --standalone discogs > extension/discogs.js 
node node_modules/browserify/bin/cmd.js src/uniqueSeller.js --standalone uniqueSeller > extension/uniqueSeller.js 
cp assets/* extension/
