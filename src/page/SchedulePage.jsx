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
  max-width: 1400px;
  margin: 0 auto;
  padding: clamp(12px, 2vw, 24px);
  box-sizing: border-box;
`;

const Grid = styled.div`
  display: grid;
  gap: clamp(16px, 2.5vw, 32px);
  align-items: start;

  grid-template-columns: minmax(520px, 3fr) minmax(320px, 2fr);

  /* 좁아지면: 1열로 강제 전환 → 겹침 방지 */
  @media (max-width: 1370px) {
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
  padding-right: clamp(12px, 2vw, 40px); 

  @media (max-width: 1370px) {
    align-items: stretch;
    padding-right: 0;
  }
`;

const Title = styled.h2`
  text-align: right;
  font-size: clamp(1.25rem, 2vw, 2rem);
  margin:  12px 8px 4px;
  line-height: 1.1;
  @media (max-width: 1370px) {
    text-align: left;
    margin: 16px 0 8px;
  }
`;

const DetailsImg1 = styled.div`
  position: relative;
  width: 100%;
  max-width: 300px;
  aspect-ratio: 4 / 3;
  background: url(${ScheduleDetailsImg}) center / contain no-repeat;
  border-radius: 12px;

  @media (max-width: 1370px) {
    max-width: 300px;
    aspect-ratio: 3 / 2;
  }
`;

const DetailsImg2 = styled(DetailsImg1)`
  background-image: url(${TodoListImg});
`;

const DetailsContent = styled.div`
  position: absolute;
  inset: 13% 8% 12% 8%;
  overflow: auto;
  display: grid;
  gap: 0.6rem;
  font-size: clamp(14px, 1vw, 18px);
  line-height: 1.4;
  color: #111;
  font-weight: 700;

  
  & ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
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
                                    paddingLeft: 5,
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