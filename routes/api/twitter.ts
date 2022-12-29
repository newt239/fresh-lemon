import { config } from "https://deno.land/std@0.170.0/dotenv/mod.ts";
import { HandlerContext } from "https://deno.land/x/rutt@0.0.13/mod.ts";

export interface Tweet {
  data: Data;
  includes: Includes;
}

export interface Data {
  attachments: Attachments;
  id: string;
  edit_history_tweet_ids: string[];
  created_at: string;
  text: string;
}

export interface Attachments {
  media_keys: string[];
}

export interface Includes {
  media: Medum[];
  users: User[];
}

export interface Medum {
  type: string;
  height: number;
  width: number;
  url: string;
  media_key: string;
}

export interface User {
  id: string;
  name: string;
  username: string;
}

export const handler = async (
  _req: Request,
  _ctx: HandlerContext,
) => {
  const configData = await config();
  const bearerToken = configData["TWITTER_BEARER_TOKEN"];
  const id = _req.url.split("?id=")[1];
  const res = await fetch(
    `https://api.twitter.com/2/tweets/${id}?tweet.fields=created_at,source&expansions=attachments.media_keys,author_id,entities.mentions.username&media.fields=duration_ms,height,media_key,preview_image_url,type,url,width,public_metrics,non_public_metrics,organic_metrics,promoted_metrics,alt_text,variants`,
    {
      headers: {
        "Authorization": `Bearer ${bearerToken}`,
      },
    },
  );
  const tweet: Tweet = await res.json();
  return Response.json(tweet);
};
