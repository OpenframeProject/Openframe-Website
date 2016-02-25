var pjson = require('./package.json'),
    debug = require('debug')('openframe:website'),
    extension = module.exports = {};

/**
 * Extension initialization method.
 *
 * Called when the extension (and its dependencies) have been installed.
 *
 * @param  {object} OF An interface provided to extensions giving limitted access to the frame environment
 */
extension.init = function(OF) {
    // do your extension thing
    debug('=======>   Openframe-Website initialized!   <=======');

    /**
     * Extensions can add new artwork formats to the frame.
     *
     * Each format must have a unique name, which should correspond to the
     * name of the npm package.
     */
    OF.addFormat(
        {
            // the name should be the same as the package name
            'name': pjson.name,
            // this is what might get displayed to users (not currently used)
            'display_name': 'Website',
            'download': false,
            'start_command': 'xinit /usr/bin/chromium --kiosk $url',
            'end_command': 'sudo pkill -f chromium'
        }
    );
};

