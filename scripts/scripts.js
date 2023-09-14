(function ( ) {
    
    baseUrl = '/countries-info'
    
    // Detect header location
    const currentUrl = window.location;
    
    if(currentUrl.pathname == baseUrl + '/index.html')
    {
        getCountryByGeolocation()
    }
    else if(currentUrl.pathname == baseUrl + '/country.html')
    {
        getSelectedCountry()
    }
    else if(currentUrl.pathname == baseUrl + '/countries.html')
    {
        getAllCountries()
    }
    
    async function getCountryByGeolocation()
    {
        // Detect coords
        let coords = await getCoords().catch(err => console.log(err))
        let lat = coords[0]
        let long = coords[1]
        // Country according coords
        let country = await getCountryName(lat,long).catch(err => console.log(err))
    
        // Ocultar alerta en index
        const geoAlert = document.querySelector("#geo-alert")
        if(geoAlert) {
            geoAlert.style.display = "none"
        }
    
        showCountry(country);
    }
    
    async function getAllCountries()
    {
        //https://restcountries.com/v3.1/all
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,capital,altSpellings,subregion,flags');
        let countriesData = await response.json();
    
        const cardsList = document.getElementById('cards-list');
    
        for(country of countriesData)
        {
            let name = country.name.common
            let altSpelling = country.altSpellings[0]
            let capital = country.capital
            let subregion = country.subregion
            let flagUrl = country.flags.svg
    
            const cardHTML = `
                <div class="col mb-3">
                    <div class="card" style="width: 18rem;">
                    <img src="${flagUrl}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title" id="country-name">${name}</h5>
                        <ul class="list-group list-group-flush" id="country-card-details">
                        <li class="list-group-item">${altSpelling}</li>
                        <li class="list-group-item">Capital: ${capital}</li>
                        <li class="list-group-item">Region: ${subregion}</li>
                        </ul>
                        <a href="country.html?country=${name}" class="btn btn-primary">See details</a>
                    </div>
                    </div>
                </div>
            `;
    
            // Add to cardsList
            cardsList.innerHTML += cardHTML;
        }
    }
    
    // If youre in /country.html read get param and show the country
    // code by: https://concamilo.com/como-obtener-los-parametros-de-la-url-con-javascript/
    async function getSelectedCountry(){
        const valores = window.location.search;
        const urlParams = new URLSearchParams(valores);
    
        // If country param exist get and show data
        if(urlParams.has('country')){
            var country = urlParams.get('country')
            await showCountry(country)
        }
        else { //Si no existe mostrar pais actual
            getCountryByGeolocation()
        }
    
    }
    
    async function showCountry(country) {
    
        const countryContainer = document.querySelector("#country-fulldetails");
    
        if (countryContainer) {
        countryContainer.style.display = "block";
        }
    
        const response = await fetch(`https://restcountries.com/v3.1/name/${country}`);
        const countryData = (await response.json())[0];
    
        // Set flag image
        document.querySelector("#country-flag").src = countryData.flags.svg;
    
        // Set text for details
        setText("#altname-detail", countryData.altSpellings[0]);
        setText("#capital-detail", countryData.capital[0]);
        setText("#region-detail", countryData.subregion);
    
        // Set text for description
        setText("#country-name", countryData.name.common);
        setText("#altname-desc", countryData.altSpellings[0]);
        setText("#capital-desc", countryData.capital[0]);
        setText("#region-desc", countryData.subregion);
        setText("#country-name-desc", country);
        setText("#currency-desc", Object.values(countryData.currencies)[0].name);
        setText("#currency-symbol-desc", Object.values(countryData.currencies)[0].symbol);
        setText("#lang-desc", Object.values(countryData.languages)[0]);
        setText("#population", countryData.population);
    
        }
    
        function setText(selector, text) {
        document.querySelector(selector).textContent = text;
    }
    
    function getCountryName(lat,long)
    {
        return new Promise((resolve, reject) => {
            const apiKey = '1ac44d71cda84b15b3c08e9500746f15';
            const coords = `${lat},${long}`;
    
            const apiUrl = 'https://api.opencagedata.com/geocode/v1/json';
    
            const requestUrl = `${apiUrl}?key=${apiKey}&q=${encodeURIComponent(coords)}&pretty=1&no_annotations=1`;
    
            fetch(requestUrl)
                .then(response => {
                    if (response.ok) {
                    return response.json();
                    }
                    throw new Error('Unable to geocode');
                })
                .then(data => {
                    let country = 'no country returned';
                    if (data.results[0].components.country != null) {
                    country = data.results[0].components.country;
                }
                    resolve(country);
                })
                .catch(error => {
                    reject(error.message);
                });
        });
    }
    
    function getCoords(){
        return new Promise((resolve, reject) => {
            if (navigator.geolocation)
            {
                var options = {
                    enableHighAccuracy: true,
                    timeout: 6000,
                    maximumAge: 0
                };
    
                navigator.geolocation.getCurrentPosition(
                    async function success(position)
                    {
                        // Mostrar la informacion del pais en index
                        let lat = position.coords.latitude
                        let long = position.coords.longitude
    
                        resolve([lat,long])
    
                    }, function error()
                    {
                        // Mostrar alerta en index
                        reject("Permiso no concedido")
                    }, options);
            }
        });
    }

}) ( );
