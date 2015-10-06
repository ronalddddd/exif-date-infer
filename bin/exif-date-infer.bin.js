#!/usr/bin/env node
var app = require('../index'),
    options = {},
    path = require('path'),
    optIndex = 3;

//console.log(process.argv);

if (process.argv.length > 2){
    options.dir = path.resolve(process.cwd(), process.argv[2]);
}

if (process.argv.length > 3){
    for(optIndex; optIndex < process.argv.length; optIndex++){
        switch (process.argv[optIndex]){
            case '--overwrite':
                console.log('Setting overwrite mode');
                options.overwrite = true;
                break;
            case '--force':
                console.log('Setting force mode');
                options.force = true;
                break;
            default:
                throw new Error('Unrecognized option ', process.argv[optIndex]);
        }
    }
}

app.main(options);