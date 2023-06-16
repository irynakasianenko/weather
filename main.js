let form1 = document.querySelector('#city-input');
let city = form1.elements.city;
let btn = document.querySelector('#enter-btn');
let outputDiv = document.querySelector('#output');
let data = {
	city: 'Kyiv',

	save(city) {
		localStorage.setItem("city", JSON.stringify(city));
	},

	open() {
		return JSON.parse(localStorage.getItem("city")) || 'Kyiv';
	}
}

window.addEventListener('load', function () {
	let weather = new Weather(data.open());
	weather.getStations();
	let forecast = new Forecast(data.open());
	forecast.getData();
})

btn.addEventListener('click', function (e) {
	data.save(city.value);
	getWeather(e);
})

form1.addEventListener('keydown', function (e) {
	if (e.code == "Enter") {
		getWeather(e);
	}
})

function getWeather(e) {
	if (!city.value) {
		alert('Enter city');
		return;
	}
	e.preventDefault();
	outputDiv.textContent = '';
	let weather = new Weather(data.open());
	weather.getStations();
	let forecast = new Forecast(data.open());
	forecast.getData();
	city.value = '';
}

let btnCelcius = document.querySelector('.celcius');
let btnFarenheit = document.querySelector('.farenheit');

class Weather {
	constructor(city) {
		this.city = city;
	}

	getUrl() {
		return `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&appid=6fc5d6b05a1501b47eb8c2003fad038f&units=metric`;
	}

	getStations() {
		fetch(this.getUrl())
			.then(response => response.json())
			.then(data => {
				let output = new Output(data);
				output.createToday();
			})
			.catch(error => {
				console.log(error.message);
			})

	}
}


class Output {
	constructor(obj) {
		this.obj = obj;
	}

	createToday() {
		let divWrapper = document.createElement('div');
		divWrapper.classList.add('weather-wrapper');
		let divMain = document.createElement('div');
		divMain.classList.add('weather-main');
		let divCity = document.createElement('div');
		divCity.classList.add('div-city');
		let pCity = document.createElement('p');
		pCity.textContent = this.obj.name;
		pCity.classList.add('weather-main-city');
		let divBtn = document.createElement('div');
		let btnCelcius = document.createElement('button');
		btnCelcius.classList.add('active');
		btnCelcius.textContent = '°C';
		btnCelcius.classList.add('celcius');
		// let btnFarenheit = document.createElement('button');
		// btnFarenheit.textContent = 'F';
		// btnFarenheit.classList.add('farenheit');
		let imgDiv = document.createElement('div');
		imgDiv.innerHTML = `<img src="https://openweathermap.org/img/wn/${this.obj.weather[0].icon}@2x.png" alt="weather icon">`;
		let pTemp = document.createElement('p');
		pTemp.textContent = `${Math.round(this.obj.main.temp)}°`;
		pTemp.classList.add('main-temp')
		let pDescription = document.createElement('p');
		pDescription.textContent = this.obj.weather[0].description;
		let pTempMaxMin = document.createElement('p');
		pTempMaxMin.textContent = `Max: ${Math.round(this.obj.main.temp_max)}°  Min: ${Math.round(this.obj.main.temp_min)}°`;
		divBtn.append(btnCelcius);
		// divBtn.append(btnFarenheit);
		divCity.append(pCity);
		divCity.append(divBtn);
		divMain.append(divCity);
		divMain.append(imgDiv);
		divMain.append(pTemp);
		divMain.append(pDescription);
		divMain.append(pTempMaxMin);
		let divAdditional = document.createElement('div');
		divAdditional.classList.add('weather-additional');
		let pHumidity = document.createElement('p');
		pHumidity.innerHTML = `<img src="assets/icons/icons8-dew-point-18.png" alt="humidity icon">${this.obj.main.humidity}%`;
		let pwind = document.createElement('p');
		pwind.innerHTML = `<img src="assets/icons/wind.svg" alt="wind icon">${this.obj.wind.speed}meter/sec`;
		divAdditional.append(pHumidity);
		divAdditional.append(pwind);
		divWrapper.append(divMain);
		divWrapper.append(divAdditional);
		outputDiv.append(divWrapper);
	}

	createForecast() {
		let divWrapper = document.createElement('div');
		divWrapper.classList.add('forecast-wrapper');
		let h2 = document.createElement('h2');
		h2.textContent = 'Next forecast';
		divWrapper.append(h2);
		outputDiv.append(divWrapper);
	}

	createForecastOneDay(elem, day, month) {
		let divWrapper = document.querySelector('.forecast-wrapper');
		let divDay = document.createElement('div');
		divDay.classList.add('forecast-wrapper-day');
		let pDay = document.createElement('p');
		pDay.classList.add('currentDay');
		pDay.textContent = `${day}.${month}`;
		let pImg = document.createElement('p');
		pImg.insertAdjacentHTML('afterbegin', `<img src="https://openweathermap.org/img/wn/${elem.weather[0].icon}@2x.png" alt="weather icon">`);
		let pTemp = document.createElement('p');
		pTemp.textContent = `${Math.round(elem.main.temp_min)}°/${Math.round(elem.main.temp_max)}°`;
		divDay.append(pDay);
		divDay.append(pImg);
		divDay.append(pTemp);
		divWrapper.append(divDay);
	}
}

class Forecast {
	constructor(city) {
		this.city = city;
	}

	getData() {
		fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${this.city}&appid=6fc5d6b05a1501b47eb8c2003fad038f&units=metric`)
			.then(response => response.json())
			.then(data => {
				this.getDay(data.list);
			})
			.catch(error => {
				console.log(error.message);
			});
	}

	getDay(data) {
		let output = new Output(data);
		let currentDay = new Date().getDate();

		for (let elem of data) {
			let day = elem.dt_txt.substring(8, 11);
			let month = elem.dt_txt.substring(5, 7);
			let hour = elem.dt_txt.substring(11, 13);
			if (day == currentDay + 1 && hour == '06') {
				output.createForecast();
				output.createForecastOneDay(elem, day, month);
			}
			if (day == currentDay + 2 && hour == '06') {
				output.createForecastOneDay(elem, day, month);
			}
			if (day == currentDay + 3 && hour == '06') {
				output.createForecastOneDay(elem, day, month);
			}
		}
	}
}
