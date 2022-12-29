import { getCookies, setCookie } from "$std/http/cookie.ts";
import { Handlers, PageProps } from "https://deno.land/x/fresh@1.1.2/server.ts";
import oauth2Client from "../util/auth.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    const codeVerifier = getCookies(req.headers)["code_verifier"];
    console.log(codeVerifier);
    if (!codeVerifier) {
      throw Error("error!");
    }
    try {
      const tokens = await oauth2Client.code.getToken(req.url, {
        codeVerifier,
      });
      const response = await ctx.render({ auth: true });
      setCookie(response.headers, {
        name: "access_token",
        value: tokens.accessToken,
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true,
      });
      return response;
    } catch (e) {
      console.log(e);
      return await ctx.render({ auth: false });
    }
  },
};

export default function Redirect({ url, data }: PageProps<{ auth: boolean }>) {
  return (
    <>
      <main>
        {data.auth ? <h2>login success!</h2> : <h2>login failed...</h2>}
        <a href="/">back home</a>
        <a href="/twitter2gphoto">add image</a>
      </main>
    </>
  );
}
