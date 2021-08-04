import React, { useState } from 'react';

import './styles.scss';

import Prefix from '../../contexts/api';
import api from '../../contexts/baseUrl';

import Error from '../../components/error';

export default function Main() {

  const [city, setCity] = useState('');
  const [clima, setClima] = useState(0);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);

  const [control, setControl] = useState(false);

  const [controlError, setControlError] = useState(false);
  const [erro, setErro] = useState('');

  async function handleClima() {
    setControl(false);
    setControlError(false);

    if (!city) {
      setControlError(true);
      setErro("Preencha o campo corretamente.");
    } else {
      const req = await api.get('/weather?q=' + city + Prefix.API_KEY)
        .then(response => {
          //transform the temperature in Kelvin to Celsius and get lat and long
          let element = {
            atual: Number(Math.round(response.data.main.temp) - 273),
            min: Number(Math.round(response.data.main.temp_min) - 273),
            max: Number(Math.round(response.data.main.temp_max) - 273),
            longitude: Number(response.data.coord.lon),
            latitude: Number(response.data.coord.lat),
          }

          setClima(element.atual);
          setMin(element.min);
          setMax(element.max);
          setLongitude(element.longitude);
          setLatitude(element.latitude);

          setControl(true);
        })
        .catch(error => {
          setControlError(true);
          setErro("Cidade não encontrada - " + error);
        })
    }
  }

  return (
    <div className="main">
      <h2>Pesquise pelo nome da cidade</h2>
      <div className="form">
        <input type="text" placeholder="digite a cidade..." value={city} onChange={city => setCity(city.target.value)} />
        <button onClick={handleClima}>enviar</button>
      </div>

      {controlError &&
        <Error error={erro} />
      }

      {control &&
        <div className="result">
          <div className="atual">
            {/* <img src={Cloud} alt="Nuvem" /> */}
            <h2>{clima} °C</h2>
          </div>
          <p>Mínima: {min}°C - Máxima: {max}°C</p>
          <iframe
            width="100%"
            height="170"
            frameBorder="0"
            scrolling="no"
            src={`https://maps.google.com/maps?q=${latitude},${longitude}&hl=es&z=14&amp`}
          >
          </iframe>
        </div>
      }
    </div>
  );
}