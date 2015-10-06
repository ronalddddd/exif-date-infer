// Get date from WhatsApp image filename
module.exports = function testWhatsApp(filePath){
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
};