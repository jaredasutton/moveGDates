const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
const path = require("path");

const SCOPES = ["https://www.googleapis.com/auth/calendar"];
const TOKEN_PATH = path.resolve(__dirname, "./config/token.json");
const CREDENTIALS_PATH = path.resolve(__dirname, "./config/credentials.json");

module.exports = () =>
  new Promise((resolve, reject) => {
    fs.readFile(CREDENTIALS_PATH, (err, content) => {
      if (err) return reject("Error loading client secret file: " + err);
      resolve(getCalendarWithOptions(JSON.parse(content)));
    });
  });

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
async function authorize(credentials) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );
  return new Promise(async (resolve, reject) => {
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, async (err, token) => {
      if (err) {
        token = await getAccessToken(oAuth2Client);
      }
      oAuth2Client.setCredentials(JSON.parse(token));
      resolve(oAuth2Client);
    });
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
async function getAccessToken(oAuth2Client) {
  return new Promise((resolve, reject) => {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES
    });
    console.log("Authorize this app by visiting this url:", authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question("Enter the code from that page here: ", code => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return reject(err);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
          if (err) return reject(err);
          console.log("Token stored to", TOKEN_PATH);
        });
        resolve(JSON.stringify(token));
      });
    });
  });
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function getCalendarWithOptions(credentials) {
  return new Promise(async (resolve, reject) => {
    const auth = await authorize(credentials);
    const calendar = google.calendar({ version: "v3", auth });
    resolve(calendar);
  });
}
