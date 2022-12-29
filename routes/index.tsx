import { Head } from "$fresh/runtime.ts";
import { Handlers } from "https://deno.land/x/fresh@1.1.2/server.ts";
import oauth2Client from "../util/auth.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    const { uri, codeVerifier } = await oauth2Client.code.getAuthorizationUri();
    localStorage.setItem("codeVerifier", codeVerifier);
    console.log(codeVerifier);
    return Response.redirect(uri);
  },
};

export default function Home() {
  return (
    <>
      <Head>
        <title>Fresh App</title>
      </Head>
      <div>
        <img
          src="/logo.svg"
          width="128"
          height="128"
          alt="the fresh logo: a sliced lemon dripping with juice"
        />
        <p>
          Welcome to `fresh`. Try updating this message in the
          ./routes/index.tsx file, and refresh.
        </p>
      </div>
    </>
  );
}
