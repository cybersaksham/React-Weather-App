import React, { useState, useEffect } from "react";
import ReactWeather, { useOpenWeather } from "react-open-weather";
import Geocode from "react-geocode";

const Weather = (props) => {
  const { city } = props;

  const [dataObj, setDataObj] = useState({});

  const { data, isLoading, errorMessage } = useOpenWeather({
    key: "35870afbe2814f59de9c7531152b18e5",
    lat: "35.6762",
    lon: "139.6503",
    lang: "en",
    unit: "metric",
  });

  const capitalize = (s) => {
    const sNew = String(s).toLowerCase().trim();
    const sList = sNew.split(" ");
    sList.forEach((e, i) => {
      sList[i] = e.charAt(0).toUpperCase() + e.slice(1);
    });
    return sList.join(" ");
  };

  const getCity = async (coordinates) => {
    var xhr = new XMLHttpRequest();
    var lat = coordinates[0];
    var lng = coordinates[1];

    // Paste your LocationIQ token below.
    xhr.open(
      "GET",
      "https://us1.locationiq.com/v1/reverse.php?key=pk.644d1b3c8b0a9f53660c322b4afaa59c&lat=" +
        lat +
        "&lon=" +
        lng +
        "&format=json",
      true
    );
    xhr.send();
    xhr.onreadystatechange = processRequest;
    xhr.addEventListener("readystatechange", processRequest, false);

    function processRequest(e) {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var response = JSON.parse(xhr.responseText);
        var city = response.address.city;
        console.log(city);
        return;
      }
    }
  };

  useEffect(async () => {
    // const response = await fetch(
    //   "https://cybersaksham-apis.herokuapp.com/geo_coordinates",
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       "Access-Control-Allow-Origin": "*",
    //     },
    //     body: JSON.stringify({ address: city }),
    //   }
    // );
    // const json = await response.json();
    console.log(
      navigator.geolocation.getCurrentPosition(function (position) {
        console.log("Latitude is :", position.coords.latitude);
        console.log("Longitude is :", position.coords.longitude);
        getCity(position.coords.latitude, position.coords.longitude);
      })
    );
    // console.log(json);
    // set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
    Geocode.setApiKey("AIzaSyArKNhSQ2FCyTAC27AsNj4fZ50eyjU_KEY");

    // set response language. Defaults to english.
    Geocode.setLanguage("en");

    // set response region. Its optional.
    // A Geocoding request with region=es (Spain) will return the Spanish city.
    Geocode.setRegion("es");

    // set location_type filter . Its optional.
    // google geocoder returns more that one address for given lat/lng.
    // In some case we need one address as response for which google itself provides a location_type filter.
    // So we can easily parse the result for fetching address components
    // ROOFTOP, RANGE_INTERPOLATED, GEOMETRIC_CENTER, APPROXIMATE are the accepted values.
    // And according to the below google docs in description, ROOFTOP param returns the most accurate result.
    Geocode.setLocationType("ROOFTOP");

    // Enable or disable logs. Its optional.
    Geocode.enableDebug();

    // Get address from latitude & longitude.
    Geocode.fromLatLng("48.8583701", "2.2922926").then(
      (response) => {
        const address = response.results[0].formatted_address;
        console.log(address);
      },
      (error) => {
        console.error(error);
      }
    );

    // Get formatted address, city, state, country from latitude & longitude when
    // Geocode.setLocationType("ROOFTOP") enabled
    // the below parser will work for most of the countries
    Geocode.fromLatLng("48.8583701", "2.2922926").then(
      (response) => {
        const address = response.results[0].formatted_address;
        let city, state, country;
        for (
          let i = 0;
          i < response.results[0].address_components.length;
          i++
        ) {
          for (
            let j = 0;
            j < response.results[0].address_components[i].types.length;
            j++
          ) {
            switch (response.results[0].address_components[i].types[j]) {
              case "locality":
                city = response.results[0].address_components[i].long_name;
                break;
              case "administrative_area_level_1":
                state = response.results[0].address_components[i].long_name;
                break;
              case "country":
                country = response.results[0].address_components[i].long_name;
                break;
            }
          }
        }
        console.log(city, state, country);
        console.log(address);
      },
      (error) => {
        console.error(error);
      }
    );

    // Get latitude & longitude from address.
    Geocode.fromAddress("Eiffel Tower").then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        console.log(lat, lng);
      },
      (error) => {
        console.error(error);
      }
    );
  }, []);

  return (
    <ReactWeather
      isLoading={isLoading}
      errorMessage={errorMessage}
      data={data}
      lang="en"
      locationLabel={capitalize(city)}
      unitsLabels={{ temperature: "°C", windSpeed: "m/s" }}
      showForecast
    />
  );
};

export default Weather;
