import express from 'express';
import { pathToFileURL } from 'url';

const app = express();

// Endpoint to return the current timestamp
app.get('/timestamp', (req, res) => {
  res.json({ timestamp: getCurrentTimestamp() });
});

// Helper function to get the current timestamp
export function getCurrentTimestamp() {
  return new Date().toISOString();
}

// Serve a simple HTML page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Browser Info</title>
    </head>
    <body>
      <h1>Browser and Timestamp Info</h1>
      <p id="browser-info">Loading browser details...</p>
      <p id="timestamp">Fetching server timestamp...</p>
      <script>
        // Display browser information
        const userAgent = navigator.userAgent;
        document.getElementById('browser-info').textContent = 'Your browser: ' + userAgent;

        // Fetch and display the server timestamp
        fetch('/timestamp')
          .then(response => response.json())
          .then(data => {
            document.getElementById('timestamp').textContent = 'Server timestamp: ' + data.timestamp;
          })
          .catch(err => {
            document.getElementById('timestamp').textContent = 'Error fetching timestamp';
          });
      </script>
    </body>
    </html>
  `);
});

// Start listening only when this file is run directly. Importing it for unit tests
// should not claim a network port.
const isMainModule = process.argv[1]
  && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMainModule) {
  const port = Number(process.env.PORT ?? 3000);
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on port ${port}`);
  });
}

export { app };
