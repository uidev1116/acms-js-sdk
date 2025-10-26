import { parse } from 'qs';

function formDataToQueryString(formData: FormData) {
  const params = new URLSearchParams();
  for (const [key, value] of formData) {
    params.append(key, value as string);
  }
  return params.toString();
}

export default function parseFormData(formData: FormData) {
  const queryString = formDataToQueryString(formData);
  return parse(queryString);
}
