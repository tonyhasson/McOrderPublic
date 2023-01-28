// Import the packages we need
const dialogflow = require('@google-cloud/dialogflow');
const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: './config.env' });

// Your credentials
const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);

// Other way to read the credentials
// const fs = require('fs');
// const CREDENTIALS = JSON.parse(fs.readFileSync('File path'));

// Your google dialogflow project-id
const PROJECTID = CREDENTIALS.project_id;

// Configuration for the client
const CONFIGURATION = {
  credentials: {
    private_key: CREDENTIALS['private_key'],
    client_email: CREDENTIALS['client_email'],
  },
};

// Create a new session
const sessionClient = new dialogflow.SessionsClient(CONFIGURATION);

// Detect intent method
const detectIntent = async (languageCode, queryText, sessionId) => {
  let sessionPath = sessionClient.projectAgentSessionPath(PROJECTID, sessionId);

  // The text query request.
  let request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: queryText,
        // The language used by the client (en-US)
        languageCode: languageCode,
      },
    },
  };

  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  const result = responses[0].queryResult;
  console.log(responses[0].queryResult);
  return {
    //response: result.fulfillmentText,
    response: result,
  };
};

// Start the webapp
const webApp = express();
webApp.use(cors());

// Webapp settings
webApp.use(
  express.urlencoded({
    extended: true,
  })
);
webApp.use(express.json());

// Server Port
const PORT = process.env.PORT || 4000;

// Home route
webApp.get('/', (req, res) => {
  res.send(`Hello World.!`);
});

// Dialogflow route
webApp.post('/dialogflow', async (req, res) => {
  let languageCode = req.body.languageCode;
  let queryText = req.body.queryText;
  let sessionId = req.body.sessionId;

  let responseData = await detectIntent(languageCode, queryText, sessionId);

  res.send(responseData.response);
});

// Start the server
webApp.listen(PORT, () => {
  console.log(`Server is up and running at ${PORT}`);
});

module.exports = { detectIntent };
