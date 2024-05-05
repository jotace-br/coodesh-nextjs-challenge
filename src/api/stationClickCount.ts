interface IStationClickCount {
  stationuuid: string;
}

export async function stationClickCount({ stationuuid }: IStationClickCount) {
  const response = await fetch(
    `https://de1.api.radio-browser.info/json/url/${stationuuid}`
  );
  return response.json();
}
