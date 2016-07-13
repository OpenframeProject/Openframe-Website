xscreensaver -no-splash

xset s off
xset -dpms
xset s noblank

matchbox-window-manager -use_cursor no &

exec /usr/bin/chromium --noerrdialogs --kiosk --incognito $flags "$url"
