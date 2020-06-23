const requestWeatherButton = document.querySelector('#requestWeatherButton');
const requestInput = document.querySelector('#request');
//Ideally the API Key shouldn't be hardcoded into the frontend
const apiKey = "3d99e3c32924914dc3855788b8010f76"; 


// Send a request to OpenWeather API
function sendRequest() {
    const request = new XMLHttpRequest();
    request.onreadystatechange =  function() {
        setWeatherResults(request);
    };
    const location = document.querySelector('#location').value;
    const endpoint = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`;
    request.open("GET", endpoint, true);
    request.send();
};

// Handle city name submission on enter key press
function handleInputEnter(event) {
    if(event.which == 13 || event.keyCode == 13) {
        event.preventDefault();
        sendRequest();
    }
}

requestWeatherButton.onclick = sendRequest;
requestInput.onkeypress = handleInputEnter;


// Set ui based on request results
function setWeatherResults(requestResult) {
    const image = document.createElement("img");
    const resultImageDiv = document.querySelector('#resultImage');
    // Clear out the previous image
    if (resultImageDiv.childNodes.length > 0) {
        resultImageDiv.removeChild(resultImageDiv.childNodes[0]);
    }

    if (requestResult.readyState == 4 && requestResult.status == 200) {
        const weatherInfo = JSON.parse(requestResult.response);
        const title = weatherInfo.name;
        const mainInfo = weatherInfo["main"];
        const skyInfo = weatherInfo["weather"][0];
        const icon = skyInfo.icon;

        image.setAttribute("src", 
            `http://openweathermap.org/img/wn/${icon}@2x.png`);
        resultImageDiv.appendChild(image);

        document.querySelector('#resultTitle').innerHTML = title; 
        document.querySelector('#resultDescription').innerHTML = skyInfo.description; 
        document.querySelector('#currentTemp').innerHTML = `Current: ${formatTemp(mainInfo.temp)}`; 
        document.querySelector('#minTemp').innerHTML = `Min: ${formatTemp(mainInfo.temp_min)}`; 
        document.querySelector('#maxTemp').innerHTML = `Max: ${formatTemp(mainInfo.temp_max)}`; 
        document.querySelector('#pressure').innerHTML = `Air Pressure: ${mainInfo.pressure} hPa`; 
        document.querySelector('#humidity').innerHTML = `Humidity: ${mainInfo.humidity}%`;
    }
    else {
        document.querySelector('#resultTitle').innerHTML = ""; 
        document.querySelector('#resultDescription').innerHTML = 
            "Unable to retrieve results!"; 
        document.querySelector('#currentTemp').innerHTML = "";
        document.querySelector('#minTemp').innerHTML = "";
        document.querySelector('#maxTemp').innerHTML = ""; 
        document.querySelector('#pressure').innerHTML = ""; 
        document.querySelector('#humidity').innerHTML = "";
        
    }
}


function formatTemp(temp) {
    // Kelvin to Farenheit and rounding to two digits
    return parseFloat(Math.round(((parseFloat(temp) - 273.15) 
        * 9 / 5  + 32) * 100) / 100) + "\u00B0F";
}