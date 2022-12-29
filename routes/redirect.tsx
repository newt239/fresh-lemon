import { getCookies, setCookie } from "$std/http/cookie.ts";
import { Handlers, PageProps } from "https://deno.land/x/fresh@1.1.2/server.ts";
import oauth2Client from "../util/auth.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    const codeVerifier = getCookies(req.headers)["code_verifier"];
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
        <h1 class="text-3xl">Save Twitter photos to Google Photos</h1>
        <h2 class="text-xl">
        </h2>
        <div
          className={`alert alert-${
            data.auth ? "success" : "error"
          } shadow-lg my-5`}
        >
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {data.auth ? "login success!" : "login failed..."}
          </div>
        </div>
        {data.auth && (
          <a href="/twitter2gphoto" class="btn btn-primary m-5">
            Save photos on Twitter
          </a>
        )}
        <a href="/" class="btn btn-link m-5">{"<"} Back home</a>
      </main>
    </>
  );
}
