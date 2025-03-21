#!/bin/bash

# Create directories
mkdir -p nginx/ssl
mkdir -p nginx/www

# Generate root CA
openssl genrsa -out nginx/ssl/rootCA.key 4096
openssl req -x509 -new -nodes -key nginx/ssl/rootCA.key -sha256 -days 1024 -out nginx/ssl/rootCA.crt \
  -subj "/C=US/ST=State/L=City/O=Organization/OU=IT Department/CN=localhost"

# Generate server key
openssl genrsa -out nginx/ssl/server.key 2048

# Generate server certificate signing request
openssl req -new -key nginx/ssl/server.key -out nginx/ssl/server.csr \
  -subj "/C=US/ST=State/L=City/O=Organization/OU=IT Department/CN=localhost"

# Create config for Subject Alternative Names
cat > nginx/ssl/server.ext << EOF
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
IP.1 = 127.0.0.1
EOF

# Generate server certificate
openssl x509 -req -in nginx/ssl/server.csr -CA nginx/ssl/rootCA.crt -CAkey nginx/ssl/rootCA.key \
  -CAcreateserial -out nginx/ssl/server.crt -days 825 -sha256 \
  -extfile nginx/ssl/server.ext

# Create sample HTML files
cat > nginx/www/index.html << EOF
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Survival App</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
        }
        h1 {
            color: #2c3e50;
        }
        .status {
            padding: 15px;
            background-color: #e7f5ea;
            border-left: 5px solid #2ecc71;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <h1>Survival App Server</h1>
    <div class="status">
        <p>✅ Server is running</p>
        <p>API is available at <code>/api</code></p>
        <p>Health check is available at <code>/health</code></p>
    </div>
</body>
</html>
EOF

cat > nginx/www/404.html << EOF
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 - Not Found</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 50px;
            background: #f8f9fa;
        }
        h1 {
            font-size: 50px;
            color: #343a40;
        }
        p {
            font-size: 18px;
            color: #6c757d;
        }
    </style>
</head>
<body>
    <h1>404</h1>
    <p>The page you are looking for does not exist.</p>
    <a href="/">Return to Home</a>
</body>
</html>
EOF

cat > nginx/www/50x.html << EOF
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Server Error</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 50px;
            background: #f8f9fa;
        }
        h1 {
            font-size: 50px;
            color: #dc3545;
        }
        p {
            font-size: 18px;
            color: #6c757d;
        }
    </style>
</head>
<body>
    <h1>Server Error</h1>
    <p>We're experiencing some technical difficulties. Please try again later.</p>
</body>
</html>
EOF

echo "SSL certificates and sample HTML files generated successfully." 