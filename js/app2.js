const sectionElem = document.getElementById('container');
const currentDateElem = document.querySelector('.current-date');
const minTempElem = document.querySelector('#min-temp');
const maxTempElem = document.querySelector('#max-temp');
const tempElem = document.querySelector('#temp');
const weatherDescElem = document.querySelector('#weather-desc');
const weatherIconElem = document.querySelector('.weather-icon');

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
function currentDate() {
  const date = new Date();

  const options = {
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  };

  const persianDate = new Intl.DateTimeFormat('fa-IR', options).format(date);
  currentDateElem.innerHTML = persianDate;
  console.log(persianDate);
};

// Function to set the theme based on the time of day and weather condition
function setDesign(data) {

  let currentHour = new Date().getHours();

  const isDay = currentHour >= 6 && currentHour < 18;
  const timeOfDay = isDay ? 'day' : 'night';

  sectionElem.classList.toggle('day', isDay);
  sectionElem.classList.toggle('night', !isDay);

  const weather = data.weather[0].main;
  weatherIconElem.src = weatherIcons[weather][timeOfDay];
}
setInterval(setDesign, 1000);


// get forecast from api
function fetchData() {

  fetch('https://api.openweathermap.org/data/2.5/weather?q=tehran&appid=3141f096b1d4f2d719ea9d5c3e018978').then(res => res.json())
    .then(data => {
      const tempCelsius = (tempK) => `${Math.floor(tempK - 273.15)}°`;

      minTempElem.innerHTML = `${tempCelsius(data.main.temp_min)} حداقل`;
      maxTempElem.innerHTML = `${tempCelsius(data.main.temp_max)} حداکثر`;
      tempElem.innerHTML = tempCelsius(data.main.temp);

      weatherDescElem.innerHTML = weatherDescriptions[data.weather[0].main];

      setDesign(data);

    }).catch(error => console.error('Error fetching data:', error));

};

// Initialize the app
function init() {
  currentDate();
  fetchData();
}

init();

//complete the forecast calender

const dayIndex = new Date().getDay();

const persianWeekdays = { 6: "شنبه", 0: "یکشنبه", 1: "دوشنبه", 2: "سه‌شنبه", 3: "چهارشنبه", 4: "پنجشنبه", 5: "جمعه" };

const persianWeekday = persianWeekdays[dayIndex];

const calenderElem = document.querySelector('.calender');
let remainingDays = Object.keys(persianWeekdays).length - 1;

for (let day in persianWeekdays) {
  if (parseInt(day) === dayIndex) continue;

  let createElem = `<div class="days-of-calender">
      <div>
          <p class="temp">۱۱° حداقل</p>
          <p class="temp">۱۸° حداکثر</p>
      </div>
      <img src="assets/cloudy.png" />
      <p>${persianWeekdays[day]}</p>
  </div>
  `;
  if (remainingDays > 1) {
    createElem += `<div class="line-break"></div>`;
  };
  remainingDays--;
  calenderElem.innerHTML += createElem;
};

