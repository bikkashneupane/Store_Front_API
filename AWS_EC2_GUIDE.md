1. Connect to EC2 instance
2. Set up the environment on EC2

   1. Install necessary software:

      1. # Node and NPM

         sudo apt update
         sudo apt install -y nodejs npm

      2. # Git

         sudo apt install git

      3. # Caddy:
         sudo apt install -y debian-keyring debian-archive-keyring
         curl -fsSL https://apt.fury.io/caddy/stable/gpg | gpg --dearmor -o /usr/share/keyrings/caddy-archive-keyring.gpg
         echo "deb [signed-by=/usr/share/keyrings/caddy-archive-keyring.gpg] https://apt.fury.io/caddy/stable/ /" | sudo tee /etc/apt/sources.list.d/caddy-stable.list
         sudo apt update
         sudo apt install caddy

   2. Git clone your repository

      - git clone https://github.com/bikkashneupane/Store_Front_API.git
      - cd vikiasmy-watches

   3. Install Dependencies
      npm install

   4. Add .env file

   5. Create Caddyfile for your project:

      - sudo nano /etc/caddy/Caddyfile

      - Edit the caddy file:
        api-vikiasmy.bikashneupane.com {
        reverse_proxy localhost:5000
        encode gzip
        }

   6. IN AWS Route 53, add the api endpoint for the record as public ip address provided by your ec2 instance

3. Running your API continuously

   1. Create a systemd service to run your Node.js API continuously:

      - sudo nano /etc/systemd/system/api-vikiasmy.service
      - Edit like below
      - [Unit]
        Description=API Vikiasmy Service
        After=network.target

        [Service]
        ExecStart=/usr/bin/node /home/ubuntu/Store_Front_API/server.js
        WorkingDirectory=/home/ubuntu/Store_Front_API
        Restart=always
        RestartSec=10
        User=ubuntu
        Environment=NODE_ENV=production
        Environment=PORT=8010

        [Install]
        WantedBy=multi-user.target

   2. Enable and start the service:

      1. Enable the service to start on boot:

         - sudo systemctl enable api-vikiasmy.service

      2. Start the service:

         - sudo systemctl start api-vikiasmy.service

      3. Check the status of the service to ensure it's running:
         - sudo systemctl status api-vikiasmy.service

   3. Set up SSL with Let's Encrypt using Caddy

      - Caddy automatically obtains SSL certificates from Let's Encrypt for your domain, so you don’t have to manually set it up.

      - To force Caddy to reissue the certificate and use HTTPS:
        - sudo systemctl restart caddy

   4. Test:
      - visit the api site
