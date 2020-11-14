apt-get update && \
apt-get upgrade -y && \
apt-get install -y curl nginx git htop && \

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.0/install.sh | bash && \
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && \
nvm install 15.2.0 && nvm use 15.2.0 && \
npm i -g npm@7.0.11 && \
npm install pm2 -g && \


systemctl stop nginx && \
apt-get install -y snapd && \
snap install core && \
snap refresh core && \
snap install --classic certbot && \
ln -s /snap/bin/certbot /usr/bin/certbot && \


apt install -y mongodb && \
systemctl start mongodb.service && \
systemctl enable mongodb


certbot certonly --standalone --preferred-challenges http -d example.com
ps -ax | grep node
service nginx reload
