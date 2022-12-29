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
      console.log(data);
      setAlbumList(data);
    };
    getAlbumList();
  }, []);

  const getTweet = async () => {
    const id = tweetUrl.split("status/")[1];
    const url = `./api/twitter?id=${id}`;
    const tres = await fetch(url);
    setTweet(await tres.json());
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
      <input
        type="text"
        value={tweetUrl}
        onChange={(e) => setTweetUrl(e.currentTarget.value)}
      />
      <select
        onChange={(e) => setCurrentAlbumId(e.currentTarget.value)}
      >
        {albumList.map((album, key) => (
          <option value={album.id}>{album.title}</option>
        ))}
      </select>
      <button onClick={getTweet}>
        get tweet
      </button>
      <a href="/">back home</a>
      {tweet && (
        <div>
          {tweet.includes.media.map((media) => <img src={media.url} />)}
          <button onClick={saveToGooglePhoto}>Save to Google Photo</button>
        </div>
      )}
      <ul>
        {googlePhotos.map((photo) => (
          <li>
            <a href={photo}>
              {photo}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
