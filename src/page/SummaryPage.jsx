// src/page/SummaryPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { http } from "../api/axios";
import { Link, useLocation } from "react-router-dom";
import Header from "../component/Header";

// ✅ 공통 스타일 불러오기
import { Container, FormWrapper, Title, Button, Input } from "../styles/common";

const SummaryPage = () => {
  const [summaries, setSummaries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const [category, setCategory] = useState("전체");
  const location = useLocation();

  // 🔍 검색 상태
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState("all"); // all | title | author | content

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await http.get("/summaries");

        // id 기준 내림차순 정렬
        const toNum = (v) => {
          const n = Number(v);
          return Number.isFinite(n) ? n : -Infinity;
        };
        let sorted = [...data].sort((a, b) => toNum(b.id) - toNum(a.id));

        // ✅ 쿼리파라미터(tag) 확인해서 해시태그 필터링
        const params = new URLSearchParams(location.search);
        const tag = params.get("tag");
        if (tag) {
          sorted = sorted.filter((s) => s.hashtags?.includes(tag));
        }

        setSummaries(sorted);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [location.search]);

  // 🔍 검색 필터링
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return summaries;

    return summaries.filter((s) => {
      const inTitle = (s.title || "").toLowerCase().includes(q);
      const inAuthor = (s.author || "").toLowerCase().includes(q);
      const inContent = (s.content || "").toLowerCase().includes(q);

      if (scope === "title") return inTitle;
      if (scope === "author") return inAuthor;
      if (scope === "content") return inContent;
      return inTitle || inAuthor || inContent;
    });
  }, [summaries, query, scope]);

  // 검색 조건 바뀌면 1페이지로
  useEffect(() => {
    setCurrentPage(1);
  }, [query, scope]);

  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;
  const currentSummaries = filtered.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filtered.length / postsPerPage) || 1;

  return (
    <>
      <Header />

      <Container style={{ alignItems: "flex-start", paddingTop: "40px" }}>
        <FormWrapper style={{ width: "1000px", maxWidth: "100%" }}>
          <Title>강의 내용 게시판</Title>

          {/* 🔍 검색 바 */}
          <div
            style={{
              display: "flex",
              gap: 8,
              justifyContent: "flex-end",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <select
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              style={{
                height: 36,
                padding: "0 10px",
                border: "1px solid #ddd",
                borderRadius: 8,
                background: "#fff",
              }}
            >
              <option value="all">전체</option>
              <option value="title">제목</option>
              <option value="author">작성자</option>
              <option value="content">내용</option>
            </select>

            <div style={{ position: "relative" }}>
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="검색어를 입력하세요"
                style={{ width: 240, paddingRight: 34 }}
              />
              <span
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  opacity: 0.5,
                  fontSize: 14,
                }}
              >
                🔍
              </span>
            </div>
          </div>

          {/* 목록 테이블 */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "20px",
            }}
          >
            <thead>
              <tr style={{ borderBottom: "2px solid #ddd" }}>
                <th style={{ padding: "10px" }}>번호</th>
                <th style={{ padding: "10px" }}>제목</th>
                <th style={{ padding: "10px" }}>작성자</th>
                <th style={{ padding: "10px" }}>날짜</th>
                <th style={{ padding: "10px" }}>카테고리</th>
              </tr>
            </thead>

            <tbody>
              {currentSummaries.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: 24 }}>
                    검색 결과가 없습니다.
                  </td>
                </tr>
              ) : (
                currentSummaries.map((s, index) => (
                  <tr key={s.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ textAlign: "center", padding: "8px" }}>
                      {filtered.length -
                        ((currentPage - 1) * postsPerPage + index)}
                    </td>
                    <td style={{ textAlign: "center", padding: "8px" }}>
                      <Link to={`/summary/${s.id}`} style={{ color: "#333" }}>
                        {s.title}
                      </Link>
                    </td>
                    <td style={{ textAlign: "center", padding: "8px" }}>
                      {s.author}
                    </td>
                    <td style={{ textAlign: "center", padding: "8px" }}>
                      {s.date}
                    </td>
                    <td style={{ textAlign: "center", padding: "8px" }}>
                      {s.category || "기타"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* 글 작성 버튼 */}
          <div style={{ textAlign: "right" }}>
            <Link to="/summary/write">
              <Button style={{ width: "auto", padding: "8px 16px" }}>
                글 작성
              </Button>
            </Link>
          </div>

          {/* 페이지네이션 */}
          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
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
                  backgroundColor:
                    currentPage === idx + 1 ? "#FF68A5" : "transparent",
                  border: "1px solid #ddd",
                  borderRadius: "3px",
                  padding: "5px 10px",
                }}
              >
                {idx + 1}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
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
