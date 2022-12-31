import { Head } from "$fresh/runtime.ts";
import SavePhoto from "../islands/SavePhoto.tsx";

export default function Home() {
  return (
    <>
      <Head>
        <title>Save photos from Twitter</title>
      </Head>
      <div
        className="bg-base-200"
        style={{ minHeight: "calc(100vh - 2rem)" }}
      >
        <div className="max-w-lg py-6" style={{ margin: "auto" }}>
          <SavePhoto />
        </div>
      </div>
    </>
  );
}
