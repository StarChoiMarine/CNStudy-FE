import React, { useEffect, useState } from "react";
import { http } from "../api/axios";
import { Link } from "react-router-dom";

const SummaryPage = () => {
  const [summaries, setSummaries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10; // ✅ 한 페이지당 10개씩

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await http.get("/summaries");

        // ✅ createdAt 기준 최신순 정렬
        const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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
  const currentSummaries = summaries.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(summaries.length / postsPerPage);

  return (
    <div style={{ maxWidth: "900px", margin: "50px auto", padding: "20px", backgroundColor: "white" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>강의 내용 게시판</h2>

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
          {currentSummaries.map((s, index) => (
            <tr key={s.id} style={{ borderBottom: "1px solid #eee" }}>
              {/* 번호: 전체 글 개수에서 순번 계산 */}
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
          <button
            style={{
              padding: "10px 20px",
              backgroundColor: "#FF69B4",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            글 작성
          </button>
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
              backgroundColor: currentPage === idx + 1 ? "#FF69B4" : "transparent",
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
    </div>
  );
};

export default SummaryPage;
