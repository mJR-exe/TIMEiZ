import React, { useState } from 'react';

import './styles.scss';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

import Cloud from '../../assets/cloud.png';
import Logo2 from '../../assets/logo-2.png';
import Logo1 from '../../assets/logo.png';
import { FaSearch } from 'react-icons/fa';

import Prefix from '../../contexts/api';
import api from '../../contexts/baseUrl';

import Error from '../../components/error';

export default function Main() {

  const [city, setCity] = useState('');
  const [clima, setClima] = useState(0);
  const [icon, setIcon] = useState('');
  const [nameCity, setNameCity] = useState('');
  const [stateCity, setStateCity] = useState('');
  const [umidade, setUmidade] = useState(0);
  const [sensacao, setSensacao] = useState(0);

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
      const req = await api.get(Prefix + '&q=' +city)
        .then(response => {
          
          //transform the temperature in Kelvin to Celsius and get lat and long
          let element = {
            atual: Number(response.data.current.temp_c),
            icon: response.data.current.condition.icon,
            name: response.data.location.name,
            state: response.data.location.region,
            umidade: Number(response.data.current.humidity),
            sensacao: Number(response.data.current.feelslike_c),
          }

          setClima(element.atual);
          setIcon(element.icon);
          setNameCity(element.name);
          setStateCity(element.state);
          setUmidade(element.umidade);
          setSensacao(element.sensacao);

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
      <h2>Digite o nome da sua cidade...</h2>
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
            <img src={icon} alt="Nuvem" />
            <h2>{nameCity}, {stateCity}</h2>
            <h3>{clima} °C</h3>
          </div>
          <div className="minmax">
            <p>Sensação térmica de {sensacao}° C</p>
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
      <img src={Logo1} alt="Logo TIMEiZ." />
      <p><a href="https://www.linkedin.com/in/mjrsf/" target="_blank" rel="external">Made by Jr.</a></p>
      </footer>
    </main>
  );
}