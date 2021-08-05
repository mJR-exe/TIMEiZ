import React, { useState } from 'react';

import './styles.scss';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

import Logo2 from '../../assets/logo-2.png';
import Logo1 from '../../assets/logo.png';
import { FaSearch, FaWind, FaWater, FaThermometerFull, FaCloud, FaInfo, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

import api from '../../contexts/baseUrl';

import Error from '../../components/error';
import Link from '../../contexts/link';

export default function Main() {

  const [city, setCity] = useState('');
  const [clima, setClima] = useState(0);
  const [icon, setIcon] = useState('');
  const [nameCity, setNameCity] = useState('');
  const [stateCity, setStateCity] = useState('');
  const [umidade, setUmidade] = useState(0);
  const [sensacao, setSensacao] = useState(0);
  const [condicao, setCondicao] = useState('');
  const [precipitacao, setPrecipitacao] = useState(0);
  const [ventos, setVentos] = useState(0);

  const [control, setControl] = useState(false);

  const [controlError, setControlError] = useState(false);
  const [erro, setErro] = useState('');

  const [loading, setLoading] = useState(false);

  async function handleClima() {
    setControl(false);
    setControlError(false);
    setLoading(true);

    if (!city) {
      setControlError(true);
      setErro("Preencha o campo corretamente.");
      setLoading(false);
    } else {
      const req = await api.get(Link + city)
        .then(response => {

          //transform the temperature in Kelvin to Celsius and get lat and long
          let element = {
            atual: Number(response.data.current.temp_c),
            icon: response.data.current.condition.icon,
            name: response.data.location.name,
            state: response.data.location.region,
            umidade: Number(response.data.current.humidity),
            sensacao: Number(response.data.current.feelslike_c),
            condicao: response.data.current.condition.text,
            precipitacao: Number(Math.round(response.data.current.precip_mm) * 100),
            ventos: Number(response.data.current.wind_kph),
          }

          setClima(element.atual);
          setIcon(element.icon);
          setNameCity(element.name);
          setStateCity(element.state);
          setUmidade(element.umidade);
          setSensacao(element.sensacao);
          setCondicao(element.condicao);
          setPrecipitacao(element.precipitacao);
          setVentos(element.ventos);

          setControl(true);
          setLoading(false);
        })
        .catch(error => {
          setControlError(true);
          setErro("Cidade não encontrada");
          setLoading(false);

          console.log(error);
          return error;
        })
    }
  }

  return (
    <main>
      <img src={Logo2} alt="Logo TIMEiZ." />
      <h2>Consulte o clima da sua cidade</h2>
      <div className="form">
        <input
          type="text"
          placeholder="(ex.: cidade, estado)..."
          value={city}
          onChange={city => setCity(city.target.value)}
          onKeyPress={
            event => {
              if (event.key === 'Enter') {
                handleClima();
              }
            }
          }
        />
        <button onClick={handleClima} aria-label="Buscar..."><FaSearch /></button>
      </div>

      {controlError &&
        <Error error={erro} />
      }

      {control &&
        <div className="result">
          <div className="atual">
            <img src={icon} alt="Nuvem" />
            <h2>{nameCity}, {stateCity}</h2>
            <h3>{clima} °C</h3>
          </div>
          <div className="informs">
            <p><FaCloud /> {condicao}</p>
            <p><FaThermometerFull /> Sensação térmica de {sensacao}° C</p>
            <p><FaInfo /> Umidade do ar: {umidade}%</p>
            <p><FaWater /> Precipitação: {precipitacao}%</p>
            <p><FaWind /> Ventos a {ventos}km/h</p>
          </div>
          <div className="otherinforms">
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
        <p>
          <a href="https://www.linkedin.com/in/mjrsf/" target="_blank" rel="noreferrer"><FaLinkedinIn /></a>
          <a href="https://www.instagram.com/junin.freire/" target="_blank" rel="noreferrer"><FaInstagram /></a>
        </p>
      </footer>
    </main>
  );
}