import { Handlers } from "https://deno.land/x/fresh@1.1.2/server.ts";
import { getCookies } from "$std/http/cookie.ts";

export interface Album {
  id: string;
  title: string;
  productUrl: string;
  mediaItemsCount: string;
  coverPhotoBaseUrl: string;
  coverPhotoMediaItemId: string;
}

export interface GetGooglePhotoAlbumsResponse {
  albums: Album[];
  nextPageToken: string;
}

export const handler: Handlers = {
  async GET(req, _ctx) {
    const accessToken = getCookies(req.headers)["access_token"];
    const res = await fetch(
      "https://photoslibrary.googleapis.com/v1/albums",
      {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    const albums: GetGooglePhotoAlbumsResponse = await res.json();
    return new Response(JSON.stringify(albums.albums));
  },
};
