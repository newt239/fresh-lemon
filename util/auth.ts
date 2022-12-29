import { OAuth2Client } from "https://deno.land/x/oauth2_client@v1.0.0/mod.ts";
import "https://deno.land/std@0.133.0/dotenv/load.ts";

const oauth2Client = new OAuth2Client({
  clientId: Deno.env.get("GOOGLE_CLIENT_ID")!,
  clientSecret: Deno.env.get("GOOGLE_CLIENT_SECRET")!,
  authorizationEndpointUri: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenUri: "https://accounts.google.com/o/oauth2/token",
  redirectUri: Deno.env.get("REDIRECT_URL")!,
  defaults: {
    scope: "https://www.googleapis.com/auth/photoslibrary",
  },
});
export default oauth2Client;
