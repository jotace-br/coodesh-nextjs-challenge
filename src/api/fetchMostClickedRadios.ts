type FetchMostClickedRadiosOptions = {
  limit?: number;
};

export async function fetchMostClickedRadios({
  limit = 10,
}: FetchMostClickedRadiosOptions = {}) {
  const response = await fetch(
    `https://de1.api.radio-browser.info/json/stations/topclick/${limit}?hidebroken=${true}`
  );
  return response.json();
}
