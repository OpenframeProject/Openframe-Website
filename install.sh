#!/bin/bash
#
# Be VERY Careful. This script may be executed with admin privileges.

echo "Openframe Website Extension -- install.sh"

# Some limited platform detection might be in order... though at present we're targeting the Pi
os=$(uname)
arq=$(uname -m)

if [ $os == "Linux" ]; then

    # on Debian Linux distributions
    sudo apt-get update
    # do we really want to upgrade? this could take a damn long time.
    # sudo apt-get upgrade

    # same for any debian disto (untested), including rpi (tested)
    sudo apt-get install chromium
    
    #install chromium from source if not available via apt-get
    # Raspbian Jesse does not include chromium in apt-get
    if ! dpkg -s chromium; then
        # Raspbian Jesse does not have chromium in its repositories
        # adapted from https://medium.com/@icebob/jessie-on-raspberry-pi-2-with-docker-and-chromium-c43b8d80e7e1#6afd
        # files from https://launchpad.net/ubuntu/+source/chromium-browser/
        cfile=$(mktemp)
        wget https://launchpad.net/ubuntu/+archive/primary/+files/chromium-browser_48.0.2564.116-0ubuntu0.15.10.1.1221_armhf.deb -O $cfile
        fffile=$(mktemp)
        wget https://launchpad.net/ubuntu/+archive/primary/+files/chromium-codecs-ffmpeg-extra_48.0.2564.116-0ubuntu0.15.10.1.1221_armhf.deb -O $fffile
        if ! sudo dpkg -i $fffile $cfile; then
            #resolve "package old or missing" error
            sudo apt-get install -f
            sudo dpkg -i $fffile $cfile
        fi
        #clean up
        rm $cfile $fffile
    fi

    if [ $arq == "armv7l" ]; then
        # on RaspberryPi

        # ####
        #
        # FOR NOW, CODE GOES HERE since we're shooting for RPi support
        #
        # ####

        # TODO: update chromium window_placement settings
        echo "armv7l"


    else
        # Non-arm7 Debian...
        echo "non armv7l"
    fi

elif [ $os == "Darwin" ]; then
    # OSX
    echo "osx"
fi
