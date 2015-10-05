var expect = require('chai').expect,
    index = require('../index.js'),
    path = require('path');

describe('index.js', function(){
    describe('getFileExifDateTimeOriginal(path)', function(){
        beforeEach(function(ready){
            ready();
        });

        it('returned promise should resolve to exif DateTimeOriginal string', function(done){
            var exifDateString = index.getFileExifDateTimeOriginal(path.resolve(__dirname, '../test_data/has-date.jpg'))
            expect(exifDateString).not.to.be.null;
            expect(exifDateString).to.equal("2015:09:27 23:30:17");
            done();
        });
    });

    describe('inferDateFromFilename(path)', function(){
        it ('should return a correct date inferred from a recognized filename format', function(done){
            var expectedTime = new Date('2015-09-09').getTime(),
                inferredDate = index.inferDateFromFilename('/tmp/IMG-20150909-WA0000.jpeg');
            console.log(inferredDate);
            expect(inferredDate).to.be.an.instanceof(Date);
            expect(inferredDate.getTime()).to.equal(expectedTime);
            done();
        });
    });

    describe('setFileExifDateTimeOriginal(path, date, overwrite)', function(){
        it ('should write the Exif DateTimeOriginal tag to a new image file (overwrite == false)', function(done){
            var imgPath = path.resolve(__dirname, '../test_data/IMG-20150909-WA0000.jpeg'),
                imgPathComp = path.parse(imgPath),
                expectedOutPath = path.resolve(imgPathComp.dir, imgPathComp.name + '_date_inferred' + imgPathComp.ext),
                targetDate = index.inferDateFromFilename(imgPath),
                exifDateString;

            index.setFileExifDateTimeOriginal(imgPath, targetDate);
            exifDateString = index.getFileExifDateTimeOriginal(expectedOutPath);
            expect(exifDateString).not.to.be.null;
            expect(exifDateString).to.equal("2015:09:09 08:00:00");
            done();
        });
    });
});