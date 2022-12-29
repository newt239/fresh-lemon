import { AppProps } from "$fresh/server.ts";
import { asset, Head } from "$fresh/runtime.ts";

export default function ({ Component }: AppProps) {
  return (
    <>
      <Head>
        <title>Fresh App</title>
        <link rel="stylesheet" href={asset("style.css")} />
      </Head>
      <Component />
    </>
  );
}
