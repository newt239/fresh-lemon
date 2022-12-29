import { Head } from "$fresh/runtime.ts";
import Twitter from "../islands/Tweet.tsx";

export default function Home() {
  return (
    <>
      <Head>
        <title>Add image from Twitter</title>
      </Head>
      <Twitter />
    </>
  );
}
