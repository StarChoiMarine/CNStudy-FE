import { useEffect} from "react";
import styled from "styled-components";
import { schedules } from "../data/schedules"
import calendarModal from "../styles/images/calendarModal.png"
import  orangeEclipse  from "../styles/images/orangeEllipse.png"
import TodoList from "./TodoList";

const List = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 10px;
`;

const ListItem = styled.li`
    display: grid;
    grid-template-columns: 14px 1fr;
    align-items: start;
    gap: 8px;
`;

const TodoBox = styled.ul`
    min-height: 0;    
    overflow: auto;   
    padding-top: 240px;
    margin: 0;
    padding-left: 10px;   
    list-style: none;  
`;

const Dot = styled.i`
  width: 10px;
  height: 10px;
  background-size: cover;
  background-repeat: no-repeat;
  display: inline-block;
  margin-top: 6px; 
`;

const Empty = styled.div`
  opacity: 0.7;
`;

const Backdrop = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,.35);
  display: grid;
  place-items: center;
  padding: 16px;
 
`;

const Panel = styled.div`
  width: 500px;
  height: 500px;
  max-width: 100%;
  border-radius: 16px;
  padding: 16px;
  background: url(${calendarModal}) center / contain no-repeat;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
`;

const CloseBtn = styled.button`
  appearance: none;
  background: transparent;
  border: 0;
  font-size: 18px;
  cursor: pointer;
  line-height: 1;
  margin-left: 450px;
`;

export default function CalendarModal({ open, selectedDate, onClose }) {
  const items = selectedDate ? schedules[selectedDate] ?? [] : [];

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null; 

  return (
    <Backdrop onMouseDown={onClose} role="dialog" aria-modal="true" aria-labelledby="schedule-title">
      <Panel onMouseDown={(e) => e.stopPropagation()}>
        <Header>
          <CloseBtn onClick={onClose} aria-label="닫기">✕</CloseBtn>
        </Header>
        {items.length ? (
          <List>
            {items.map((ev, idx) => (
              <ListItem key={ev.id ?? `${ev.title}-${idx}`}>
                <Dot style={{ backgroundImage: `url(${orangeEclipse})` }} />
                <span>{ev.title}</span>
              </ListItem>
            ))}
          </List>
        ) : (
          <Empty>일정이 없습니다.</Empty>
        )}
        <TodoBox>
        <TodoList compact mode="all" dateISO={selectedDate}/>
        </TodoBox>
      </Panel>
    </Backdrop>
  );
}
