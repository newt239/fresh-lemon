import { useEffect, useState } from "preact/hooks";
import { Tweet } from "../routes/api/twitter.ts";

export default function Twitter() {
  const [albumList, setAlbumList] = useState<{ id: string; title: string }[]>(
    [],
  );
  const [currentAlbumId, setCurrentAlbumId] = useState<string>("");
  const [tweetUrl, setTweetUrl] = useState<string>("");
  const [tweet, setTweet] = useState<Tweet | null>(null);
  const [googlePhotos, setGooglePhotos] = useState<string[]>([]);

  useEffect(() => {
    const getAlbumList = async () => {
      const res = await fetch(
        `./api/google/albums`,
      );
      const data = await res.json();
      setAlbumList(data);
    };
    getAlbumList();
  }, []);

  const getTweet = async () => {
    const id = tweetUrl.split("status/")[1];
    const url = `./api/twitter?id=${id}`;
    const res = await fetch(url);
    const data = await res.json();
    setTweet(data);
  };

  const saveToGooglePhoto = async () => {
    if (tweet) {
      const url = `./api/google/upload`;
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          album_id: currentAlbumId,
          tweet,
        }),
      });
      const data = await res.json();
      setGooglePhotos(data);
    }
  };

  return (
    <div>
      <h3 class="text-xl font-bold mt-5">Tweet URL</h3>
      <div class="flex gap-5 items-center">
        <input
          type="text"
          value={tweetUrl}
          onChange={(e) => setTweetUrl(e.currentTarget.value)}
          class="input input-bordered w-full max-w-xs my-5"
        />
        <button
          onClick={getTweet}
          class="btn btn-primary"
        >
          Get!
        </button>
      </div>
      {tweet && (
        <div>
          <div class="tweetImageList">
            {tweet.includes.media.map((media) => (
              <img src={media.url} class="tweetImage" />
            ))}
          </div>
          <h3 class="text-xl font-bold mt-5">Album</h3>
          <select
            onChange={(e) => setCurrentAlbumId(e.currentTarget.value)}
            class="select select-bordered w-full max-w-xs my-5"
          >
            {albumList.map((album, key) => (
              <option value={album.id}>{album.title}</option>
            ))}
          </select>
          <button
            onClick={saveToGooglePhoto}
            class="btn btn-primary btn-block my-5"
          >
            Save to Google Photo
          </button>
        </div>
      )}
      {googlePhotos.length !== 0 && (
        <div>
          <h3 class="text-xl font-bold mt-5">Success!</h3>
          <ul class="list-disc m-5">
            {googlePhotos.map((photo) => (
              <li>
                <a href={photo} target="_blank" class="link link-accent">
                  {photo}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <a href="/" class="btn btn-link">{"<"} back home</a>
    </div>
  );
}
