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
    main: {
        temp: number;
    };
    weather: [
        {
            description: string;
            id: number;
            main: string;
        }
    ];
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
            const endpoint = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${api.key}`;

            try {
                const response = await axios.get<WeatherData>(endpoint);
                setData(response.data);
                console.log(data);
            } catch (e) {
                console.error(e);
            }
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

    return <div className="text-6xl">{icon}</div>;
};
