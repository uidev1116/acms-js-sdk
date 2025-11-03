# acms-js-sdk

JavaScript SDK for a-blog cms. Works in Node.js and modern browsers.

## Installation

```bash
npm install @uidev1116/acms-js-sdk

# or

yarn add @uidev1116/acms-js-sdk
```

## Usage

First, you need to create a client instance.

ES Modules:

```js
import { createClient } from '@uidev1116/acms-js-sdk';

const acmsClient = createClient({
  baseUrl: 'YOUR_BASE_URL',
  apiKey: 'YOUR_API_KEY',
});
```

CommonJS:

```js
const { createClient } = require('@uidev1116/acms-js-sdk');

const acmsClient = createClient({
  baseUrl: 'YOUR_BASE_URL',
  apiKey: 'YOUR_API_KEY',
});
```

CDN:

```html
<script type="module">
  const { createClient } = 'https://unpkg.com/@uidev1116/acms-js-sdk@latest/dist/es/acms-js-sdk.js';

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

| name            | description                                                                     | type                                                                                           | default   |
| --------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | --------- |
| requestInit     | An object containing any custom settings that you want to apply to the request. | RequestInit                                                                                    | undefined |
| responseType    | indication the type of data that the server will respond with                   | 'arrayBuffer'<br>  &#124; 'blob'<br>  &#124; 'formData'<br>  &#124; 'json'<br>  &#124; 'text'; | 'json'    |
| acmsPathOptions | Configuration for acmsPath behavior (API version, custom segments, etc.)        | AcmsPathOptions                                                                                | {}        |

Options can also be set in the arguments of the createClient function.

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

### API Version Configuration

You can configure the default API version for all requests using `acmsPathOptions`:

```js
const acmsClient = createClient({
  baseUrl: 'YOUR_BASE_URL',
  apiKey: 'YOUR_API_KEY',
  acmsPathOptions: {
    apiVersion: 'v2', // 'v1' or 'v2' (default: 'v2')
  },
});

