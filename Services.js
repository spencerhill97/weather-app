export default class Services {
  constructor() {
    this.cities = [];
    this.API_KEY = "f1d1db1f19b24a5ba3b164440232906";
    this.loading = false;
  }

  toggleLoading() {
    this.loading = !this.loading;
  }

  getLoading() {
    return this.loading;
  }

  async setForecast(city) {
    this.toggleLoading();
    try {
      const resp = await fetch(
        `http://api.weatherapi.com/v1/forecast.json?key=f1d1db1f19b24a5ba3b164440232906&q=${city}&days=7&aqi=no&alerts=no`,
        { mode: "cors" }
      );
      const data = await resp.json();
      return data;
    } catch (error) {
      console.log(error);
    }
    this.toggleLoading();
  }
}
