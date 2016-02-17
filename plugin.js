var pjson = require('./package.json'),
    plugin = module.exports = {};

/**
 * Plugin initialization method.
 *
 * Called when the plugin (and its dependencies) have been installed.
 *
 * @param  {object} ofPluginApi An interface provided to plugins giving limitted access to the frame environment
 */
plugin.init = function(ofPluginApi) {
    // do your plugin thing
    console.log('=======>   Openframe-Image initialized!   <=======');

    /**
     * Plugins can add new artwork formats to the frame.
     *
     * Each format must have a unique name, which should correspond to the
     * name of the npm package.
     */
    ofPluginApi.addFormat(
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

    /**
     * Plugins also have access to the global event system
     */
    plugin.pubsub = ofPluginApi.getPubsub();

    /**
     * Plugins also have access to the Swagger REST client (https://github.com/swagger-api/swagger-js)
     * See openframe.io/explorer for API docs, or openframe.io/explorer/swagger.json for the swagger definition
     * which shows the available methods as 'operationId'
     */
    plugin.rest = ofPluginApi.rest();
};

