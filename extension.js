"use strict";
var pjson = require('./package.json'),
    Extension = require('openframe-extension'),
    execSync = require('child_process').execSync,
    debug = require('debug')('openframe-website');

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
            var filePath = _cloneTemplate(this.xinitrcTplPath),
                // 2. parse options from args into tokens
                _tokens = _extendTokens(args, tokens);
            // 3. replace tokens in .xinitrc
            _replaceTokens(filePath, _tokens);
            // 4. return xinit
            return 'xinit ' + filePath;
        },
        'end_command': 'pkill -f X',
        xinitrcTplPath: __dirname + '/scripts/.xinitrc.tpl'
    },
});

/**
 * extend the tokens with expected values from args
 *
 * @param {object} args Arguments provided to this extension
 * @param {object} tokens Original tokens for this extension
 */
function _extendTokens(args, tokens) {
    var _tokens = {},
        expectedKeys = ['flags'];

    // shallow-copy the original tokens object
    for (let key in tokens) {
        _tokens[key] = tokens[key];
    }

    // copy expected arguments from args to the new tokens object
    // defaulting to an emptystring
    for (let key of expectedKeys) {
        // prepend keys with a dollar-sign for template-replacement
        _tokens['$'+key] = args[key] || '';
    }

    return _tokens;
}

/**
 * Replace tokens in a file.
 *
 * @param  {string} _str
 * @param  {object} tokens
 * @return {string} The string with tokens replaced.
 */
function _replaceTokens(filePath, tokens) {
    debug(_replaceTokens, filePath, tokens);

    function replace(token, value) {
        // tokens start with a $ which needs to be escaped, oops
        var _token = '\\' + token,
            // any '&' character needs to be escaped in the value,
            //  otherwise it is used as a backreference
            _value = value.replace(/&/g, '\\&'),
            // use commas as delims so that we don't need to escape value, which might be a URL
            cmd = 'sed -i "s,' + _token + ',' + _value + ',g" ' + filePath;
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
