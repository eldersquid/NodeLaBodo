const moment = require('moment');

module.exports = {
    replaceCommas: function (str) {
        if (str != null || str.length !== 0) {
            if (str.trim().length !== 0) {
                // uses pattern-matching string /,/g for ','
                return str.replace(/["[\]]/g, '').replace(/,/g, ', ');
            }
        }
        return 'None';
    }
};