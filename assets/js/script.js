var searchBar = document.querySelector('#searchBar');
var submitBtn = document.querySelector('.btn');
var currentWeatherEl = document.querySelector('#currentWeather');
var forecastEl = document.querySelector('#forecast');

//take city input and retrieves coordinates for api, currect weather, and 5 day forecast weather
var getCoord = function(city){
    var apiUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&appid=ec7a75b859f25b487d5d65395cbdeff9';
    fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
            while(currentWeatherEl.firstChild){
            currentWeatherEl.removeChild(currentWeatherEl.firstChild);
            }
            while(forecastEl.firstChild){
            forecastEl.removeChild(forecastEl.firstChild);
            }
            setCoord(data);
            getCityInfo(lat, lon);
            forecastHeading();
            getForecast(lat,lon);
            pageFilled=true;

        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to Weathermap');
    });
};

//heading for 5 day forecast
var forecastHeading = function(){
    var h2El = document.createElement('h2');
    h2El.textContent = "5 Day Forecast:";
    h2El.classList.add("col-12");
    forecastEl.appendChild(h2El);
}

var lat;
var lon;
var date;
var icon;
var temp;
var humidity;
var wind;
var city;

//gets data from api and retreives lat and lon
var setCoord = function (info){
    lat = info[0].lat;
    lon = info[0].lon
}

//retrieves weather info from api using coordinates
var getCityInfo = function(y, x){
    var apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + y + '&lon=' + x + '&appid=ec7a75b859f25b487d5d65395cbdeff9&units=imperial';
    fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
            city = data.city.name;
            setWeather(data.list);
            displayWeather();
        }
        );
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to Weathermap');
    });
};

//formating for how the data is displayed
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

//append elements on page with current weather data retrieved from api
var displayWeather = function (){
    $("#currentWeather").append(
        $(document.createElement('h2')).attr({
        class: 'heading',
    })
    );
    $('.heading').text(city+ ' (' + date + ') ');
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

var forecastDate;
var forecastIcon;
var forecastTemp;
var forecastHumidity;
var forecastWind;

//append elements on page with 5 day forcast data retreived from api
var displayForecast = function (){
    var cardEl = document.createElement('div');
    cardEl.classList.add("card");
    cardEl.classList.add("col-2");
    forecastEl.appendChild(cardEl);

    var dateEl = document.createElement('p');
    dateEl.textContent = forecastDate;
    dateEl.classList.add("card-title");
    cardEl.appendChild(dateEl);

    var iconEl = document.createElement('img');
    iconEl.src = forecastIcon;
    iconEl.style = "float-right";
    dateEl.appendChild(iconEl);

    var tempEl = document.createElement('p');
    tempEl.textContent = 'Temp: ' + forecastTemp+ '°F';
    tempEl.classList.add("card-text");
    cardEl.appendChild(tempEl);

    var humidityEl = document.createElement('p');
    humidityEl.textContent = 'Humidity: ' + forecastHumidity + '%';
    humidityEl.classList.add("card-text");
    cardEl.appendChild(humidityEl);

    var windEl = document.createElement('p');
    windEl.textContent = 'Wind Speed: ' + forecastWind + ' MPH';
    windEl.classList.add("card-text");
    cardEl.appendChild(windEl);
}

//retrieve data for each day of 5 day forecast and format when displayed
var getForecast = function(y, x){
    var apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + y + '&lon=' + x + '&appid=ec7a75b859f25b487d5d65395cbdeff9&units=imperial';
    fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
            for(var i = 0; i<5; i++){
            var indexArr = [7, 15, 23, 31, 39];
            var index = indexArr[i];

                var dateTimeString = data.list[index].dt_txt;
                var dateString = dateTimeString.split(' ')[0];
                var year = dateString.split('-')[0];
                var dateNoYear = dateString.split('-').slice(1).join('/');
                forecastDate = dateNoYear + "/" + year;
                var iconNum = data.list[index].weather[0].icon;
                forecastIcon = "https://openweathermap.org/img/wn/" + iconNum + "@2x.png";
                forecastTemp = data.list[index].main.temp;
                forecastHumidity = data.list[index].main.humidity;
                forecastWind = data.list[index].wind.speed;
            
            displayForecast();
           
            };
        }
        );
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to Weathermap');
    });
};

var searches = [];

//retrieve and display current and forecast weather when search button is clicked
submitBtn.addEventListener('click', function(event){
    event.preventDefault();
    var input = $('#searchCity').val();
    getCoord(input);
    displaySearches();
    var value = input;
    searches.push(value);
    storeSearches();
});


//append buttons of previous searches on page
var displaySearches = function (){
    var input = $('#searchCity').val();
    $('#searchBar').append(
        $(document.createElement('input')).attr({
            type: 'button',
            class: 'savedBtn col-12',
            value: input,
        }).on('click', function () {
            var index = $('.savedBtn').index(this);
            var input = $('.savedBtn');
            var value = input.eq(index).val();
            getCoord(value);
        })
    );
}

//retrieve stored previous searches and append the buttons on the page; when button is clicked, weather of the search is displayed
function renderSearches(){
    var storedSearches = JSON.parse(localStorage.getItem("searches"));
    if(storedSearches !== null){
        searches = storedSearches;
        for (var i = 0; i < storedSearches.length; i++) {
            $('#searchBar').append(
                $(document.createElement('input')).attr({
                    type: 'button',
                    class: 'savedBtn col-12',
                    value: storedSearches[i],
                })
            );
        }
        $('.savedBtn').on('click', function () {
            var index = $('.savedBtn').index(this);
            var input = $('.savedBtn');
            var value = input.eq(index).val();
            getCoord(value);
        });
    }
}

function storeSearches(){
    localStorage.setItem("searches", JSON.stringify(searches));
}

renderSearches();
