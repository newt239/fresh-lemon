import { useEffect, useState } from "preact/hooks";
import { Album } from "../routes/api/google/albums.ts";
import { Tweet } from "../routes/api/twitter.ts";

export default function SavePhoto() {
  const [albumList, setAlbumList] = useState<{ id: string; title: string }[]>(
    [],
  );
  const [currentAlbumId, setCurrentAlbumId] = useState<string>("");
  const [tweetUrl, setTweetUrl] = useState<string>("");
  const [tweet, setTweet] = useState<Tweet | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<boolean>(false);

  const getTweet = async () => {
    const id = tweetUrl.split("status/")[1].split("/")[0].split("?")[0];
    const url = `./api/twitter?id=${id}`;
    const res = await fetch(url);
    const data: Tweet = await res.json();
    if (data.includes && data.includes.media.length !== 0) {
      setTweet(data);
      setTweetUrl(
        `https://twitter.com/${data.includes.users[0].username}/status/${id}`,
      );

      const albumRes = await fetch(
        `./api/google/albums`,
      );
      const albumData: Album[] = await albumRes.json();
      setAlbumList(albumData);
    } else {
      setError(true);
    }
  };

  const saveToGooglePhoto = async () => {
    if (tweet) {
      setLoading(true);
      const url = `./api/google/upload`;
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          album_id: currentAlbumId,
          tweet,
        }),
      });
      const data: string[] = await res.json();
      if (data.length !== 0) {
        setPhotos(data);
      } else {
        setUploadError(true);
      }
      setLoading(false);
    }
  };

  const reset = () => {
    setTweetUrl("");
    setTweet(null);
    setPhotos([]);
  };

  const closeError = () => {
    reset();
    setError(false);
    setUploadError(false);
  };

  return (
    <>
      <h2 className="text-3xl font-bold">Tweet URL</h2>
      <div className="form-control py-6">
        <div className="input-group">
          <input
            type="text"
            placeholder="https://twitter.com/"
            value={tweetUrl}
            onInput={(e) => setTweetUrl(e.currentTarget.value)}
            className="input w-full input-bordered"
          />
          <button
            onClick={getTweet}
            disabled={!(tweetUrl.startsWith("https://twitter.com/") ||
              tweetUrl.startsWith("https://mobile.twitter.com/"))}
            className="btn btn-square"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>
      {error // https://github.com/denoland/fresh/discussions/606#discussioncomment-3902802
        ? (
          <div className="py-6">
            <div className="alert alert-error shadow-lg">
              <div>
                <span>ツイートの取得中にエラーが発生しました。URLをもう一度確認してください。</span>
              </div>
              <div className="flex-none">
                <button onClick={closeError} className="btn btn-sm btn-ghost">
                  閉じる
                </button>
              </div>
            </div>
          </div>
        )
        : <div></div>}

      {tweet
        ? (
          <div>
            <h2 className="text-3xl font-bold">Result</h2>
            <ul className="list-disc m-5">
              <li>
                <a
                  href={tweetUrl}
                  target="_blank"
                  className="link link-primary"
                >
                  {tweetUrl}
                </a>
              </li>
            </ul>
            <div className="tweetImageList py-6">
              {tweet.includes.media.map((media) => (
                <img
                  src={`${media.url}?format=jpg&name=orig`}
                  className="tweetImage"
                />
              ))}
            </div>
            <h2 className="text-4xl font-bold">Album</h2>
            <select
              value={currentAlbumId}
              onInput={(e) => setCurrentAlbumId(e.currentTarget.value)}
              className="select select-primary w-full max-w-xs my-5"
            >
              <option value="">アルバムに入れない</option>
              {albumList.map((album) => (
                <option value={album.id}>{album.title}</option>
              ))}
            </select>
            <button
              onClick={saveToGooglePhoto}
              disabled={loading}
              className={`btn btn-primary btn-block ${
                loading ? "loading" : ""
              }`}
            >
              Save to Google Photo
            </button>
          </div>
        )
        : <div></div>}

      {uploadError
        ? (
          <div className="py-6">
            <div className="alert alert-error shadow-lg">
              <div>
                <span>アップロードに失敗しました。時間を置いて再度お試しください。</span>
              </div>
              <div className="flex-none">
                <button onClick={closeError} className="btn btn-sm btn-ghost">
                  閉じる
                </button>
              </div>
            </div>
          </div>
        )
        : <div></div>}

      {photos.length !== 0 && (
        <div className="py-6">
          <h3 className="text-xl font-bold py-6">Success!</h3>
          <ul className="list-disc py-6">
            {photos.map((photo) => (
              <li>
                <a href={photo} target="_blank" className="link link-primary">
                  {photo}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="py-6">
        <a href="/" className="btn btn-link">{"<"} back home</a>
      </div>
    </>
  );
}
