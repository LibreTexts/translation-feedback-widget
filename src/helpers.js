//
// LibreTexts Translation Feedback Widget
// helpers.js (helper functions)
//

/**
 * Helper function to check for empty strings.
 */
function isEmptyString(str) {
    if (typeof str === 'string') {
        return (!str || str.trim().length === 0 );
    } else {
        return false;
    }
}

module.exports = {
    isEmptyString
}
