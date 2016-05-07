var pjson = require('./package.json'),
    Extension = require('openframe-extension'),
    execSync = require('child_process').execSync;

/**
 * Extensions should expose an instance of the Extension class.
 *
 * For info on building extensions, see [Openframe-Extension](https://github.com/OpenframeProject/Openframe-Extension).
 */
module.exports = new Extension({
    format: {
        // the name should be the same as the package name
        'name': pjson.name,
        // this is what might get displayed to users (not currently used)
        'display_name': 'Website',
        'download': false,
        'start_command': function(args, tokens) {
            // 1. replace tokens in .xinitrc
            _replaceTokens(this.xinitrcPath, tokens);
            // 2. return xinit
            return 'xinit ' + this.xinitrcPath;
        },
        'end_command': 'sudo pkill -f chromium',
        xinitrcPath: __dirname + '/scripts/.xinitrc'
    },
});

/**
 * Replace tokens in a file.
 *
 * @param  {string} _str
 * @param  {object} tokens
 * @return {string} The string with tokens replaced.
 */
function _replaceTokens(filePath, tokens) {

    function replace(token, value) {
        // tokens start with a $, oops
        token = '\\' + token;
        var cmd = 'sed -i "s,' + token + ',' + value + ',g" ' + filePath;
        execSync(cmd);
    }

    var key;
    for (key in tokens) {
        // TODO: better token replacement (global replacement?
        replace(key, tokens[key]);
    }
}