// All API requests will use the specified version
acmsClient.get({
  api: 'summary_index',
});
// => Requests to: YOUR_BASE_URL/api/v2/summary_index/
```

You can also customize the path segments:

```js
const acmsClient = createClient({
  baseUrl: 'YOUR_BASE_URL',
  apiKey: 'YOUR_API_KEY',
  acmsPathOptions: {
    apiVersion: 'v1',
    segments: {
      bid: 'custom-bid',
      cid: 'custom-cid',
      // ... other custom segments
    },
  },
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

import { acmsPath } from '@uidev1116/acms-js-sdk';

const path = acmsPath({
  blog: 'BLOG_CODE',
  category: 'CATEGORY_CODE',
  entry: 'ENTRY_CODE',
  // user: 1,
  // unit: 'UNIT_ID',
  // tag: ['tag1', 'tag2'],
  // field: 'color/eq/red',
  // span: { start: '2021-01-01', end: '2021-12-31' },
  // date: { year: 2021, month: 1, day: 1 },
  // page: 1,
  // order: 'id-asc',
  // limit: 10,
  // keyword: 'KEYWORD',
  // tpl: 'include/sample.json'
  // admin: 'entry_index',
  api: 'MODULE_ID',
});
```

### Params Type

```ts
interface AcmsPathParams {
  blog?: string | number;
  admin?: string;
  category?: string | string[] | number;
  entry?: string | number;
  user?: number;
  unit?: string;
  tag?: string[];
  field?: string | AcmsFieldList;
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

### Options

You can configure options for `acmsPath`.

```ts
interface AcmsPathOptions {
  apiVersion?: 'v1' | 'v2'; // Default: 'v2'
  segments?: Partial<AcmsPathSegments>; // Custom segment names
}
```

**apiVersion**: Specifies the API version for the path.
- `'v2'` (default): Generates paths like `api/v2/MODULE_ID/`
- `'v1'`: Generates paths like `api/MODULE_ID/`

```js
// v2 API (default)
acmsPath({ api: 'summary_index' });
// => 'api/v2/summary_index/'

// v1 API
acmsPath({ api: 'summary_index' }, { apiVersion: 'v1' });
// => 'api/summary_index/'
```

## isAcmsFetchError

You can check if the error is `AcmsFetchError` by using utility function `isAcmsFetchError`.

```js
import { isAcmsFetchError } from '@uidev1116/acms-js-sdk';

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

## parseAcmsPath

The `parseAcmsPath` function is a utility designed to parse [acms path](https://developer.a-blogcms.jp/document/reference/acms_path.html) into a structured context object. This function is particularly useful for extracting various segments from a URL path and organizing them into a meaningful context that can be used for further processing in applications.

```js
import { parseAcmsPath } from '@uidev1116/acms-js-sdk';

// For example, if the current URL path is '/bid/1/cid/2/eid/3/page/2/field/color/eq/red'
const context = parseAcmsPath(window.location.pathname);
// Output:
// {
//   bid: 1,
//   cid: 2,
//   eid: 3,
//   page: 2,
//   field: AcmsFieldList { ... } // field is an AcmsFieldList instance
// }
```

### Return Type

```ts
interface AcmsContext {
  bid?: number;
  cid?: number;
  eid?: number;
  uid?: number;
  utid?: string;
  tag?: string[];
  field?: AcmsFieldList; // Returns AcmsFieldList instance
  span?: { start: string | Date; end: string | Date };
  date?: { year: number; month?: number; day?: number };
  page?: number;
  order?: string;
  limit?: number;
  keyword?: string;
  admin?: string;
  tpl?: string;
  api?: string;
  apiVersion?: 'v1' | 'v2'; // Detected API version
  unresolvedPath?: string; // Any unresolved path segments
}
```

**Note**: The `field` property is returned as an `AcmsFieldList` instance, which provides methods to manipulate field data. The `apiVersion` is automatically detected from the path (defaults to `'v1'` for legacy paths without version).

### API Version Detection

The `parseAcmsPath` function automatically detects the API version from the path:

```js
// v1 API (legacy format)
parseAcmsPath('/api/summary_index');
// { api: 'summary_index', apiVersion: 'v1', ... }

// v2 API
parseAcmsPath('/api/v2/summary_index');
// { api: 'summary_index', apiVersion: 'v2', ... }
```

## AcmsFieldList

The `AcmsFieldList` class is a utility for working with field contexts in a-blog cms. It allows you to build complex field queries programmatically and convert between string and object representations.

### Basic Usage

You can use `AcmsFieldList` in two ways with `acmsPath`:

#### 1. Using string notation (simple)

```js
import { acmsPath } from '@uidev1116/acms-js-sdk';

const path = acmsPath({
  blog: 'news',
  field: 'color/eq/red',
});
// => 'news/field/color/eq/red/'
```

#### 2. Using AcmsFieldList (programmatic)

```js
import { acmsPath, AcmsFieldList } from '@uidev1116/acms-js-sdk';

const fieldList = new AcmsFieldList([
  {
    key: 'color',
    filters: [
      { operator: 'eq', value: 'red', connector: 'or' }
    ],
    separator: '_and_'
  }
]);

const path = acmsPath({
  blog: 'news',
  field: fieldList,
});
// => 'news/field/color/eq/red/'
```

### AcmsFieldList Methods

#### Constructor

```ts
const fieldList = new AcmsFieldList(fields?: AcmsField[]);
```

#### Instance Methods

- `push(field: AcmsField)`: Add a field to the end
- `pop()`: Remove and return the last field
- `shift()`: Remove and return the first field
- `unshift(field: AcmsField)`: Add a field to the beginning
- `getFields()`: Get all fields as an array
- `toString()`: Convert to a-blog cms field path string

#### Static Methods

- `AcmsFieldList.fromString(input: string)`: Parse a field string into an AcmsFieldList
- `AcmsFieldList.fromFormData(formData: FormData)`: Create from FormData

### Working with Field Types

```ts
interface AcmsField {
  key: string;
  filters: AcmsFilter[];
  separator?: '_and_' | '_or_';
}

interface AcmsFilter {
  operator: 'eq' | 'neq' | 'gt' | 'lt' | 'gte' | 'lte' | 'lk' | 'nlk' | 're' | 'nre' | 'em' | 'nem';
  value: string;
  connector: 'and' | 'or';
}
```

### Example: Building Complex Field Queries

```js
import { AcmsFieldList } from '@uidev1116/acms-js-sdk';

// Create a field list with multiple conditions
const fieldList = new AcmsFieldList([
  {
    key: 'color',
    filters: [
      { operator: 'eq', value: 'red', connector: 'or' },
      { operator: 'eq', value: 'blue', connector: 'or' }
    ],
    separator: '_and_'
  },
  {
    key: 'size',
    filters: [
      { operator: 'gte', value: '10', connector: 'and' }
    ],
    separator: '_and_'
  }
]);

// Convert to string
console.log(fieldList.toString());
// => 'color/eq/red/blue/_and_/size/gte/10'
```

### Example: Parsing Field Strings

```js
import { AcmsFieldList } from '@uidev1116/acms-js-sdk';

// Parse from string
const fieldList = AcmsFieldList.fromString('color/eq/red/blue/_and_/size/gte/10');

// Get structured data
const fields = fieldList.getFields();
console.log(fields);
// => [
//   { key: 'color', filters: [...], separator: '_and_' },
//   { key: 'size', filters: [...], separator: '_and_' }
// ]
```

### Using with parseAcmsPath

When you parse a path containing field segments, the result will include an `AcmsFieldList` instance:

```js
import { parseAcmsPath } from '@uidev1116/acms-js-sdk';

const context = parseAcmsPath('/field/color/eq/red');

// context.field is an AcmsFieldList instance
console.log(context.field.toString());
// => 'color/eq/red'

console.log(context.field.getFields());
// => [{ key: 'color', filters: [...], separator: '_and_' }]
```
