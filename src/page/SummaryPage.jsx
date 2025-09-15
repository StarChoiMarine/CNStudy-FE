// src/page/SummaryPage.jsx
import React, { useEffect, useState } from "react";
import { http } from "../api/axios";
import { Link } from "react-router-dom";

const SummaryPage = () => {
  const [summaries, setSummaries] = useState([]);

  // JSON Server에서 요약글 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await http.get("/summaries");
        setSummaries(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>강의 내용 게시판</h2>

      <button style={{ marginBottom: "10px" }}>
        <Link to="/summary/write">새 글 작성하기</Link>
      </button>

      <table border="1" cellPadding="8" cellSpacing="0" width="100%">
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>날짜</th>
          </tr>
        </thead>
        <tbody>
          {summaries.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>
                <Link to={`/summary/${s.id}`}>{s.title}</Link>
              </td>
              <td>{s.author}</td>
              <td>{s.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SummaryPage;
