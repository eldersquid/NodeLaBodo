const moment = require('moment');

module.exports = {
    replaceCommas: function (str) {
        const json = str.toString();
        if (json != null || json.length !== 0) {
            if (json.trim().length !== 0) {
                // uses pattern-matching string /,/g for ','
                return json.replace(/,/g, ' | ');
            }
            console.log(json);
        }
        return 'None';
    },

};