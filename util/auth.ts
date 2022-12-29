import { config } from "https://deno.land/std@0.170.0/dotenv/mod.ts";
import { OAuth2Client } from "https://deno.land/x/oauth2_client@v1.0.0/mod.ts";

const configData = await config();
const oauth2Client = new OAuth2Client({
  clientId: configData["GOOGLE_CLIENT_ID"],
  clientSecret: configData["GOOGLE_CLIENT_SECRET"],
  authorizationEndpointUri: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenUri: "https://accounts.google.com/o/oauth2/token",
  redirectUri: "http://localhost:8000/redirect",
  defaults: {
    scope: "https://www.googleapis.com/auth/photoslibrary",
  },
});
export default oauth2Client;
