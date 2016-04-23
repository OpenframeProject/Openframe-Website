var pjson = require('./package.json'),
    Extension = require('openframe-extension');

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
        'start_command': 'xinit /usr/bin/chromium --kiosk $url',
        'end_command': 'sudo pkill -f chromium'
    }
});
