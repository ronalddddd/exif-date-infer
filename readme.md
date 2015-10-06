[![Build Status](https://travis-ci.org/ronalddddd/exif-date-infer.svg)](https://travis-ci.org/ronalddddd/exif-date-infer)

# exif-date-infer

Adds Exif tag `DateTimeOriginal` to an image using a date inferred from the filename, if the file does not have an exif date entry already.
Useful for adding back Exif dates to images received from messengers like WhatsApp and Facebook Messenger before importing to your photo library.
 
Currently only supports WhatsApp and Facebook Messenger image filenames.

*I'm not responsible for any issues, problems, lost of data from the use of this software. Always remember to backup your data before manipulating them!*

# Install

        npm install -g exif-date-infer

# Usage

        exif-date-infer /path/to/your/images [--overwrite] [--force]


- `--overwrite` will write the exif data back into your current image file, where as the default behavior is to create a new file with the `_date_inferred` suffix added to the original filename.
- `--force` will force writing of inferred date even if exif already exists in the original image.


# Running Tests

        npm test
        
# TODOs

Pull requests are welcome!
 
- [ ] Add more date inference methods/patterns (see the `InferenceMethods` directory)
- [ ] Write test for fb messenger inference method
