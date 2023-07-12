import Services from "./Services.js";

export default class UI {
  constructor() {
    this.services = new Services();
    this.farenheit = true;
    this.currentCity = "";
  }

  toggleFarenheit() {
    this.farenheit = !this.farenheit;
  }

  setCurrentCity(city) {
    this.currentCity = city;
  }

  getCurrentCity() {
    return this.currentCity;
  }

  renderLocation(data) {
    const location = document.querySelector(".location");
    const { name, country } = data.location;
    const { icon, text } = data.current.condition;
    const { temp_f, temp_c, feelslike_c, feelslike_f } = data.current;
    const { sunrise, sunset } = data.forecast.forecastday[0].astro;
    const { daily_chance_of_rain, daily_chance_of_snow } =
      data.forecast.forecastday[0].day;
    location.innerHTML = `
        <div>
          <h2 class="cities">${name && name}</h2>
          <h3 class="country">${country && country}</h3>
        </div>
        <div class="icon-div">
          <div>
            <img src=${icon} alt="icon" />
            <p class="bold">${text}</p>
          </div>
          <p><i class="thermometer icon fa-solid fa-temperature-three-quarters"></i> <span class="bold">${
            this.farenheit === true ? `${temp_f} &#x2109` : `${temp_c} &#x2103`
          }</span></p>
        </div>
        <div class="sun-feelslike-div">
          <div class="sunset-div">
            <p><i class="sun icon fa-solid fa-sun"></i> <span class="bold">${
              sunrise.split(" ")[0]
            }</span> sunrise</p>
            <p><i class="moon icon fa-regular fa-moon"></i> <span class="bold">${
              sunset.split(" ")[0]
            }</span> sunset</p>
          </div>
          <div>
            <p><i class="thermometer icon fa-solid fa-temperature-three-quarters"></i> Feels like <span class="bold">${
              this.farenheit === true
                ? `${feelslike_f} &#x2109`
                : `${feelslike_c} &#x2103`
            }</span></p>
            <p>${
              daily_chance_of_snow === 0
                ? `<i class="rain icon fa-solid fa-cloud-rain"></i> <span class="bold">${daily_chance_of_rain}%</span> chance of rain`
                : `<i class="snow icon fa-regular fa-snowflake"></i> <span class="bold">${daily_chance_of_snow}%</span> chance of snow`
            }
            </p>
          </div>
        </div>
      `;
  }

  renderCurrent(data) {
    const { humidity, precip_in, uv, wind_mph } = data.current;
    const condition = document.querySelector(".condition");
    condition.innerHTML = `
        <div class="more-details">
          <p><i class="icon fa-solid fa-wind fa-rotate-180"></i> <span class="bold">${wind_mph}mph</span> winds</p>
          <p><i class="icon fa-solid fa-droplet"></i> <span class="bold">${humidity}%</span> humidity</p>
          <p><i class="icon fa-solid fa-fire-flame-curved"></i> <span class="bold">${uv}%</span> uv index</p>
        </div>
      `;
  }

  renderToggleBtn() {
    const div = document.createElement("div");

    div.classList.add("toggle-temp");
    div.innerHTML = `
      <span class="toggle-btn"></span>
      <p>&#8457</p>
      <p>&#x2103</p>
    `;

    const condition = document.querySelector(".condition");
    condition.append(div);

    div.addEventListener("click", (e) => {
      e.target.classList.toggle("toggled");
      this.toggleFarenheit();
      this.renderPage(this.getCurrentCity());
    });
  }

  async renderPage(city) {
    try {
      this.setCurrentCity(city);
      const data = await this.services.setForecast(city);
      await this.renderLocation(data);
      await this.renderCurrent(data);
      await this.renderToggleBtn();

      if (!this.farenheit) {
        document.querySelector(".toggle-btn").classList.add("toggled");
      }
    } catch (error) {
      console.log(error);
    }
  }
}
