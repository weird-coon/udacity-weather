const DEFAULT_UNIT = 'imperial';
const API_KEY = 'f71ac15f383d48b19e74abf4e104a9fc';
const WEATHER_ENDPOINT = 'https://api.openweathermap.org/data/2.5/weather';
const HTTP_SUCCESS_STATUS = 200;

const id = (id) => document.getElementById(id);
const classes = (classes) => document.getElementsByClassName(classes);

const button = id('generate');
const zip = id('zip');
const feelings = id('feelings');
const form = id('weather-form');
const errorMsg = classes('error');

// Create a new date instance dynamically with JS
const d = new Date();
const newDate = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;

const handleSubmit = async () => {
  const zipValue = zip.value.trim();
  fieldValidation(zip, 0, 'Zipcode cannot be blank');
  if (!!zipValue) {
    try {
      const res = await fetchData({ zip: zipValue });
      await storageData({
        zip: zipValue,
        city: res?.name,
        feel: feelings.value,
        date: newDate,
        temp: res?.main.temp,
      });
      // Fetch newest data then sync most recent entry
      await fetchRecentEntry();
    } catch (error) {
      console.error(`An error occur: ${error?.message}`);
      alert(`Error: ${error?.message}`);
    }
  }
};

const fieldValidation = (field, index, message) => {
  if (!field.value.trim()) {
    errorMsg[index].innerHTML = message;
    field.style.border = '1px solid red';
    field.focus();
  } else {
    errorMsg[index].innerHTML = '';
  }
};

const clearZipErrorState = () => {
  errorMsg[0].innerHTML = '';
  zip.style.border = '1px solid #333';
};

const storageData = (payload) =>
  fetch('/storage', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
  });

const fetchRecentEntry = async () => {
  const recent = await fetch('/recent');
  const allRecentData = await recent.json();
  syncMostRecentEntry(allRecentData);
};

const syncMostRecentEntry = (data) => {
  if (Object.keys(data).length) {
    id('temp').innerHTML = `<b>Temp</b>: ${Math.round(data.temp)} degrees`;
    id('content').innerHTML = data.feel
      ? `<b>Feelings</b>: ${data.feel}`
      : 'N/A';
    id('date').innerHTML = `<b>Date</b>: ${data.date}`;
    id('city').innerHTML = `<b>City</b>: ${data.city}`;
    id('zipcode').innerHTML = `<b>Zip</b>: ${data.zip}`;
  }
};

// Weather data from free trial OpenWeatherMap API
const fetchData = async (params = {}) => {
  const url = new URL(WEATHER_ENDPOINT);
  url.searchParams.append('units', DEFAULT_UNIT);
  url.searchParams.append('appId', API_KEY);
  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, params[key]),
  );

  const response = await fetch(url);
  const data = await response.json();
  if (data?.cod === HTTP_SUCCESS_STATUS) {
    return data;
  }

  throw new Error(data?.message);
};

// Fetch most recent entry from server on
window.addEventListener('load', fetchRecentEntry);

// Attach event for form button/input
button.addEventListener('click', handleSubmit);
zip.addEventListener('keydown', clearZipErrorState);
