// src/components/WeatherPanel.jsx
import React from "react";
import styled from "styled-components";

const Card = styled.div`
  backdrop-filter: blur(10px);
  background: rgba(255,255,255,.88);
  border-radius: 16px; padding: 18px; width: 320px;
  box-shadow: 0 6px 24px rgba(0,0,0,.06);
`;
const City = styled.div`color:#777; font-weight:800;`;
const Temp = styled.div`font-size:64px; font-weight:800; line-height:1; margin:6px 0 8px;`;
const Line = styled.div`font-weight:600; margin-bottom:6px;`;
const Sub  = styled.div`color:#666; font-size:14px;`;

export default function WeatherPanel({ city="서울특별시 중구", temp, desc, humidity }) {
  return (
    <Card>
      <City>{city}</City>
      <Temp>{Math.round(temp)}°</Temp>
      <Line>{desc}</Line>
      <Sub>습도 {humidity}%</Sub>
    </Card>
  );
}
