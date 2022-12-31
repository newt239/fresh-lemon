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
  const [error, setError] = useState<boolean>(false);

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
    try {
      const id = tweetUrl.split("status/")[1].split("?")[0];
      const url = `./api/twitter?id=${id}`;
      const res = await fetch(url);
      const data = await res.json();
      setTweet(data);
    } catch (e) {
      setError(true);
    }
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

  const reset = () => {
    setTweetUrl("");
    setTweet(null);
    setGooglePhotos([]);
  };

  const closeError = () => {
    reset();
    setError(false);
  };

  return (
    <div>
      <h3 class="text-xl font-bold mt-5">Tweet URL</h3>
      <div class="flex gap-5 items-center">
        <input
          type="text"
          value={tweetUrl}
          onInput={(e) => setTweetUrl(e.currentTarget.value)}
          class="input input-bordered w-full max-w-xs my-5"
        />
        <button
          onClick={getTweet}
          disabled={!(tweetUrl.startsWith("https://twitter.com") ||
            tweetUrl.startsWith("https://mobile.twitter.com"))}
          class="btn btn-primary"
        >
          Get!
        </button>
      </div>
      {error && (
        <div className="alert alert-error shadow-lg">
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
            <span>ツイートの取得中にエラーが発生しました。</span>
          </div>
          <div className="flex-none">
            <button onClick={closeError} className="btn btn-sm btn-ghost">
              閉じる
            </button>
          </div>
        </div>
      )}
      {tweet && (
        <div>
          <ul class="list-disc m-5">
            <li>
              <a
                href={`https://twitter.com/${
                  tweet.includes.users[0].username
                }/status/${tweet.data.id}`}
                target="_blank"
                class="link link-primary"
              >
                {`https://twitter.com/${
                  tweet.includes.users[0].username
                }/status/${tweet.data.id}`}
              </a>
            </li>
          </ul>
          <div class="tweetImageList">
            {tweet.includes.media.map((media) => (
              <img
                src={`${media.url}?format=jpg&name=orig`}
                class="tweetImage"
              />
            ))}
          </div>
          <h3 class="text-xl font-bold mt-5">Album</h3>
          <select
            onChange={(e) => setCurrentAlbumId(e.currentTarget.value)}
            class="select select-primary w-full max-w-xs my-5"
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
                <a href={photo} target="_blank" class="link link-primary">
                  {photo}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div class="flex gap-5 items-center">
        <a href="/" class="btn btn-link">{"<"} back home</a>
        <button
          onClick={reset}
          class="btn btn-error"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
