var searchBar = document.querySelector('#searchBar');
var currentWeatherEl = document.querySelector('#currentWeather');
var forecastEl = document.querySelector('#forecast');

var getCoord = function(city){
    var apiUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&appid=ec7a75b859f25b487d5d65395cbdeff9';
    fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          setCoord(data);
          getCityInfo(lat, lon);
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to Weathermap');
    });
};

var lat;
var lon;
var date;
var icon;
var temp;
var humidity;
var wind;

var setCoord = function (info){
    lat = info[0].lat;
    lon = info[0].lon
}


getCoord('San Diego');

var getCityInfo = function(y, x){
    var apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + y + '&lon=' + x + '&appid=ec7a75b859f25b487d5d65395cbdeff9&units=imperial';
    fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          setWeather(data.list);
          displayWeather();
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to Weathermap');
    });
};

var setWeather = function(info){
    var dateTimeString = info[0].dt_txt;
    var dateString = dateTimeString.split(' ')[0];
    var year = dateString.split('-')[0];
    var dateNoYear = dateString.split('-').slice(1).join('/');
    date = dateNoYear + "/" + year;
    var iconNum = info[0].weather[0].icon;
    icon = "https://openweathermap.org/img/wn/" + iconNum + "@2x.png";
    temp = info[0].main.temp;
    humidity = info[0].main.humidity;
    wind = info[0].wind.speed;
}

var displayWeather = function (){
    $("#currentWeather").append(
        $(document.createElement('p')).attr({
        class: 'heading',
    })
    );
    $('.heading').text('San Diego'+ ' (' + date + ') ');
    $(`<img src='${icon}'>`).appendTo('.heading');

    $("#currentWeather").append(
        $(document.createElement('p')).attr({
        class: 'currentTemp',
    })
    );
    $('.currentTemp').text('Temp: ' + temp + '°F');

    $("#currentWeather").append(
        $(document.createElement('p')).attr({
        class: 'currentHumidity',
    })
    );
    $('.currentHumidity').text('Humidity: ' + humidity + '%');

    $("#currentWeather").append(
        $(document.createElement('p')).attr({
        class: 'currentWind',
    })
    );
    $('.currentWind').text('Wind Speed: ' + wind + ' MPH');
}