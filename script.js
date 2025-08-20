let ciudades = [];

// Cargar lista de ciudades
fetch('city.list.json')
    .then(response => response.json())
    .then(data => {
        ciudades = data;
        console.log("Ciudades cargadas:", ciudades.length);
    });

const input = document.getElementById('ciudad');
const suggestionsBox = document.getElementById('suggestions');

// Autocompletar ciudades
input.addEventListener('input', () => {
    const texto = input.value.toLowerCase().trim();
    suggestionsBox.innerHTML = '';

    if (texto.length < 2) return;

    const resultados = ciudades.filter(c => {
        const nombre = c.name.toLowerCase();
        const pais = c.country.toLowerCase();
        return nombre.startsWith(texto) || pais.startsWith(texto);
    });

    resultados.slice(0, 10).forEach(ciudad => { // máx 10 resultados
        const div = document.createElement('div');
        div.className = 'suggestion';
        div.textContent = `${ciudad.name}, ${ciudad.country}`;
        div.onclick = () => {
            input.value = `${ciudad.name}, ${ciudad.country}`;
            suggestionsBox.innerHTML = '';
            console.log("Seleccionada:", ciudad);
        };
        suggestionsBox.appendChild(div);
    });
});

/////////////////////////////////////////////////////////////////////////////////////////////////////

function convertirHora(unixTime, timezoneOffsetSec) {
    // unixTime y timezoneOffsetSec vienen en segundos
    const ms = (unixTime + timezoneOffsetSec) * 1000;
    const date = new Date(ms);

    // Formatear en UTC para no aplicar otra zona horaria
    return date.toLocaleTimeString('es-CR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'UTC'
    });
}


async function buscarClima() {
    const ciudad = document.getElementById("ciudad").value.trim();
    const apiKey = "acc8c24a53d61d3b80f85183dcbfb74a";

    // se valida que se ingrese una ciudad
    if (!ciudad) {
        alert("Por favor escribe una ciudad");
        return;
    }

    // URL de la api con la informacion del clima de la ciudad buscada
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(ciudad)}&appid=${apiKey}&units=metric&lang=es`;
    console.log(url);

    try {
        const respuesta = await fetch(url);
        if (!respuesta.ok) throw new Error("Ciudad no encontrada");

        const datos = await respuesta.json();

        // Limpiamos el contenido previo
        const main = document.getElementById("main");
        main.innerHTML = "";



        // Creamos el contenedor
        const card = document.createElement("div");
        card.className = "weather-card"
        card.style= "margin: 30px 0;"

        // Detalles de el clima de la ciudad buscada
        const details = document.createElement("div");
        details.className = "weather-details";

        // Se crea la estructura HTML para mostrar los detalles
        details.innerHTML = `
            <div class="weather-card card-weather">🌦️ Clima: ${datos.weather[0].description}
                <img src="https://openweathermap.org/img/wn/${datos.weather[0].icon}@2x.png" />
            </div>

            <div class="weather-card card-city">📍 Ciudad: <br><br>${datos.name}, ${datos.sys.country} 
               <br><br> <img src="https://flagcdn.com/48x36/${datos.sys.country.toLowerCase()}.png" /> 
            </div>
            
            <div class="weather-card card-wind">🌬️ Viento: ${datos.wind.speed} m/s</div>
            
            <div class="weather-card card-humidity">💧 Humedad: ${datos.main.humidity}%</div>
            
            <div class="weather-card card-temp">🌡️ Temperatura: ${datos.main.temp.toFixed(1)} °C</div>
            
            <div class="weather-card card-sunrise">☀️ Amanecer: ${convertirHora(datos.sys.sunrise, datos.timezone)}</div>
            
            <div class="weather-card card-sunset">🌇 Atardecer: ${convertirHora(datos.sys.sunset, datos.timezone)}</div>
            
            <div class="weather-card card-clouds">☁️ Nubes: ${datos.clouds.all}%</div>
        `;



        card.appendChild(details);

        // Agregar al main
        main.appendChild(card);


    } catch (error) {
        alert("Error: " + error.message);
    }
}
