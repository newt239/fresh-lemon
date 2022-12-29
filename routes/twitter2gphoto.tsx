import { Head } from "$fresh/runtime.ts";
import Twitter from "../islands/Tweet.tsx";

export default function Home() {
  return (
    <>
      <Head>
        <title>Save photos from Twitter</title>
      </Head>
      <main>
        <Twitter />
      </main>
    </>
  );
}
