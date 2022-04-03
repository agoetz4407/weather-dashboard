var apiKey = "ba7e894de92ecba7bd4c5eb8943840a3"
var citySearch = document.getElementById("city-search")
var searchBtn = document.getElementById("search-btn")
var previousCities = document.getElementById("previous-cities")

var cityClickHandler = function(event) {
    var cityName = event.target.getAttribute("data-city")
    getLocationData(cityName)
}

var generateSearchBtn = function(city) {
    newButton = document.createElement("button")
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
        console.log(locationData)
        getCurrentWeather(locationData[0].lat, locationData[0].lon)
    })
}

var getCurrentWeather = function(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`)
    .then(function(response) {
        return response.json()
    })
    .then(function(weatherData) {
        console.log(weatherData)
    })
}

var getCity = function() {
    var newCity = citySearch.value
    getLocationData(newCity)
    generateSearchBtn(newCity)
    citySearch.innerText = ""
}


searchBtn.addEventListener("click", getCity)