// src/hooks/useWeather.js
import { useEffect, useState } from "react";

export default function useWeather() {
  const apiKey = process.env.REACT_APP_OPENAPI_KEY; 
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 서울 중구 좌표 고정
  const lat = 37.5636;
  const lon = 126.9978;


  //날씨 API 호출
  const getWeather = async () => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=kr`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("API 요청 실패");
      const data = await response.json();
      //console.log("[debug] >>> API raw data:", data);  // 원본 응답 전체 확인
      setWeather({
        temp: Math.round(data.main.temp),       // 온도
        humidity: data.main.humidity,           // 습도
        description: data.weather[0].description, // 날씨 설명
        condition: data.weather[0].main.toLowerCase(), // 배경 분기용
      });
    } catch (err) {
      setError("날씨 정보를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWeather();
  }, []);

  return { weather, loading, error };
}
