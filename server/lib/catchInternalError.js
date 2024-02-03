/**
 * Info: Handles 500 internal errors
 * Author: Sushil Thakur
 * Date: 13 August 2023
 */

function catchIE(res, err) {
    console.log(err);
    res.status(500).json({message: 'An internal error occurred.'})
}

module.exports.catchIE = catchIE;