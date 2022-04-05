var apiKey = "ba7e894de92ecba7bd4c5eb8943840a3"
var citySearch = document.getElementById("city-search")
var searchBtn = document.getElementById("search-btn")
var previousCities = document.getElementById("previous-cities")
var currentCity = document.getElementById("city-name")
var currentTemp = document.getElementById("temp")
var currentWind = document.getElementById("wind")
var currentHumidity = document.getElementById("humidity")
var currentUVIndex = document.getElementById("uv-index")
var fiveDayForecast = document.querySelector(".five-day")

var displayCurrentWeather = function(weatherData) {
    var icon = document.createElement('img')
    var iconId = weatherData.current.weather[0].icon
    icon.setAttribute("src", `http://openweathermap.org/img/w/${iconId}.png`)
    currentCity.appendChild(icon)
    currentTemp.innerText = weatherData.current.temp
    currentWind.innerText = weatherData.current.wind_speed
    currentHumidity.innerText = weatherData.current.humidity
    var UVIndex = weatherData.current.uvi
    currentUVIndex.style.opacity = 1
    if (UVIndex < 3) {
        currentUVIndex.style.backgroundColor = "green"
    }
    else if (UVIndex < 6) {
        currentUVIndex.style.backgroundColor = "yellow"
    }
    else if (UVIndex < 8) {
        currentUVIndex.style.backgroundColor = "orange"
    }
    else {
        currentUVIndex.style.backgroundColor = "red"
    }
    currentUVIndex.innerText = UVIndex
}

var displayFiveDayWeather = function(weatherData) {
    //clearing old data
    var oldFiveDayContainer = document.getElementById("five-day")
    oldFiveDayContainer.remove()
    //creating new container for new data
    var newFiveDayContainer = document.createElement("div")
    newFiveDayContainer.setAttribute("id", "five-day")
    fiveDayForecast.appendChild(newFiveDayContainer)
    var fiveDayArr = weatherData.daily
    for (var i = 1; i < 6; i++) {
         let weatherCard = document.createElement("div")
         weatherCard.classList.add("card")
         let date = document.createElement("h3")
         date.innerText = dayjs().add(i, "day").format('MM/DD/YYYY')
         weatherCard.appendChild(date)
         let icon = document.createElement('img')
         let iconId = fiveDayArr[i].weather[0].icon
         icon.setAttribute("src", `http://openweathermap.org/img/w/${iconId}.png`)
         weatherCard.appendChild(icon)
         let tempEl = document.createElement('p')
         let temp = fiveDayArr[i].temp.day
         tempEl.innerHTML = `Temp: ${temp}&#8457;`
         weatherCard.appendChild(tempEl)
         let windEl = document.createElement('p')
         let wind = fiveDayArr[i].wind_speed
         windEl.innerHTML = `Wind: ${wind}mph`
         weatherCard.appendChild(windEl)
         let humidityEl = document.createElement('p')
         let humidity = fiveDayArr[i].humidity
         humidityEl.innerHTML = `Humidity: ${humidity}%`
         weatherCard.appendChild(humidityEl)
         newFiveDayContainer.appendChild(weatherCard)
    }
}

var cityClickHandler = function(event) {
    var cityName = event.target.getAttribute("data-city")
    getLocationData(cityName)
}

var loadCities = function() {
    var loadedCities = localStorage.getItem("Cities")
    if (!loadedCities) {
        return;
    }
    loadedCities = JSON.parse(loadedCities)
    for (var i = 0; i < loadedCities.length; i++) {
        generateSearchBtn(loadedCities[i])
    }
}

var saveCity = function(city) {
    var savedCities = localStorage.getItem("Cities")
    if (!savedCities){
        localStorage.setItem("Cities", JSON.stringify([city]))
        return;
    }
    savedCities = JSON.parse(savedCities)
    savedCities.push(city)
    localStorage.setItem("Cities", JSON.stringify(savedCities))
}

var generateSearchBtn = function(city) {
    var newButton = document.createElement("button")
    newButton.setAttribute("type", "button")
    newButton.setAttribute("data-city", city)
    newButton.innerText = city
    previousCities.appendChild(newButton)
    newButton.addEventListener("click", cityClickHandler)
}

var getLocationData = function(city) {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`)
    .then(function(response) {
        return response.json()
    })
    .then(function(locationData) {
        getCurrentWeather(locationData[0].lat, locationData[0].lon)
        currentCity.innerText = locationData[0].name + " (" + dayjs().format('MM/DD/YYYY') + ")"
    })
}

var getCurrentWeather = function(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`)
    .then(function(response) {
        return response.json()
    })
    .then(function(weatherData) {
        displayCurrentWeather(weatherData)
        displayFiveDayWeather(weatherData)
    })
}

var getCity = function() {
    var newCity = citySearch.value
    getLocationData(newCity)
    generateSearchBtn(newCity)
    saveCity(newCity)
    citySearch.value = ""
}

loadCities();
searchBtn.addEventListener("click", getCity)