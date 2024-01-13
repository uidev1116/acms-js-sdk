import { createClient } from '../../src/index.ts'

const acmsClient = createClient({
  baseUrl: "https://example.com",
  apiKey: "YOUR_API_KEY",
});

(async () => {
  // https://example.com/blog/api/summary_index へのHTTPリクエスト結果を取得できる
  const { data } = await acmsClient.get(
    { blog: 'blog', api: 'summary_index' },
  );
  console.log(data);
})();
