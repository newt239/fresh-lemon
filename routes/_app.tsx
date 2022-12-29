import { AppProps } from "$fresh/server.ts";
import { asset, Head } from "$fresh/runtime.ts";

export default function ({ Component }: AppProps) {
  return (
    <>
      <Head>
        <title>Fresh App</title>
        <link
          href="https://cdn.jsdelivr.net/npm/daisyui@2.18.1/dist/full.css"
          rel="stylesheet"
          type="text/css"
        />
        <link rel="stylesheet" href={asset("style.css")} />
      </Head>
      <div data-theme="lemonade">
        <Component />
      </div>
    </>
  );
}
