import React, { useState } from 'react';

import './styles.scss';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

import Cloud from '../../assets/cloud.png';
import { FaSearch } from 'react-icons/fa';

import Prefix from '../../contexts/api';
import api from '../../contexts/baseUrl';

import Error from '../../components/error';

export default function Main() {

  const [city, setCity] = useState('');
  const [clima, setClima] = useState(0);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);
  const [umidade, setUmidade] = useState(0);

  const [control, setControl] = useState(false);

  const [controlError, setControlError] = useState(false);
  const [erro, setErro] = useState('');

  const [loading, setLoading] = useState(false);
  const [searchCity, setSearchCity] = useState('');

  async function handleClima() {
    setControl(false);
    setControlError(false);
    setLoading(true);

    if (!city) {
      setControlError(true);
      setErro("Preencha o campo corretamente.");
      setLoading(false);
    } else {
      const req = await api.get('/weather?q=' + city + Prefix.API_KEY)
        .then(response => {
          //transform the temperature in Kelvin to Celsius and get lat and long
          let element = {
            atual: Number(Math.round(response.data.main.temp) - 273),
            min: Number(Math.round(response.data.main.temp_min) - 273),
            max: Number(Math.round(response.data.main.temp_max) - 273),
            umidade: Number(response.data.main.humidity),
            name: response.data.name,
          }

          setClima(element.atual);
          setMin(element.min);
          setMax(element.max);
          setSearchCity(element.name);
          setUmidade(element.umidade);

          setControl(true);
          setLoading(false);
        })
        .catch(error => {
          setControlError(true);
          setErro("Cidade não encontrada - " + error);
          setLoading(false);
        })
    }
  }

  return (
    <main>
      <h2>Pesquise pelo nome da cidade</h2>
      <div className="form">
        <input type="text" placeholder="digite a cidade..." value={city} onChange={city => setCity(city.target.value)} />
        <button onClick={handleClima}><FaSearch /></button>
      </div>

      {controlError &&
        <Error error={erro} />
      }

      {control &&
        <div className="result">
          <div className="atual">
            <img src={Cloud} alt="Nuvem" />
            <h2>{searchCity}</h2>
            <h3>{clima} °C</h3>
          </div>
          <div className="minmax">
            <p>Mínima: {min}°C - Máxima: {max}°C</p>
          </div>
          <div className="otherinforms">
            <p>Umidade do ar: {umidade}%</p>
          </div>
        </div>
      }

      {loading &&
        <Loader
          type="TailSpin"
          color="#8b5eb6"
          height={50}
          width={50}
        />
      }

      <footer>
        <p>Made by Jr.</p>
      </footer>
    </main>

  );
}