// src/page/MainPage.jsx
import React, { useState } from "react";
import styled from "styled-components";
import Header from "../component/Header";
import WeatherBackground from "../component/WeatherBackground";
import WeatherPanel from "../component/WeatherPanel";
import useJungguWeather from "../hook/useJungguWeather";
import LeaderBoard from "../component/LeaderBoard";
import MainPageCalendar from "../component/MainPageCalendar";
import CalendarModal from "../component/CalendarModal";
import FortuneWidget from "../component/FortuneWidget";



const Page = styled.div`
  position: fixed;
  inset: 0;            /* top/right/bottom/left: 0 */
  height: 100dvh;      
  overflow: hidden;    /* 전체 스크롤 차단 */
`;

const Layout = styled.main`
  position: relative;
  z-index: 1;
  display: flex;
  gap: 24px;
  padding: 24px clamp(16px, 3vw, 48px);
  height: calc(100vh - 100px); /* 헤더 높이 대략값, 필요 시 조정 */
`;

const Left = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;   /* 좌우 꽉 채우기 */
  gap: 16px;              /* 날씨와 리더보드 사이 간격 */
  justify-content: flex-end;
`;

const Right = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;   /* 좌우 꽉 채우기 */
  gap: 16px;              /* 날씨와 리더보드 사이 간격 */
  justify-content: flex-start;
`;

const SmallCard = styled.section`
  backdrop-filter: blur(10px);
  background: rgba(255,255,255,0.28);
  border: 1px solid rgba(255,255,255,0.22);
  border-radius: 18px;
  padding: 16px 18px;
  box-shadow: 0 10px 28px rgba(0,0,0,0.12);
`;

export default function MainPage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const { weather, loading, error } = useJungguWeather();

  const isDay = weather?.isDay;
  const condition = weather?.condition;

  const [selectedDate, setSelectedDate] = useState(null);
  const [open, setOpen] = useState(false);




  function handleSelectDate(dateISO) {
    setSelectedDate(dateISO);
    setOpen(true);
  }




  return (
    <Page>
      <Header />

      {/* 배경 비디오 */}
      <div style={{ position: "absolute", inset: 0, zIndex: -1 }}>
        <WeatherBackground isDay={isDay} condition={condition} />
      </div>

      <Layout>
        {/* 좌측: 위/아래로 분할, 아래는 LeaderBoard */}
        <Left>
          
            {!loading && !error && weather && (
              <WeatherPanel
                temp={Math.round(weather.temp)}
                desc={weather.description}
                humidity={weather.humidity}
              />
            )}
          

          {/* 좌측 하단: 리더보드 */}
          <LeaderBoard />
        </Left>

        {/* 우측: 일단 비워둠 (추후 운세/캘린더) */}
        <Right>

          <FortuneWidget />
          <MainPageCalendar 
          onSelectDate={handleSelectDate} 
          selectedDate={selectedDate}
          />
          <CalendarModal
            open={open}
            selectedDate={selectedDate}
            onClose={() => setOpen(false)}
          />

          
        </Right>
      </Layout>
    </Page>
);
}

