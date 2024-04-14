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

Relative paths from `baseUrl` can also be specified.

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

You can see the acmsPath section for more details.

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

## Options

The second argument can be an option.

Below is a list of all options.

| name         | description                                                                     | type                                                                                           | default   |
| ------------ | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | --------- |
| requestInit  | An object containing any custom settings that you want to apply to the request. | RequestInit                                                                                    | undefined |
| responseType | indication the type of data that the server will respond with                   | 'arrayBuffer'<br>  &#124; 'blob'<br>  &#124; 'formData'<br>  &#124; 'json'<br>  &#124; 'text'; | 'json'    |

Options can also be set in the arguments of the createClinent function.

In this case, all requests will reflect the set options.

```js
const acmsClient = createClient({
  baseUrl: 'YOUR_BASE_URL',
  apiKey: 'Your_API_KEY',
  requestInit: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
  responseType: 'json',
});
```

### Next.js App Router

For Next.js App Router, you can specify the `revalidate` option.

[Functions: fetch | Next.js](https://nextjs.org/docs/app/api-reference/functions/fetch)
```js
const response = await acmsClient.get(
  { api: 'MODULE_ID' },
  {
    requestInit: {
      next: {
        revalidate: 60,
      },
    }
  },
);
```


### AbortController: abort() method

You can use AbortController.

```js
const controller = new AbortController();
const response = await acmsClient.get(
  { api: 'MODULE_ID' },
  {
    requestInit: {
      signal: controller.signal,
    }
  },
);

setTimeout(() => {
  controller.abort();
}, 1000);
```


## TypeScript

You can use TypeScript.

```ts
acmsClient
  .get<ResponseType>({
    api: 'MODULE_ID',
  })
  .then((response) => {
    console.log(response.data); // response.data is ResponseType
  })
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
