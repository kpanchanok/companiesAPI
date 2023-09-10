require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json())

// Define a GET route that returns the JSON object
app.get('/', (req, res) => {
  res.json({ message: 'API Listening' });
});

// Start the Express server
app.listen(HTTP_PORT, () => {
  console.log(`Server is listening on port ${HTTP_PORT}`);
});

// resource not found
app.use((req, res) => {
  res.status(404).send("Resource not found");
});