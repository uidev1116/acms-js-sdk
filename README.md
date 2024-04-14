# acms-js-sdk

JavaScript SDK for a-blog cms. Works in Node.js and modern browsers.

## Installation

```bash
npm install acms-js-sdk

# or

yarn add acms-js-sdk
```

## Usage

First, you need to create a client instance.

ES Modules:

```js
import { createClient } from 'acms-js-sdk';

const acmsClient = createClient({
  baseUrl: 'YOUR_BASE_URL',
  apiKey: 'YOUR_API_KEY',
});
```

CommonJS:

```js
const { createClient } = require('acms-js-sdk');

const acmsClient = createClient({
  baseUrl: 'YOUR_BASE_URL',
  apiKey: 'YOUR_API_KEY',
});
```

CDN:

```html
<script type="module">
  const { createClient } = 'https://unpkg.com/acms-js-sdk/dist/es/acms-js-sdk.js';

  const acmsClient = createClient({
    baseUrl: 'YOUR_BASE_URL',
    apiKey: 'YOUR_API_KEY',
  });
</script>
```

Then, you can use `get` method.

Specify the module ID to be used in the module's GET API function in the `api`, and information on the specified module ID can be fetched.

```js
acmsClient
  .get({
    api: 'MODULE_ID',
  })
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.error(error);
  });
```

Relative paths can also be specified.

```js
acmsClient
  .get('api/MODULE_ID')
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.error(error);
  });
```

### Url Context

You can specify the URL context.

```js
acmsClient
  .get({
    blog: 'BLOG_CODE',
    category: 'CATEGORY_CODE',
    entry: 'ENTRY_CODE',
    api: 'MODULE_ID',
  })
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.error(error);
  });
```

### Error Handling

You can handle errors.

Youb can check if the error is `AcmsFetchError` by using `isAcmsFetchError`.

```js
acmsClient
  .get({
    api: 'MODULE_ID',
  })
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    if (acmsClient.isAcmsFetchError(error)) {
      console.error(error.response.data);
      return;
    }
    console.error(error);
  });
```

## acmsPath

You can get the path of Url Context by using utility function `acmsPath`.

```js

import { acmsPath } from 'acms-js-sdk';

const path = acmsPath({
  blog: 'BLOG_CODE',
  category: 'CATEGORY_CODE',
  entry: 'ENTRY_CODE',
  // user: 1,
  // tag: ['tag1', 'tag2'],
  // field: 'color/eq/red',
  // span: { start: '2021-01-01', end: '2021-12-31' },
  // date: { year: 2021, month: 1, day: 1 },
  // page: 1,
  // order: 'id-asc',
  // limit: 10,
  // keyword: 'KEYWORD',
  // tpl: 'include/sample.json'
  api: 'MODULE_ID',
});
```

### Params Type

```ts
interface AcmsContext {
  blog?: string | number;
  category?: string | string[] | number;
  entry?: string | number;
  user?: number;
  tag?: string[];
  field?: string;
  span?: { start?: string | Date; end?: string | Date };
  date?: { year?: number; month?: number; day?: number };
  page?: number;
  order?: string;
  limit?: number;
  keyword?: string;
  tpl?: string;
  api?: string;
  searchParams?: ConstructorParameters<typeof URLSearchParams>[0];
}
```

## isAcmsFetchError

You can check if the error is `AcmsFetchError` by using utility function `isAcmsFetchError`.

```js
import { isAcmsFetchError } from 'acms-js-sdk';

acmsClient
  .get({
    api: 'MODULE_ID',
  })
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    if (isAcmsFetchError(error)) {
      console.error(error.response.data);
      return;
    }
    console.error(error);
  });
```
