import { Handlers, PageProps } from "https://deno.land/x/fresh@1.1.2/server.ts";
import oauth2Client from "../util/auth.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    const codeVerifier = localStorage.getItem("codeVerifier");
    if (!codeVerifier) {
      throw Error("error!");
    }
    console.log(codeVerifier);
    try {
      const tokens = await oauth2Client.code.getToken(req.url, {
        codeVerifier,
      });
      localStorage.setItem("accessToken", tokens.accessToken);
      return await ctx.render({ auth: true });
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
