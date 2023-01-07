import React, { useState, useEffect, FC } from "react";

import axios from "axios";

// prettier-ignore
import { IoMdSunny, IoMdRainy, IoMdCloudy,IoMdSnow,IoMdThunderstorm,IoMdSearch } from "react-icons/io";

// prettier-ignore
import { BsCloudHaze2Fill, BsCloudDrizzleFill, BsEye, BsWater, BsThermometer, BsWind } from "react-icons/bs";

// prettier-ignore
import { TbTemperatureCelsius } from "react-icons/tb";

// prettier-ignore
import { ImSpinner8 } from "react-icons/im";

interface WeatherData {
  name: string;
  sys: {
    country: string;
  };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: [
    {
      description: string;
      id: number;
      main: string;
    }
  ];
  visibility: number;
  wind: {
    speed: number;
  };
}

export const App: FC = () => {
  const api = {
    base: import.meta.env.VITE_API_BASE,
    key: import.meta.env.VITE_API_KEY,
  };

  const [data, setData] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState("london");

  useEffect(() => {
    const fetchWeather = async (): Promise<void> => {
      const endpoint = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${api.key}`;

      try {
        const response = await axios.get<WeatherData>(endpoint);
        setData(response.data);
      } catch (e) {
        console.error(e);
      }
      console.log(data);
    };

    fetchWeather();
  }, [location]);

  if (!data) {
    return (
      <div>
        <div>
          <ImSpinner8 className="text-5xl animate-spin" />
        </div>
      </div>
    );
  }

  let icon;

  switch (data.weather[0].main) {
    case "Clouds":
      icon = <IoMdCloudy />;
      break;
    case "Haze":
      icon = <BsCloudHaze2Fill />;
      break;
    case "Rain":
      icon = <IoMdRainy />;
      break;
    case "Clear":
      icon = <IoMdSunny />;
      break;
    case "Drizzle":
      icon = <BsCloudDrizzleFill />;
      break;
    case "Snow":
      icon = <IoMdSnow />;
      break;
    case "Thunderstorm":
      icon = <IoMdThunderstorm />;
      break;

    default:
      break;
  }

  const date = new Date();

  return (
    <div className="w-full h-screen bg-gradientBg bg-no-repeat bg-cover bg-center flex flex-col items-center justify-center px-4 lg:px-0">
      {/* form  */}
      <form>form</form>
      {/* card  */}
      <div className="w-full max-w-[450px] bg-black/20 min-h-[584px] text-white backdrop-blur-[32px] rounded-xl py-12 px-6">
        <div>
          {/* card top  */}
          <div className="flex items-center gap-x-5">
            {/* icon  */}
            <div className="text-[87px]">{icon}</div>
            <div>
              {/* name of the country  */}
              <div className="text-2xl font-semibold">
                {data.name}, {data.sys.country}
              </div>
              {/* date  */}
              <div>
                {date.getUTCDate()}/{date.getUTCMonth() + 1}/
                {date.getUTCFullYear()}
              </div>
            </div>
          </div>
          {/* card body  */}
          <div className="my-20">
            <div className="flex justify-center items-center">
              {/* temp  */}
              <div className="text-[144px] leading-none font-light">
                {Math.round(data.main.temp)}
              </div>
              {/* temp icon  */}
              <div className="text-4xl">
                <TbTemperatureCelsius />
              </div>
            </div>
            {/* weather description     */}
            <div className="capitalize text-center">
              {data.weather[0].description}
            </div>
          </div>
          {/* card footer  */}
          <div className="max-w-[378px] mx-auto flex flex-col gap-y-6">
            <div className="flex justify-between">
              <div className="flex items-center gap-x-2">
                {/* icon  */}
                <div className="text-[20px]">
                  <BsEye />
                </div>
                <div>
                  Visibility <span>{data.visibility / 1000}</span> km
                </div>
              </div>
              <div className="flex items-center gap-x-2">
                {/* icon  */}
                <div className="text-[20px]">
                  <BsThermometer />
                </div>
                <div className="flex gap-x-1">
                  Feels like{"  "}
                  <div className="flex items-center">
                    {Math.round(data.main.feels_like)}{" "}
                    <TbTemperatureCelsius size={20} />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex items-center gap-x-2">
                {/* icon  */}
                <div className="text-[20px]">
                  <BsWater />
                </div>
                <div>
                  Humidity <span>{data.main.humidity}</span> %
                </div>
              </div>
              <div className="flex items-center gap-x-2">
                {/* icon  */}
                <div className="text-[20px]">
                  <BsWind />
                </div>
                <div className="flex gap-x-1">
                  Wind <span>{data.wind.speed} m/s</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
