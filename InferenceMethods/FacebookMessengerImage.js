// Get date from Facebook Messenger received files
// e.g. received_m_mid_1402994966597_75ef75bad1cf091709_15
module.exports = function testFBMessenger(filePath){
    var r = /received_m_mid_(\d+)_.*/,
        rRes = r.exec(filePath),
        dateFragment;

    if (rRes && rRes.length > 1){
        dateFragment = rRes[1];

        return new Date(parseInt(dateFragment));
    } else {
        return false;
    }
};