import { Tweet } from "../twitter.ts";
import { Handlers } from "https://deno.land/x/fresh@1.1.2/server.ts";
import { getCookies } from "$std/http/cookie.ts";

export interface UploadToGooglePhotoRequest {
  album_id: string;
  tweet: Tweet;
}

export interface UploadToGooglePhotoSuccessResponse {
  newMediaItemResults: NewMediaItemResult[];
}

export interface NewMediaItemResult {
  uploadToken: string;
  status: Status;
  mediaItem: MediaItem;
}

export interface Status {
  message: string;
}

export interface MediaItem {
  id: string;
  description: string;
  productUrl: string;
  mimeType: string;
  mediaMetaData: MediaMetadata;
  filename: string;
}

export interface MediaMetaData {
  "creationTime": string;
  "width": string;
  "height": string;
}

export const handler: Handlers = {
  async POST(req, _ctx) {
    const accessToken = getCookies(req.headers)["access_token"];
    console.log(accessToken);

    const params: UploadToGooglePhotoRequest = await req.json();
    const tweet = params.tweet;
    const googlePhotoUrlList: string[] = [];

    for (const image of tweet.includes.media) {
      const imageRes = await fetch(image.url);
      const contentType = imageRes.headers.get("Content-Type");
      if (contentType && imageRes.body) {
        const res = await fetch(
          "https://photoslibrary.googleapis.com/v1/uploads",
          {
            method: "POST",
            headers: {
              "Content-type": "application/octet-stream",
              Authorization: `Bearer ${accessToken}`,
              "X-Goog-Upload-Content-Type": contentType,
              "X-Goog-Upload-Protocol": "raw",
              "Access-Control-Allow-Origin": "*",
            },
            body: imageRes.body,
          },
        );
        const token = await res.text();
        const uploadRes = await fetch(
          `https://photoslibrary.googleapis.com/v1/mediaItems:batchCreate`,
          {
            method: "POST",
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${accessToken}`,
              "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
              "albumId": params.album_id,
              "newMediaItems": [
                {
                  "description":
                    `${tweet.data.text}\n\n${tweet.data.created_at}\nhttps://twitter.com/${
                      tweet.includes.users[0].username
                    }/status/${tweet.data.id}`,
                  "simpleMediaItem": {
                    "fileName": image.media_key,
                    "uploadToken": token,
                  },
                },
              ],
            }),
          },
        );
        const gphoto: UploadToGooglePhotoSuccessResponse = await uploadRes
          .json();
        googlePhotoUrlList.concat(
          gphoto.newMediaItemResults.map((result) =>
            result.mediaItem.productUrl
          ),
        );
      }
    }
    return new Response(JSON.stringify(googlePhotoUrlList));
  },
};
