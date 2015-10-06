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
}

function inferDateFromFilename(path){
    var i, test, testResult,
        testList = [
            // WhatsApp image file names
            function testWhatsApp(filePath){
                var r = /IMG\-(\d{8})\-WA\d+\..*/,
                    rRes = r.exec(filePath),
                    dateFragment, year, month, day;

                if (rRes && rRes.length > 1){
                    dateFragment = rRes[1];
                    year = dateFragment.substr(0,4);
                    month = dateFragment.substr(4,2);
                    day = dateFragment.substr(6,2);

                    return new Date(year + '-' + month + '-' + day);
                } else {
                    return false;
                }
            }
        ];

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

function main(){

}

module.exports = {
    getFileExifDateTimeOriginal: getFileExifDateTimeOriginal,
    inferDateFromFilename: inferDateFromFilename,
    setFileExifDateTimeOriginal: setFileExifDateTimeOriginal,
    getImagesPaths: getImagePaths
};