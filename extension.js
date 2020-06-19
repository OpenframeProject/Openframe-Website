'use strict';
var pjson = require('./package.json'),
    Extension = require('openframe-extension'),
    execSync = require('child_process').execSync,
    debug = require('debug')('openframe-website'),
    psList = require('ps-list');

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
            return new Promise(function(resolve, reject) {
                // is X server running?
                psList().then(function(processes) {
                    processes = processes.filter(function(process) { process.name.indexOf('Xorg') > -1; });
                    let commandLineMode = processes.length > 0;

                    // parse options from args into tokens
                    let _tokens = _extendTokens(args, tokens);

                    // command line mode
                    if (commandLineMode) {
                        // clone template .xinitrc
                        var filePath = _cloneTemplate(this.xinitrcTplPath);
                        // replace tokens in .xinitrc
                        _replaceTokens(filePath, _tokens);
                        // return xinit
                        resolve('xinit ' + filePath);
                    }
                    // desktop mode
                    else {
                      
                        // var command = '/usr/bin/chromium --noerrdialogs --kiosk --incognito $flags "$url"'
                        var command = '/usr/bin/chromium --noerrdialogs --incognito --kiosk '
                         // _tokens['$flags'].forEach(function(flag, index) {
                         //   command += '--' + flag + ' ';              
                         // })
                        command += _tokens['$url']
                        // console.log(command)
                        resolve(command);
                    }
                });


            });

        },
        // 'end_command': 'pkill -f X',
        'end_command': 'pkill -f chromium', // TODO: kill x server in command line mode
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
        _args = args,
        expectedKeys = ['flags'];

    // if args is not an object, we'll just use an empty one
    if (typeof(args) !== 'object') {
        _args = {};
    }

    // shallow-copy the original tokens object
    for (let key in tokens) {
        _tokens[key] = tokens[key];
    }

    // copy expected arguments from args to the new tokens object
    // defaulting to an emptystring
    for (let key of expectedKeys) {
        // prepend keys with a dollar-sign for template-replacement
        _tokens['$'+key] = _args[key] || '';
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
