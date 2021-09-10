import React, { useState, useEffect } from "react";
import ReactWeather, { useOpenWeather } from "react-open-weather";

const Weather = (props) => {
  const { city } = props;

  const [dataObj, setDataObj] = useState({
    lat: "26.9124",
    lon: "75.7873",
  });
  const [cityState, setCityState] = useState(city);
  const [loading, setLoading] = useState(true);

  const { data, isLoading, errorMessage } = useOpenWeather({
    key: "35870afbe2814f59de9c7531152b18e5",
    ...dataObj,
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
    const xhr = new XMLHttpRequest();
    const lat = coordinates[0];
    const lng = coordinates[1];

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
      if (xhr.readyState === 4 && xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        setCityState(response.address.city);
        return;
      }
    }
  };

  const getCoordinates = async () => {
    const xhr = new XMLHttpRequest();

    xhr.open(
      "GET",
      "https://us1.locationiq.com/v1/search.php?key=pk.644d1b3c8b0a9f53660c322b4afaa59c&q=" +
        cityState +
        "&format=json",
      true
    );
    xhr.send();
    xhr.onreadystatechange = processRequest;
    xhr.addEventListener("readystatechange", processRequest, false);

    function processRequest(e) {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        const latArr = [];
        const lngArr = [];
        response.forEach((e) => {
          latArr.push(Number(e.lat));
          lngArr.push(Number(e.lon));
        });
        const finLat = latArr[0];
        const finLng = lngArr[0];
        setDataObj({ lat: String(finLat), lon: String(finLng) });
        return;
      } else if (xhr.readyState === 4 && xhr.status === 404) {
        console.log("error");
        return;
      }
    }
  };

  useEffect(() => {
    if (city === null)
      navigator.geolocation.getCurrentPosition(function (position) {
        getCity([position.coords.latitude, position.coords.longitude]);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (cityState !== null) getCoordinates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityState]);

  useEffect(() => {
    setLoading(true);
    setCityState(city);
  }, [city]);

  useEffect(() => {
    if (data !== null) setLoading(false);
  }, [data]);

  return (
    !loading &&
    cityState && (
      <ReactWeather
        isLoading={isLoading}
        errorMessage={errorMessage}
        data={data}
        lang="en"
        locationLabel={capitalize(cityState)}
        unitsLabels={{ temperature: "°C", windSpeed: "m/s" }}
      />
    )
  );
};

export default Weather;
