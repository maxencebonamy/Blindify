#!/bin/sh

cat <<EOF > /usr/share/nginx/html/runtime-config.js
window.RUNTIME_CONFIG = {
	VITE_BACKEND_URL: "${VITE_BACKEND_URL}",
	VITE_APP_REDIRECT_URL: "${VITE_APP_REDIRECT_URL}"
};
EOF

nginx -g 'daemon off;'
