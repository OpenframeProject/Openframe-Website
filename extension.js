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
            // 1. clone template .xinitrc
            var filePath = _cloneTemplate(this.xinitrcTplPath);
            // 1. replace tokens in .xinitrc
            _replaceTokens(filePath, tokens);
            // 2. return xinit
            return 'xinit ' + filePath;
        },
        'end_command': 'pkill -f X',
        xinitrcTplPath: __dirname + '/scripts/.xinitrc.tpl'
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
    console.log(_replaceTokens, filePath, tokens);

    function replace(token, value) {
        // tokens start with a $ which needs to be escaped, oops
        var _token = '\\' + token,
            // use commas as delims so that we don't need to escape value, which might be a URL
            cmd = 'sed -i "s,' + _token + ',' + value + ',g" ' + filePath;
        execSync(cmd);
    }

    var key;
    for (key in tokens) {
        // TODO: better token replacement (global replacement?
        replace(key, tokens[key]);
    }
}

/**
 * Clone xinitrc
 *
 * @return {string} The string with tokens replaced.
 */
function _cloneTemplate(filePath) {
    var newFilePath = filePath.replace('.tpl', ''),
        cmd = 'cp -f ' + filePath + ' ' + newFilePath;

    execSync(cmd);

    return newFilePath;
}
