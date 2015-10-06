var expect = require('chai').expect,
    index = require('../index.js'),
    path = require('path'),
    fs = require('fs');

describe('index.js', function(){
    describe('getFileExifDateTimeOriginal(path)', function(){
        beforeEach(function(ready){
            ready();
        });

        it('returned promise should resolve to exif DateTimeOriginal string', function(done){
            var exifDateString = index.getFileExifDateTimeOriginal(path.resolve(__dirname, '../test_data/has-date.jpg'))
            expect(exifDateString).not.to.be.null;
            expect(exifDateString).to.equal("2015:09:09 08:00:00");
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
            var imgPath = path.resolve(__dirname, '../test_data/whatsapp_messenger/IMG-20150909-WA0000.jpg'),
                imgPathComp = path.parse(imgPath),
                expectedOutPath = path.resolve(imgPathComp.dir, imgPathComp.name + '_date_inferred' + imgPathComp.ext),
                targetDate = index.inferDateFromFilename(imgPath),
                exifDateString;

            index.setFileExifDateTimeOriginal(imgPath, targetDate);
            exifDateString = index.getFileExifDateTimeOriginal(expectedOutPath);
            try {
                expect(exifDateString).not.to.be.null;
                expect(exifDateString).to.equal("2015:09:09 00:00:00");
                done()
            } catch (err) {
                done(err);
            } finally {
                fs.unlinkSync(expectedOutPath);
            }
        });

        it ('should write the Exif DateTimeOriginal tag to an existing image file (overwrite == true)', function(done){
            var originalFilePath = path.resolve(__dirname, '../test_data/whatsapp_messenger/IMG-20150909-WA0000.jpg'),
                imgPath = path.resolve(__dirname, '../test_data/whatsapp_messenger/IMG-20150123-WA0000.jpg'),
                imgData = fs.readFileSync(originalFilePath);

            // Make a copy to use for testing
            fs.writeFileSync(imgPath, imgData);

            var expectedOutPath = imgPath,
                targetDate = index.inferDateFromFilename(imgPath),
                exifDateString;

            index.setFileExifDateTimeOriginal(imgPath, targetDate, true);
            exifDateString = index.getFileExifDateTimeOriginal(expectedOutPath);
            try {
                expect(exifDateString).not.to.be.null;
                expect(exifDateString).to.equal("2015:01:23 00:00:00");
                done();
            } catch(err) {
                done(err);
            } finally {
                fs.unlinkSync(imgPath);
            }
        });
    });

    describe('getImagePaths(dir)', function(){
        it('should return and array with 2 file paths', function(done){
            var paths = index.getImagesPaths(path.resolve(__dirname, '../test_data'));
            console.log(paths);
            try {
                expect(paths).to.be.an.instanceof(Array);
                expect(paths.length).to.equal(1);
                done();
            } catch(err) {
                done(err);
            } finally {

            }
        });
    });
});