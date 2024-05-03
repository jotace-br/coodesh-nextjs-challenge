interface ISearch {
  query: string;
  limit: number;
  offset: number;
}

export async function fetchSearch({ query, limit, offset }: ISearch) {
  const response = await fetch(
    `https://de1.api.radio-browser.info/json/stations/search?limit=${limit}&offset=${offset}&name=${query}&hidebroken=${true}`
  );
  const data = await response.json();
  return data;
}
