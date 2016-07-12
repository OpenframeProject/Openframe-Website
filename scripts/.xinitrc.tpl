xscreensaver -no-splash

xset s off
xset -dpms
xset s noblank

unclutter -idle 0.1 &

exec /usr/bin/chromium --noerrdialogs --kiosk --incognito $flags "$url"
