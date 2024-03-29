// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Start up an instance of app
const app = express();
const port = 8000;

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
app.use(cors());

// Initialize the main project folder
app.use(express.static('src'));

app.get('/recent', (req, res) => {
  res.send(projectData);
});

app.post('/storage', async (req, res) => {
  projectData = req.body ?? '';
  res.send(projectData);
});

// Setup Server
app.listen(port, () => {
  console.log(`Now app is running on http://localhost:${port}`);
});
