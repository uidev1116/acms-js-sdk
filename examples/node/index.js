import { createClient } from '../../src/index.ts'

const acmsClient = createClient({
  baseUrl: import.meta.env.VITE_BASE_URL,
  apiKey: import.meta.env.VITE_API_KEY,
});

(async () => {
  // https://example.com/blog/api/summary_index/ へのHTTPリクエスト結果を取得できる
  const { data } = await acmsClient.get(
    { blog: 'blog', api: 'summary_index' },
  );
  console.log(data);
})();
