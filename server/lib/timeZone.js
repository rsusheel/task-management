const { DateTime } = require('luxon');

function gmtToist(gmtDatetime) {
    const istDatetime = DateTime.fromJSDate(gmtDatetime).setZone('Asia/Kolkata');
    return istDatetime;
}

function istTogmt(istDatetime) {
    const gmtDatetime = DateTime.fromJSDate(istDatetime).setZone('UTC');
    return gmtDatetime;
}

module.exports.gmtToist = gmtToist;
module.exports.istTogmt = istTogmt;
