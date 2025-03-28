const fs = require('fs');
const https = require('https');
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 443;

// SSL certificate and key
const options = {
  key: fs.readFileSync('./ssl/key.pem'),
  cert: fs.readFileSync('./ssl/cert.pem'),
};

// Enable CORS to allow cross-origin requests
app.use(cors());

// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, 'frontend', 'build')));

// Fallback route to send index.html for any other request
app.get('*', (req, res) => {
  const filePath = path.join(__dirname, 'frontend', 'build', req.path);

  // Check if the requested file exists
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
  }
});

// Start HTTPS server
https.createServer(options, app).listen(PORT, () => {
  console.log(`Secure server running on https://localhost:${PORT}`);
});
