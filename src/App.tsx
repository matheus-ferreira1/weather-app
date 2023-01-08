import React, { useState, useEffect, FC, FormEvent, ChangeEvent } from "react";

import axios, { AxiosError } from "axios";

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
  const [inputValue, setInputValue] = useState("");
  const [animate, setAnimate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<any>("");

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();

    if (inputValue !== "") {
      setLocation(inputValue);
      setInputValue("");
    }

    if (inputValue === "") {
      setAnimate(true);

      setTimeout(() => {
        setAnimate(false);
      }, 500);
    }
  };

  useEffect(() => {
    const fetchWeather = async (): Promise<void> => {
      const endpoint = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${api.key}`;

      try {
        setLoading(true);
        const response = await axios.get<WeatherData>(endpoint);
        setData(response.data);
      } catch (error: any) {
        setErrorMsg(error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [location]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMsg("");
    }, 2000);

    return (): void => {
      clearTimeout(timer);
    };
  }, [errorMsg]);

  if (!data) {
    return (
      <div className="w-full h-screen bg-gradientBg bg-no-repeat bg-cover bg-center flex flex-col items-center justify-center">
        <div>
          <ImSpinner8 className="text-white text-5xl animate-spin" />
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
      icon = <IoMdRainy className="text-[#31cafb]" />;
      break;
    case "Clear":
      icon = <IoMdSunny className="text-[#ffde33]" />;
      break;
    case "Drizzle":
      icon = <BsCloudDrizzleFill className="text-[#31cafb]" />;
      break;
    case "Snow":
      icon = <IoMdSnow className="text-[#31cafb]" />;
      break;
    case "Thunderstorm":
      icon = <IoMdThunderstorm />;
      break;

    default:
      break;
  }

  const date = new Date();

  return (
    <div className="w-full h-screen bg-gradient-to-tr from-[#77CCEB] via-[#4b298e] to-[#6f6fe2] flex flex-col items-center justify-center px-4 lg:px-0">
      {errorMsg && (
        <div className="w-full max-w-[90vw] lg:max-w-[450px] bg-[#ff208c] text-white absolute top-2 lg:top-10 p-4 capitalize rounded-md z-10">{`${errorMsg.response?.data.message}`}</div>
      )}
      {/* form  */}
      <form
        className={`${
          animate ? "animate-shake" : "animate-none"
        } h-16 bg-black/30 w-full max-w-[450px] rounded-full backdrop-blur-[32px] mb-8`}
      >
        <div className="h-full relative flex items-center justify-between p-2">
          <input
            onChange={(e: ChangeEvent<HTMLInputElement>): void => {
              setInputValue(e.target.value);
            }}
            value={inputValue}
            className="flex-1 bg-transparent outline-none placeholder:text-gray-300 text-white text-[16px] font-light pl-6 h-full"
            type="text"
            placeholder="Search by city or country"
          />
          <button
            onClick={(e) => handleSubmit(e)}
            className="bg-[#1ab8ed] hover:bg-[#15abdd] w-20 h-12 rounded-full flex justify-center items-center transition duration-200 "
          >
            <IoMdSearch className="text-2xl text-white" />
          </button>
        </div>
      </form>
      {/* card  */}
      <div className="w-full max-w-[450px] bg-black/20 min-h-[584px] text-white backdrop-blur-[32px] rounded-xl py-12 px-6">
        {loading ? (
          <div className="w-full h-full flex justify-center items-center">
            <ImSpinner8 className="text-white text-5xl animate-spin" />
          </div>
        ) : (
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
        )}
      </div>
      <footer className="py-8 text-gray-400 text-lg">
        <h3 className="text-center">
          Developed by Matheus Ferreira - &copy; 2023
        </h3>
      </footer>
    </div>
  );
};
