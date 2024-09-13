const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const {OAuth2Client} = require('google-auth-library');
require('dotenv').config()

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(morgan("combined"));


//create new object instance of oauth2client class; handles task of exchanging authorization codes for access token; expects three arguments to be passed in
const oAuth2Client = new OAuth2Client(
  //CLIENT_ID and CLIENT_SECRET were supplied by google when I registered the app.
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  // a special redirect URI used by Google's OAuth flow specifically for desktop applications or JavaScript applications where the response is sent as a postMessage rather than being redirected to a URL. 
  'postmessage'
);

//this route exchanges the authorization code for tokens
app.post('/auth/google', async (req, res) => {
  //method provided by oAuth2Client class; see below
  console.log('request body', req.body)
  //makes request to https://oauth2.googleapis.com/token
  const { tokens } = await oAuth2Client.getToken(req.body.code); // exchange code for tokens
  console.log('tokens receive', tokens);
  
  res.json(tokens);
});
//refreshes tokens when they expire
app.post('/auth/google/refresh-token', async (req, res) => {
  const user = new UserRefreshClient(
    clientId,
    clientSecret,
    req.body.refreshToken,
  );
  const { credentials } = await user.refreshAccessToken(); // obtain new tokens
  
  
  res.json(credentials);
})

module.exports = app;

