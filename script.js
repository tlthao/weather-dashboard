function cityWeather(city, savedCities) {
  cityList(savedCities);

  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?&units=imperial&appid=885e9149105e8901c9809ac018ce8658&q=" +
    city;

  var queryURL2 =
    "https://api.openweathermap.org/data/2.5/forecast?&units=imperial&appid=885e9149105e8901c9809ac018ce8658&q=" +
    city;

  var latitude;
  var longitude;

  $.ajax({
    url: queryURL,
    method: "GET",
  })
  .then(function (weather) {
    console.log(queryURL);
    console.log(weather);
    var currentTime = moment();
    var displayMoment = $("<h3>");
    $("#city-name").empty();
    $("#city-name").append(
      displayMoment.text("(" + currentTime.format("M/D/YYYY") + ")")
    );

    var cityName = $("<h3>").text(weather.name);
    $("#city-name").prepend(cityName);

    var weatherIcon = $("<img>");
    weatherIcon.attr(
      "src",
      "https://openweathermap.org/img/w/" + weather.weather[0].icon + ".png"
    );
    $("#current-icon").empty();
    $("#current-icon").append(weatherIcon);

    $("#current-temp").text("Temperature: " + weather.main.temp + " °F");
    $("#current-humidity").text("Humidity: " + weather.main.humidity + "%");
    $("#current-wind").text("Wind Speed: " + weather.wind.speed + " MPH");

    latitude = weather.coord.lat;
    longitude = weather.coord.lon;

    var queryURL3 =
      "https://api.openweathermap.org/data/2.5/uvi/forecast?&units=imperial&appid=885e9149105e8901c9809ac018ce8658&q=" +
      "&lat=" +
      latitude +
      "&lon=" +
      longitude;

    $.ajax({
      url: queryURL3,
      method: "GET",
    }).then(function (uvIndex) {
      console.log(uvIndex);

      var uvIndexDisplay = $("<button>");
      uvIndexDisplay.addClass("btn btn-danger");

      $("#current-uv").text("UV Index: ");
      $("#current-uv").append(uvIndexDisplay.text(uvIndex[0].value));
      console.log(uvIndex[0].value);

      $.ajax({
        url: queryURL2,
        method: "GET",
      }).then(function (forecast) {
        console.log(queryURL2);

        console.log(forecast);

        for (var i = 6; i < forecast.list.length; i += 8) {
          var forecastDate = $("<h5>");

          var forecastPosition = (i + 2) / 8;

          console.log("#forecast-date" + forecastPosition);

          $("#forecast-date" + forecastPosition).empty();
          $("#forecast-date" + forecastPosition).append(
            forecastDate.text(currentTime.add(1, "days").format("M/D/YYYY"))
          );

          var forecastIcon = $("<img>");
          forecastIcon.attr(
            "src",
            "https://openweathermap.org/img/w/" +
              forecast.list[i].weather[0].icon +
              ".png"
          );

          $("#forecast-icon" + forecastPosition).empty();
          $("#forecast-icon" + forecastPosition).append(forecastIcon);

          console.log(forecast.list[i].weather[0].icon);

          $("#forecast-temp" + forecastPosition).text(
            "Temp: " + forecast.list[i].main.temp + " °F"
          );
          $("#forecast-humidity" + forecastPosition).text(
            "Humidity: " + forecast.list[i].main.humidity + "%"
          );

          $(".forecast").attr(
            "style",
            "background-color:rgb(149, 53, 238); color:white"
          );
        }
      });
    });
  });
}
function cityList(savedCities) {
  $("#saved-cities").empty();

  var keys = Object.keys(savedCities);
  for (var i = 0; i < keys.length; i++) {
    var cityListEntry = $("<button>");
    cityListEntry.addClass("list-group-item list-group-item-action");

    var splitStr = keys[i].toUpperCase().split(" ");
    for (var j = 0; j < splitStr.length; j++) {
      splitStr[j] =
        splitStr[j].charAt(0).toUpperCase() + splitStr[j].substring(1);
    }
    var upperCase = splitStr.join(" ");
    cityListEntry.text(upperCase);

    $("#saved-cities").append(cityListEntry);
  }
}

$(document).ready(function () {
  var savedCitiesStr = localStorage.getItem("savedCities");

  var savedCities = JSON.parse(savedCitiesStr);

  if (savedCities == null) {
    savedCities = {};
  }

  cityList(savedCities);

  $("#current-weather").hide();
  $("#forecast-weather").hide();

  $("#search-button").on("click", function (event) {
    event.preventDefault();
    var city = $("#city-input").val().trim().toLowerCase();

    if (city != "") {
      savedCities[city] = true;
      localStorage.setItem("savedCities", JSON.stringify(savedCities));

      cityWeather(city, savedCities);

      $("#current-weather").show();
      $("#forecast-weather").show();
    }
  });

  $("#saved-cities").on("click", "button", function (event) {
    event.preventDefault();
    var city = $(this).text();

    cityWeather(city, savedCities);

    $("#current-weather").show();
    $("#forecast-weather").show();
  });
});
