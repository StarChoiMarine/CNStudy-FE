// src/page/MainPage.jsx
import React from "react";
import styled from "styled-components";
import Header from "../component/Header";
import useWeather from "../hook/useJungguWeather";
import WeatherBackground from "../component/WeatherBackground";
import WeatherPanel from "../component/WeatherPanel";





// 중앙 컨테이너 스타일
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 60px); /* 헤더 높이 제외 */
  position: relative;
  z-index: 1;
`;

const Greeting = styled.div`
  margin-bottom: 20px;
  font-size: 22px;
  font-weight: bold;
  text-align: center;
`;

const MainPage = () => {
  // 로그인한 유저 정보
  const user = JSON.parse(localStorage.getItem("user"));

  // 날씨 데이터 훅
  const { weather, loading, error } = useWeather();

  if (loading) return <div>날씨 정보를 불러오는 중...</div>;
  if (error) return <div>날씨 정보를 불러올 수 없습니다 😢</div>;

  return (
    <>
      <Header />

      {/* 날씨 배경 */}
      {weather && (
        <WeatherBackground
          isDay={weather.isDay}
          condition={weather.condition}
        />
      )}

      <Container>
        {/* 사용자 환영 인사 */}
        {user ? (
          <Greeting>
            {user.name}님 안녕하세요! 😊 <br />
            오늘의 운세는 <strong>"모든 게 잘 풀릴 겁니다~"</strong>
          </Greeting>
        ) : (
          <Greeting>로그인 정보가 없습니다. 다시 로그인해주세요.</Greeting>
        )}

        {/* 날씨 패널 */}
        {weather && (
          <WeatherPanel
            temp={weather.temp}
            desc={weather.description}
            humidity={weather.humidity}
          />
        )}
      </Container>
    </>
  );
};

export default MainPage;
