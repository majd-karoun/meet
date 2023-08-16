const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const calendar = google.calendar("v3");

const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];

const credentials = {
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  calendar_id: process.env.CALENDAR_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  redirect_uris: ["https://majd-karoun.github.io/meet"]
,
  javascript_origins: ["https://majd-karoun.github.io", "http://localhost:8080", "http://localhost:3000"],
};

const { client_secret, client_id, redirect_uris, calendar_id } = credentials;

const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE"
};


module.exports.getAuthURL = async () => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({ authUrl }),
  };
};

module.exports.getAccessToken = async (event) => {
  try {
    const code = decodeURIComponent(`${event.pathParameters.code}`);
    const { tokens } = await oAuth2Client.getToken(code);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(tokens),
    };
  } catch (err) {
    console.error(err);

    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify(err.message || "Error retrieving access token"),
    };
  }
};

module.exports.getCalendarEvents = async (event) => {
  try {
    const access_token = decodeURIComponent(`${event.pathParameters.access_token}`);
    oAuth2Client.setCredentials({ access_token });

    const results = await calendar.events.list({
      calendarId: calendar_id,
      auth: oAuth2Client,
      timeMin: new Date().toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    });

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ events: results.data.items }),
    };
  } catch (err) {
    console.error(err);

    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify(err.message || "Error fetching calendar events"),
    };
  }
};
