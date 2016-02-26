 #!/bin/sh 
rm -rf extension/*
mkdir -p extension
node node_modules/browserify/bin/cmd.js src/addToCollection.js --standalone addToCollection > extension/addToCollection.js 
node node_modules/browserify/bin/cmd.js src/discogs.js --standalone discogs > extension/discogs.js 
node node_modules/browserify/bin/cmd.js src/filterSellers.js --standalone filterSellers > extension/filterSellers.js 
cp assets/* extension/
