// src/page/SummaryPage.jsx
import React, { useEffect, useState } from "react";
import { http } from "../api/axios";
import { Link, useLocation } from "react-router-dom";
import Header from "../component/Header";

// ✅ 공통 스타일 불러오기
import { Container, FormWrapper, Title, Button, Input } from "../styles/common";

const SummaryPage = () => {
  const [summaries, setSummaries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;


  useEffect(() => {
  const fetchData = async () => {
    try {
      const { data } = await http.get("/summaries");

      // id 기준 내림차순 정렬 (숫자형 id 고려)
      const toNum = (v) => {
        const n = Number(v);
        return Number.isFinite(n) ? n : -Infinity;
      };

      const sorted = data.sort((a, b) => toNum(b.id) - toNum(a.id));
      setSummaries(sorted);
    } catch (err) {
      console.error(err);
    }
  };
  fetchData();
}, []);


  // ✅ 페이지네이션 계산
  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;
  const currentSummaries = filtered.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filtered.length / postsPerPage) || 1;

  return (
      <>
      <Header /> {/* ✅ 여기서 헤더 추가 */}

    <Container style={{ alignItems: "flex-start", paddingTop: "40px" }}>
      <FormWrapper style={{ width: "1000px" }}>
        <Title>강의 내용 게시판</Title>

        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #ddd" }}>
              <th style={{ padding: "10px" }}>번호</th>
              <th style={{ padding: "10px" }}>제목</th>
              <th style={{ padding: "10px" }}>날짜</th>
              <th style={{ padding: "10px" }}>작성자</th>
            </tr>
          </thead>
             <tbody>
                {currentSummaries.map((s, index) => (   // ✅ index 추가
                  <tr key={s.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ textAlign: "center", padding: "8px" }}>
                      {summaries.length - ((currentPage - 1) * postsPerPage + index)}
                    </td>
                    <td style={{ textAlign: "center", padding: "8px" }}>
                      <Link to={`/summary/${s.id}`} style={{ color: "#333" }}>
                        {s.title}
                      </Link>
                    </td>
                    <td style={{ textAlign: "center", padding: "8px" }}>{s.date}</td>
                    <td style={{ textAlign: "center", padding: "8px" }}>{s.author}</td>
                  </tr>
            ))}
          </tbody>

        </table>

        {/* 글 작성 버튼 */}
        <div style={{ textAlign: "right" }}>
          <Link to="/summary/write">
            <Button style={{ width: "auto", padding: "8px 16px" }}>글 작성</Button>
          </Link>
        </div>

        {/* 페이지네이션 */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={{ margin: "0 5px" }}
          >
            {"<"}
          </button>

          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx + 1}
              onClick={() => setCurrentPage(idx + 1)}
              style={{
                margin: "0 5px",
                fontWeight: currentPage === idx + 1 ? "bold" : "normal",
                color: currentPage === idx + 1 ? "white" : "black",
                backgroundColor: currentPage === idx + 1 ? "#FF68A5" : "transparent",
                border: "1px solid #ddd",
                borderRadius: "3px",
                padding: "5px 10px",
              }}
            >
              {idx + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{ margin: "0 5px" }}
          >
            {">"}
          </button>
        </div>
      </FormWrapper>
    </Container>
    </>
  );
};

export default SummaryPage;
