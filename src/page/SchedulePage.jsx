// SchedulePage.jsx
import { useState } from "react";
import styled from "styled-components";
import Header from "../component/Header";
import ScheduleCalendar from "./ScheduleCalendar";
import ScheduleDetailsImg from "../styles/images/ScheduleDetailsImg.png";
import TodoListImg from "../styles/images/TodoListImg.png";
import { schedules } from "../data/schedules"
import  Eclipse  from "../styles/images/Ellipse.png"


const Wrapper = styled.div`
  width: 100%;
  padding: clamp(12px, 2vw, 24px);
  box-sizing: border-box;
`;

const Grid = styled.div`
  display: grid;
  gap: clamp(16px, 2.5vw, 32px);
  align-items: start;

  grid-template-columns: minmax(360px, 2fr) minmax(280px, 1fr);

  /* 좁아지면: 1열로 강제 전환 → 겹침 방지 */
  @media (max-width: 1665px) {
    grid-template-columns: 1fr;
  }
`;

const CalendarCol = styled.div`
  min-width: 0; 
`;

const Details = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-right: clamp(32px, 6vw, 120px); 

  @media (max-width: 1000px) {
    align-items: stretch;
    padding-right: clamp(20px, 5vw, 80px);
  }
`;

const Title = styled.h2`
  text-align: right;
  font-size: clamp(35px, 4vw, 50px);
  margin: 100px 0 5px;
  margin-right: 20px;
  line-height: 1.1;
`;

const DetailsImg1 = styled.div`
  position: relative;
  width: 100%;
  max-width: 820px;
  aspect-ratio: 1 / 1;
  background: url(${ScheduleDetailsImg}) center / contain no-repeat;
  border-radius: 12px;

  @media (max-width: 1665px) {
    max-width: none;
    aspect-ratio: 3 / 2;
  }
`;

const DetailsImg2 = styled.div`
  position: relative;
  width: 100%;
  max-width: 820px;
  aspect-ratio: 1 / 1;
  background: url(${TodoListImg}) center / contain no-repeat;
  border-radius: 12px;

  @media (max-width: 1665px) {
    max-width: none;
    aspect-ratio: 3 / 2;
  }
`;

const DetailsContent = styled.li`
  position: absolute;                 
  inset: 13% 8% 12% 8%;                
  overflow: auto;
  display: grid;
  gap: 10px;
  font-size: clamp(30px, 1.2vw, 40px);
  line-height: 3.75;
  color: #111;
  font-weight: bold;
`;

const Card = styled.li`
  list-style: none;
  padding: 12px;
  border-radius: 12px;
  
`;

export default function SchedulePage() {
    const [selectedDate, setSelectedDate] = useState(null);

    const items = selectedDate ? schedules[selectedDate] ?? [] : [];
  return (
    <div>
      <Header />
      <Wrapper>
        <Grid>
          <CalendarCol>
            <ScheduleCalendar onSelectDate={setSelectedDate}
                            selectedDate={selectedDate}/>
          </CalendarCol>
          
          <Details>
            <Title>Schedule Details</Title>
            <DetailsImg1>
                <DetailsContent>
                    {selectedDate ? (
                        items.length ? (
                        <ul style={{ listStylePosition: "inside", padding: 0, margin: 0 }}>
                            {items.map(ev => (
                            <li key={ev.id}
                                style={{
                                    listStyleType: "disc",
                                    listStyleImage: `url(${Eclipse})`,
                                    paddingLeft: "0.2rem",
                                }}>{ev.title}</li>   
                            ))}
                        </ul>
                        ) : (
                        <div style={{ opacity: 0.7 }}> 일정이 없습니다.</div>
                        )
                    ) : (
                        <div style={{ opacity: 0.7 }}>날짜를 선택해 주세요.</div>
                    )}
                </DetailsContent>
            </DetailsImg1>

            <Title>Todo List</Title>
            <DetailsImg2 />
          </Details>
        </Grid>
      </Wrapper>
    </div>
  );
}