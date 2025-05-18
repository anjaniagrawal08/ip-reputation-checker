//import and setup
const express = require('express');  //express: A popular Node.js web framework to create the backend server and routes easily.
const bodyParser = require('body-parser');  //body-parser: Middleware to parse incoming JSON data from client requests.
const fetch = require('node-fetch'); // node-fetch: A way to make HTTP requests (like fetch in browser) from Node.js.
const cors = require('cors');   //cors: Middleware to allow cross-origin requests, so your frontend can talk to backend on different ports/domains.

//Initialize App and Middleware
const app = express();   //app is your Express server instance.
const PORT = 3000;

// Enable CORS
app.use(cors());  //cors() enables cross-origin resource sharing.
app.use(bodyParser.json());   //bodyParser.json() parses incoming request bodies in JSON format so you can access req.body.

//API Key Declaration 
const API_KEY = 'e5dc4fa84a41991bf991dae6e02d5e1ac70804151c8dca898e556eacbb815e57fe3ad41e9c159f14';  //AbuseIPDB API key, needed to authenticate requests to their API.

//Define POST Route to Check IP
app.post('/check', async (req, res) => {    //Defines a route /check that accepts POST requests.
  const { ip } = req.body;    //Extracts ip from the request body.

  // Error check: if IP is not provided
  if (!ip) {
    return res.status(400).json({ error: 'IP address is required' });   //Validates if IP is provided; if not, returns a 400 error with a message.
  }

  //Fetch Data from AbuseIPDB
  try {
    const response = await fetch(`https://api.abuseipdb.com/api/v2/check?ipAddress=${ip}`, {  //Uses fetch to call AbuseIPDB API with the IP address.
      headers: {
        'Key': API_KEY,    //Sets headers including your API key and expects JSON response.
        'Accept': 'application/json'
      }
    });

    //  Handle API Response
    if (!response.ok) {    //If the API call failed (!response.ok), read the error message and send back to client.
      const errorData = await response.json();
      return res.status(response.status).json({ error: errorData.errors?.[0]?.detail || 'API error' });
    }

    const data = await response.json();

    // Otherwise, parse JSON response and send relevant data (IP, abuse score, country, ISP) back to frontend.
    res.json({
      ipAddress: data.data.ipAddress,
      abuseConfidenceScore: data.data.abuseConfidenceScore,
      countryCode: data.data.countryCode,
      isp: data.data.isp
    });
  } 
  
  //Catch Server Errors
  catch (err) {    //If any exception happens in the try block (network failure, code error), catch it.
    console.error('Server error:', err);
    res.status(500).json({ error: 'Something went wrong on the server' });
  }
});
//Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);   //Starts your Express backend server listening on port 3000.
});
