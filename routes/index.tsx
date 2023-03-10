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
      <div
        className="hero bg-base-200"
        style={{ height: "calc(100vh - 2rem)" }}
      >
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Fresh Lemon</h1>
            <p className="py-6">
              Save the tweet image to Google Photos.
            </p>
            <a href={data.uri} class="btn btn-primary">Sign in with Google</a>
          </div>
        </div>
      </div>
    </>
  );
}
