export const schedules = {
  "2025-09-12": [
    { id: "a1", title: "1차 사후평가" },
    { id: "a2", title: "2차 사전평가" },
  ],
  "2025-09-15": [
    { id: "b1", title: "미니PJT-1" },
  ],
  "2025-09-16": [
    { id: "b1", title: "미니PJT-1" },
  ],
  "2025-09-17": [
    { id: "b1", title: "미니PJT-1" },
  ],
  "2025-09-18": [
    { id: "b1", title: "미니PJT-1" },
  ],
  "2025-09-19": [
    { id: "b1", title: "미니PJT-1" },
  ],

};

// Date 객체 → YYYY-MM-DD 문자열
export const toISODate = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;