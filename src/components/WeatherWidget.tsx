'use client';

import React, { useEffect, useState } from 'react';
import { 
  Sun, 
  Cloud, 
  CloudSun, 
  CloudRain, 
  CloudDrizzle, 
  CloudLightning, 
  Snowflake, 
  Wind, 
  Droplet, 
  Thermometer 
} from 'lucide-react';

interface WeatherData {
  temp: number;
  condition: string;
  windSpeed: number;
  pressure: number;
  humidity: number;
  icon: React.ReactNode;
}

export default function WeatherWidget() {
  const [time, setTime] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      
      const datePart = `${now.getMonth() + 1}-${now.getDate()}-${now.getFullYear()}`;
      const timePart = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
      setTime(`${datePart}  |  ${timePart}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=28.6139&longitude=77.2090&current=temperature_2m,relative_humidity_2m,weather_code,pressure_msl,wind_speed_10m'
        );
        const data = await res.json();
        
        if (data && data.current) {
          const current = data.current;
          const temp = Math.round(current.temperature_2m);
          const humidity = current.relative_humidity_2m;
          const windSpeed = Math.round(current.wind_speed_10m * 10) / 10;
          const pressure = Math.round(current.pressure_msl);
          const code = current.weather_code;

          
          let condition = 'Sunny';
          let icon = <Sun size={40} className="text-yellow-400" />;

          if (code === 0) {
            condition = 'Clear sky';
            icon = <Sun size={40} className="text-yellow-400" />;
          } else if ([1, 2, 3].includes(code)) {
            condition = 'Partly cloudy';
            icon = <CloudSun size={40} className="text-zinc-300" />;
          } else if ([45, 48].includes(code)) {
            condition = 'Foggy';
            icon = <Cloud size={40} className="text-zinc-400" />;
          } else if ([51, 53, 55].includes(code)) {
            condition = 'Light drizzle';
            icon = <CloudDrizzle size={40} className="text-sky-300" />;
          } else if ([61, 63, 65, 80, 81, 82].includes(code)) {
            condition = 'Rainy';
            icon = <CloudRain size={40} className="text-sky-400" />;
          } else if ([71, 75].includes(code)) {
            condition = 'Snowy';
            icon = <Snowflake size={40} className="text-blue-200" />;
          } else if ([95, 96, 99].includes(code)) {
            condition = 'Heavy rain';
            icon = <CloudLightning size={40} className="text-violet-400" />;
          }

          setWeather({ temp, condition, windSpeed, pressure, humidity, icon });
        }
      } catch (err) {
        console.error('Failed fetching weather data:', err);
        
        setWeather({
          temp: 24,
          condition: 'Heavy rain',
          windSpeed: 3.7,
          pressure: 1010,
          humidity: 83,
          icon: <CloudLightning size={40} className="text-violet-400" />,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  return (
    <div className="glass-card rounded-[28px] overflow-hidden shadow-2xl flex flex-col h-full border border-white/5">
      {}
      <div className="bg-gradient-to-r from-pink-500 via-[#FF4ADE] to-indigo-600 text-white font-bold py-2.5 px-6 text-center text-sm md:text-base tracking-widest select-none shrink-0 shadow-inner">
        {time || 'Syncing clock...'}
      </div>

      {}
      <div className="flex-1 p-6 flex items-center justify-around text-white">
        {loading || !weather ? (
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-green"></div>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Syncing Climate...</span>
          </div>
        ) : (
          <div className="w-full grid grid-cols-3 items-center divide-x divide-white/10 select-none">
            {}
            <div className="flex flex-col items-center justify-center space-y-1.5 px-1">
              <div className="filter drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]">
                {weather.icon}
              </div>
              <span className="text-xs font-bold text-zinc-300 tracking-wide text-center uppercase truncate w-full">
                {weather.condition}
              </span>
            </div>

            {}
            <div className="flex flex-col items-center justify-center px-2 space-y-2">
              <span className="text-4xl font-black tracking-tight text-white">
                {weather.temp}°C
              </span>
              <div className="flex items-center space-x-1 text-zinc-400 font-semibold text-[10px] uppercase">
                <Thermometer size={14} className="shrink-0 text-brand-green" />
                <span className="leading-tight">
                  {weather.pressure} mbar <br />
                  <span className="text-zinc-500">Pressure</span>
                </span>
              </div>
            </div>

            {}
            <div className="flex flex-col justify-center px-4 space-y-2.5">
              <div className="flex items-center space-x-2 text-zinc-300 font-semibold text-[10px] uppercase">
                <Wind size={15} className="shrink-0 text-sky-300" />
                <span className="leading-tight">
                  {weather.windSpeed} km/h <br />
                  <span className="text-zinc-500">Wind</span>
                </span>
              </div>
              <div className="flex items-center space-x-2 text-zinc-300 font-semibold text-[10px] uppercase">
                <Droplet size={15} className="shrink-0 text-blue-300" />
                <span className="leading-tight">
                  {weather.humidity}% <br />
                  <span className="text-zinc-500">Humidity</span>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
