import { Handlers, PageProps } from "https://deno.land/x/fresh@1.1.2/server.ts";
import oauth2Client from "../util/auth.ts";
import { setCookie } from "$std/http/cookie.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    const { uri, codeVerifier } = await oauth2Client.code.getAuthorizationUri();
    const response = await ctx.render({ uri });
    setCookie(response.headers, {
      name: "code_verifier",
      value: codeVerifier,
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true,
    });
    return response;
  },
};

export default function Home({ url, data }: PageProps<{ uri: string }>) {
  return (
    <>
      <main>
        <h1 class="text-3xl font-bold">Fresh Lemon</h1>
        <h2 class="text-xl font-bold mt-5">twitter2gphoto</h2>
        <a href={data.uri} class="btn btn-accent m-5">Sign in with Google</a>
      </main>
    </>
  );
}
