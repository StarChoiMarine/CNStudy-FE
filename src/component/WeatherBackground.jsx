// src/components/WeatherBackground.jsx
import React, { useMemo } from "react";
import styled from "styled-components";
import clearDay     from "../styles/videos/clear-day.mp4";
import clearNight   from "../styles/videos/clear-night.mp4";
import cloudsDay    from "../styles/videos/clouds-day.mp4";
import cloudsNight  from "../styles/videos/clouds-night.mp4";
import rainyDay     from "../styles/videos/rainy-day.mp4";
import rainyNight   from "../styles/videos/rainy-night.mp4";
import snowyDay     from "../styles/videos/snowy-day.mp4";
import snowyNight   from "../styles/videos/snowy-night.mp4";


const Wrap = styled.div`
  width: 100%;
  overflow: hidden;
  position: relative;
  z-index: -1;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.09);
  }
`;
const Video = styled.video`
  width: 100%; height: 100%; object-fit: cover;
  object-position: center top;
  filter: saturate(1.05) contrast(1.02);
`;

// condition: 'clear' | 'clouds' | 'rain' | 'snow' |

function pickVideoSrc(isDay, condition = "clear") {
  const c = condition.toLowerCase();
  if (c.includes("rain") || c.includes("drizzle")) return isDay ? rainyDay   : rainyNight;
  if (c.includes("snow"))                          return isDay ? snowyDay   : snowyNight;
  if (c.includes("cloud"))                         return isDay ? cloudsDay : cloudsNight;
  return isDay ? clearDay : clearNight ;
}

export default function WeatherBackground({ isDay, condition }) {
  const src = useMemo(() => pickVideoSrc(isDay, condition), [isDay, condition]);
  return (
    <Wrap>
      <Video autoPlay muted loop playsInline src={src} />
    </Wrap>
  );
}
