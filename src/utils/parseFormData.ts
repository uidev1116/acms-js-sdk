import { parse } from 'qs';

type JsonObject = { [Key in string]?: JsonValue };
type JsonArray = Array<JsonValue>;
type JsonValue = string | number | JsonObject | JsonArray | boolean | null;

function formDataToQueryString(formData: FormData) {
  const params = new URLSearchParams();
  for (const [key, value] of formData) {
    params.append(key, value as string);
  }
  return params.toString();
}

export default function parseFormData(formData: FormData): JsonObject {
  const queryString = formDataToQueryString(formData);
  return parse(queryString) as JsonObject;
}
