var fs = require('fs'),
    pathTool = require('path'),
    piexif = require('piexifjs'),
    moment = require('moment');

function getFileExifDateTimeOriginal(path){
    var data = piexif.load(fs.readFileSync(path).toString("binary"));

    return data.Exif[piexif.ExifIFD.DateTimeOriginal];
}

function setFileExifDateTimeOriginal(path, date, overwrite){
    var exifDate = (date && date instanceof Date)? date : inferDateFromFilename(pathTool.parse(path).base);

    if (!exifDate){
        console.warn('Cannot infer date for file %s', path);
        return;
    }

    var data = fs.readFileSync(path).toString("binary"),
        exifObject = piexif.load(data), // load existing exif data so we don't lose them when saving the new one
        m = new moment(exifDate),
        exifDateString = m.format('YYYY:MM:DD HH:mm:ss');

    // see https://www.npmjs.com/package/piexifjs
    exifObject.Exif[piexif.ExifIFD.DateTimeOriginal] = exifDateString;
    var exifBytes = piexif.dump(exifObject),
        newData = piexif.insert(exifBytes, data),
        newJpeg = new Buffer(newData, 'binary'),
        pathComponents = pathTool.parse(path),
        writePath = (overwrite)? path : pathTool.join(pathComponents.dir, pathComponents.name + '_date_inferred' + pathComponents.ext);

    fs.writeFileSync(writePath, newJpeg);
    return writePath;
}

function inferDateFromFilename(path){
    var i, test, testResult,
        testList = require('./InferenceMethods').list;

    for(i=0; i < testList.length; i++){
        test = testList[i];
        testResult = test(path);

        if(testResult && testResult instanceof Date){
            return testResult;
        }
    }
}

function getImagePaths(dir){
    var dirList = fs.readdirSync(dir).map(function(filename){
            return pathTool.resolve(dir, filename);
        }),
        imagePaths = [];

    dirList.forEach(function(path){
        var pathStat = fs.statSync(path),
            pathComp = pathTool.parse(path),
            extNormalized = pathComp.ext.toLowerCase();

        if ( !pathStat.isDirectory() && extNormalized === '.jpg' || extNormalized === '.jpeg'){
            imagePaths.push(path);
        }
    });

    return imagePaths;
}

function main(options){
    options = options || {};
    var dir = options.dir || process.cwd(),
        overwrite = options.overwrite || false,
        imagePaths = getImagePaths(dir),
        writeCount = 0, readCount = 0;

    imagePaths.forEach(function(path){
        console.log('Checking %s...',path);
        var existingDateTimeOriginal = getFileExifDateTimeOriginal(path),
            writePath;

        readCount++;
        if(!existingDateTimeOriginal){
            writePath = setFileExifDateTimeOriginal(path, inferDateFromFilename(path), overwrite);
            writeCount++;
            console.log('(%s) Wrote to %s', writeCount, writePath);
        }
    });

    console.log('Checked %s files, wrote %s files.', readCount, writeCount);
}

module.exports = {
    getFileExifDateTimeOriginal: getFileExifDateTimeOriginal,
    inferDateFromFilename: inferDateFromFilename,
    setFileExifDateTimeOriginal: setFileExifDateTimeOriginal,
    getImagesPaths: getImagePaths,
    main: main
};