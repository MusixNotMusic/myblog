import { fetchWeatherApi } from 'openmeteo';


export async function getTotalCloudCover() {
    const params = {
        "latitude": 52.52,
        "longitude": 13.41,
        "hourly": "cloud_cover",
        "models": "ecmwf_ifs025",
        "timezone": "UTC"
    };
    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);
    
    // Helper function to form time ranges
    const range = (start, stop, step) =>
        Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);
    
    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];
    if (!response) {
        console.error("No weather data found for location.");
        return;
    }
    
    // Attributes for timezone and location
    const utcOffsetSeconds = response.utcOffsetSeconds();
    const timezone = response.timezone();
    const timezoneAbbreviation = response.timezoneAbbreviation();
    const latitude = response.latitude();
    const longitude = response.longitude();
    
    const hourly = response.hourly();
    
    if (!hourly) {
        return;
    }
    // Note: The order of weather variables in the URL query and the indices below need to match!
    const weatherData = {
    
        hourly: {
            time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
                (t) => new Date((t + utcOffsetSeconds) * 1000)
            ),
            cloudCover: hourly.variables(0).valuesArray(),
        },
    
    };
    
    // `weatherData` now contains a simple structure with arrays for datetime and weather data
    for (let i = 0; i < weatherData.hourly.time.length; i++) {
        console.log(
            weatherData.hourly.time[i].toISOString(),
            weatherData.hourly.cloudCover[i]
        );
    }
}