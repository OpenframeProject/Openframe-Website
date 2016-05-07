var assert = require('assert'),
    exec = require('child_process').exec,
    fs = require('fs'),
    Extension = require('openframe-extension'),
    WebsiteExtension = require('../extension');

describe('instantiation', function() {
    it('should be an instance of type Extension', function() {
        assert(WebsiteExtension instanceof Extension);
    });
});

describe('properties', function() {
    before(function(done) {
        exec('cp ' + __dirname + '/.xinitrc.spec ' + __dirname + '/.xinitrc', done);
    });

    after(function(done) {
        exec('rm ' + __dirname + '/.xinitrc', done);
    });

    it('should include all required format properties', function() {
        var format = WebsiteExtension.props.format;

        assert(format.name);
        assert(typeof format.name === 'string');

        assert(format.display_name);
        assert(typeof format.display_name === 'string');

        assert(format.download !== undefined);
        assert(typeof format.download === 'boolean');

        assert(format.start_command);
        assert(typeof format.start_command === 'string' || typeof format.start_command === 'function');

        if (typeof format.start_command === 'function') {
            assert(typeof format.start_command() === 'string');
        }

        assert(format.end_command);
        assert(typeof format.end_command === 'string');
    });

    it('start_command should update .xinitrc file with supplied token', function(done) {
        var format = WebsiteExtension.props.format,
            command,
            expected = 'exec /usr/bin/chromium --noerrdialogs --kiosk --incognito http://test.com';

        // use test .xinitrc
        format.xinitrcPath = __dirname + '/.xinitrc';

        // replace $url token with url string
        command = format.start_command({}, {
            $url: 'http://test.com'
        });

        assert(typeof command === 'string');

        fs.readFile(format.xinitrcPath, 'utf8', function(err, data) {
            if (err) throw err;
            assert.equal(data, expected);
            done();
        });
    });
});
