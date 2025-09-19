import React from "react";
import { useState } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { schedules, toISODate } from "../data/schedules";

export default function ScheduleCalendar ({onSelectDate, selectedDate}) {

    const [currentDate, setCurrentDate] = useState (new Date());
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1); 
    const startDay = new Date(firstDayOfMonth);
    startDay.setDate(1 - firstDayOfMonth.getDay());

    const lastDayOfMonth = new Date(year, month+1, 0);
    const endDay = new Date(lastDayOfMonth);
    endDay.setDate(lastDayOfMonth.getDate() + (6-lastDayOfMonth.getDay()));

    const groupDatesByWeek = (startDay, endDay) => {
        if (!(startDay instanceof Date) || !(endDay instanceof Date)) {
            throw new Error ("startDay와 endDay는 Date 객체여야 함");
        }
        
        const weeks = [];
        let currentWeek = [];
        const currentDate = new Date(startDay);

        while(currentDate <= endDay) {
            currentWeek.push(new Date(currentDate));
            if(currentWeek.length === 7 || currentDate.getDay() === 6) {
                weeks.push(currentWeek);
                currentWeek = [];
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        if (currentWeek.length > 0) {
            weeks.push(currentWeek);
        }
        return weeks;
    };

    const weeks = groupDatesByWeek(startDay, endDay);

    const handlePrevMonth = () => {
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
        );
    };
    const handleNextMonth = () => {
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
        );
    };



    return (
        <div style={{ padding: "clamp(4px, 1.5vw, 8px)" }}>
        <h1 style={{ fontSize: "clamp(15px, 3.5vw, 30px)", lineHeight: 1.1, margin: 0 }}>
        Class Schedule
        </h1>

        <div
        style={{
            display: "flex",
            alignItems: "center",
            gap: "clamp(6px, 1.5vw, 12px)",
            marginTop: "clamp(6px, 1vw, 10px)",
            marginBottom: "clamp(6px, 1.5vw, 14px)",
        }}
        >
        <button
            onClick={handlePrevMonth}
            style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 4,
            lineHeight: 0,
            }}
            aria-label="이전 달"
        >
            <IoChevronBack size={20} />
        </button>

        <h2
            style={{
            textAlign: "left",
            fontSize: "clamp(10px, 3vw, 20px)",
            lineHeight: 1.1,
            margin: 0,
            flex: "0 1 auto",
            }}
        >
            {year}년 {month + 1}월
        </h2>

        <button
            onClick={handleNextMonth}
            style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 4,
            lineHeight: 0,
            }}
            aria-label="다음 달"
        >
            <IoChevronForward size={20} />
        </button>
        </div>

        <div
        style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, minmax(140px, 1fr))",
            textAlign: "center",
            fontWeight: "normal",
            fontSize: "clamp(6px, 3vw, 15px)",
            userSelect: "none",
            
        }}
        >
        <div>SUN</div>
        <div>MON</div>
        <div>TUE</div>
        <div>WED</div>
        <div>THU</div>
        <div>FRI</div>
        <div>SAT</div>
        </div>

        <div
        style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, minmax(140px, 1fr))",
            borderLeft: "1px solid #e6e6e6",
            marginTop: 10,
        }}
        >
        {weeks.flat().map((date, idx) => {
            const key = toISODate(date);
            const isCurrentMonth = date.getMonth() === month;
            const today = new Date();
            const isToday = 
                date.getDate() === today.getDate() &&
                date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear();

            const items = schedules[key] ?? [];
            const preview = items.slice(0, 2);

            return (
            <div
                key={idx}
                onClick={() => onSelectDate?.(key)}
                style={{
                minHeight: "clamp(80px, 5vw, 120px)",
                padding: "clamp(1px, 0.5vw, 4px)",
                textAlign: "center",
                backgroundColor: isCurrentMonth ? "#fff" : "#fafafa",
                borderRight: "1px solid #e6e6e6",
                borderBottom: "1px solid #e6e6e6",
                boxSizing: "border-box"
                }}
            >
                <div
                    style={{
                        fontWeight: 600,
                        marginBottom: "clamp(4px, 0.8vw, 10px)",
                        margin: "0 auto",
                        fontSize: "clamp(10px, 1.2vw, 12px)",
                        width: "clamp(16px, 2vw, 20px)",
                        height: "clamp(16px, 2vw, 20px)",
                        lineHeight: "clamp(16px, 2vw, 20px)",
                        borderRadius: "50%",
                        backgroundColor: isToday ? "#ffa090" : "transparent",
                        color: isToday ? "#fff" : "#000",
                    }}
                >
                    {date.getDate()}
                </div>

                <div
                    style={{
                    marginTop: 8,
                    display: "grid",
                    gap: 6,
                    textAlign: "left",
                    maxHeight: "calc(100% - 22px)", 
                    overflow: "hidden",
                    }}
                >
                    {preview.map((ev) => (
                        <div
                            key={ev.id}
                            style={{
                            fontSize: "clamp(8px, 1vw, 10px)",
                            fontWeight: "bold",
                            padding: "0 clamp(2px, 0.5vw, 4px)",
                            background: "#ffbc864a",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            }}
                        >
                    {ev.title}
                        </div>
                    ))}
                </div>
            </div>
            );
        })}
        </div>
    </div>
    );


};