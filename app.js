const sectionElem = document.getElementById('container');
const currentDateElem = document.querySelector('.current-date');
const minTempElem = document.querySelector('#min-temp');
const maxTempElem = document.querySelector('#max-temp');
const tempElem = document.querySelector('#temp');
const weatherDescElem = document.querySelector('#weather-desc');
const weatherIconElem = document.querySelector('.weather-icon');
const calenderElem = document.querySelector('.calender');

// Weather icon and description mappings
const weatherIcons = {
  Clouds: { day: "assets/day_partial_cloud.png", night: "assets/night_half_moon_partial_cloud.png" },
  Clear: { day: "assets/day_clear.png", night: "assets/night_half_moon_clear.png" },
  Rain: { day: "assets/day_rain.png", night: "assets/night_half_moon_rain.png" },
  Mist: { day: "assets/fog.png", night: "assets/fog.png" },
  Snow: { day: "assets/day_snow.png", night: "assets/night_half_moon_snow.png" }
};

const weatherDescriptions = {
  Clouds: 'ابری',
  Clear: 'آسمان صاف',
  Rain: 'بارانی',
  Mist: 'مه',
  Snow: 'برفی'
};

// Function to get current date in Persian format
function currentDate(todayDate) {
  const options = {
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  };

  const persianDate = new Intl.DateTimeFormat('fa-IR', options).format(todayDate[0].data);
  currentDateElem.innerHTML = persianDate;
};

let currentHour = new Date().getHours();
const isDay = currentHour >= 6 && currentHour < 18;
const timeOfDay = isDay ? 'day' : 'night';

// Function to set the theme based on the time of day and weather condition
function setDesign(data) {

  sectionElem.classList.toggle('day', isDay);
  sectionElem.classList.toggle('night', !isDay);

  const weather = data[0].weather.main;
  weatherIconElem.src = weatherIcons[weather][timeOfDay];
}
// setInterval(setDesign, 1000);

const temp = (temperature) => `${Math.floor(temperature)}°`;

//complete the forecast calender
function completeForecast(data) {
  calenderElem.innerHTML = '';
  let remainingDays = Object.keys(data).length;

  data.forEach(function (elem) {
    let createElem = `<div class="days-of-calender">
          <div>
              <p class="temp">${temp(elem.min)} حداقل</p>
              <p class="temp">${temp(elem.max)} حداکثر</p>
          </div>
          <img src="${weatherIcons[elem.weather.main][timeOfDay]}" />
          <p>${elem.dateTitle}</p>
      </div>
      `;

    if (remainingDays > 1) {
      createElem += `<div class="line-break"></div>`;
    };
    remainingDays--;

    calenderElem.innerHTML += createElem;

  })
};

// get forecast from api
function fetchData() {

  fetch('https://api.dastyar.io/express/weather?lat=35.67194277&lng=51.42434403').then(res => res.json())
    .then(data => {
      console.log(data);

      minTempElem.innerHTML = `${temp(data[0].min)} حداقل`;
      maxTempElem.innerHTML = `${temp(data[0].max)} حداکثر`;
      tempElem.innerHTML = temp(data[0].current);

      weatherDescElem.innerHTML = weatherDescriptions[data[0].weather.main];
      completeForecast(data);
      setDesign(data);
      currentDate(data);
    }).catch(error => console.error('Error fetching data:', error));

};


fetchData();




