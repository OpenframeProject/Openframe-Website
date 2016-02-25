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
