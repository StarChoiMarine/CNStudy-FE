import React, { useEffect, useMemo, useState } from "react";
import { http } from "../api/axios";
import { Link, useLocation } from "react-router-dom";
import Header from "../component/Header";

import { Container, FormWrapper, Title, Button, Input } from "../styles/common";

const SummaryPage = () => {
  const [summaries, setSummaries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const [category, setCategory] = useState("전체"); // (옵션) 카테고리 필터
  const location = useLocation();

  
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState("all"); // all | title | author | content

  // ✅ 백엔드 응답을 프론트 표준 형태로 정규화
  const normalizeBoard = (b) => {
    // 백엔드 BoardResponseDTO 예상 필드:
    // id, title, content, url, category, hashtags(List<String> or string), author(or writer), createdAt(or date)
    return {
      id: b.id ?? b.boardId ?? b.boardSeq,
      title: b.title ?? "",
      author: b.name ?? "알 수 없음",
      date:
        (typeof b.createdAt === "string" && b.createdAt.slice(0, 10)) ||
        (typeof b.date === "string" && b.date.slice(0, 10)) ||
        "",
      category: b.category ?? "기타",
      content: b.content ?? "",
      hashtags: Array.isArray(b.hashtags)
        ? b.hashtags
        : typeof b.hashtags === "string" && b.hashtags.length > 0
        ? b.hashtags.split(",").map((t) => t.trim())
        : [],
      url: b.url ?? "",
      _raw: b,
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ 핵심: /summaries → /api/v1/boards/list
        const { data } = await http.get("/api/v1/boards/list");
        const rows = Array.isArray(data) ? data.map(normalizeBoard) : [];

        const toNum = (v) => {
          const n = Number(v);
          return Number.isFinite(n) ? n : -Infinity;
        };
        let sorted = [...rows].sort((a, b) => toNum(b.id) - toNum(a.id));

        // 쿼리파라미터(tag) 확인해서 해시태그 필터링
        const params = new URLSearchParams(location.search);
        const tag = params.get("tag");
        if (tag) {
          sorted = sorted.filter((s) => s.hashtags?.includes(tag));
        }

        setSummaries(sorted);
      } catch (err) {
        console.error("목록 로딩 실패:", err);
        alert("게시글 목록을 불러오지 못했습니다.");
      }
    };
    fetchData();
  }, [location.search]);

  // 검색 필터링
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    let base = summaries;
    if (category !== "전체") {
      base = base.filter((s) => (s.category || "기타") === category);
    }

    if (!q) return base;

    return base.filter((s) => {
      const inTitle = (s.title || "").toLowerCase().includes(q);
      const inAuthor = (s.author || "").toLowerCase().includes(q);
      const inContent = (s.content || "").toLowerCase().includes(q);

      if (scope === "title") return inTitle;
      if (scope === "author") return inAuthor;
      if (scope === "content") return inContent;
      return inTitle || inAuthor || inContent;
    });
  }, [summaries, query, scope, category]);

  // 검색/범위/카테고리 바뀌면 1페이지로
  useEffect(() => {
    setCurrentPage(1);
  }, [query, scope, category]);

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

          {/* 🔍 검색/필터 바 */}
          <div
            style={{
              display: "flex",
              gap: 8,
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
              flexWrap: "wrap",
            }}
          >
            {/* (옵션) 카테고리 필터 */}
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <label style={{ fontSize: 14, opacity: 0.7 }}>카테고리</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  height: 36,
                  padding: "0 10px",
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  background: "#fff",
                }}
              >
                <option value="전체">전체</option>
                <option value="백엔드">백엔드</option>
                <option value="프론트엔드">프론트엔드</option>
                <option value="클라우드">클라우드</option>
                <option value="AI">AI</option>
                <option value="알고리즘">알고리즘</option>
                <option value="기타">기타</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
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
                      {/* 상세 페이지 라우트는 기존 /summary/:id 유지.
                          상세 컴포넌트에서 GET /api/v1/boards/read/{id} 호출 */}
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
