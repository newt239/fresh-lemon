import { Handlers } from "https://deno.land/x/fresh@1.1.2/server.ts";

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
  async GET(_req, _ctx) {
    const accessToken = localStorage.getItem("accessToken");
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
    console.log(albums);
    return new Response(JSON.stringify(albums.albums));
  },
};
