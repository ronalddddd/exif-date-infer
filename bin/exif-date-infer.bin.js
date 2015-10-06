#!/usr/bin/env node
var app = require('../index'),
    options = {};

//console.log(process.argv);

if (process.argv.length > 2){
    options.dir = process.argv[2];
}

if (process.argv.length > 3 && process.argv[3] === '--overwrite'){
    options.overwrite = true;
}

app.main(options);