// src/page/MyLikesPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { http } from "../api/axios";
import { Link, useLocation } from "react-router-dom";
import MyPageLayout from "../component/MyPageLayout";
import { FormWrapper, Title, Button, Input } from "../styles/common";

export default function MyLikesPage() {
  const me = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();

  const [summaries, setSummaries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  // 🔍 검색 상태
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState("all"); // all | title | author | content

  // 🏷️ 카테고리 (기본: 전체)
  const [category, setCategory] = useState("전체");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await http.get("/summaries");

        // id 내림차순
        const toNum = (v) => {
          const n = Number(v);
          return Number.isFinite(n) ? n : -Infinity;
        };
        setSummaries([...data].sort((a, b) => toNum(b.id) - toNum(a.id)));
      } catch (err) {
        console.error("좋아요 글 불러오기 오류:", err);
      }
    })();
  }, []);

  // ✅ 내가 좋아요한 글만 베이스
  const likedBase = useMemo(() => {
    const myId = me?.id;
    if (!myId) return [];
    return summaries.filter(
      (s) => Array.isArray(s.likedUsers) && s.likedUsers.includes(myId)
    );
  }, [summaries, me]);

  // ✅ URL ?tag= 해시태그 필터
  const tagFiltered = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const tag = params.get("tag");
    if (!tag) return likedBase;
    return likedBase.filter((s) => s.hashtags?.includes(tag));
  }, [likedBase, location.search]);

  // ✅ 카테고리 필터
  const categoryFiltered = useMemo(() => {
    if (category === "전체") return tagFiltered;
    return tagFiltered.filter((s) => (s.category || "기타") === category);
  }, [tagFiltered, category]);

  // ✅ 검색 필터
  const searchFiltered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categoryFiltered;

    return categoryFiltered.filter((s) => {
      const inTitle = (s.title || "").toLowerCase().includes(q);
      const inAuthor = (s.author || "").toLowerCase().includes(q);
      const inContent = (s.content || "").toLowerCase().includes(q);

      if (scope === "title") return inTitle;
      if (scope === "author") return inAuthor;
      if (scope === "content") return inContent;
      return inTitle || inAuthor || inContent;
    });
  }, [categoryFiltered, query, scope]);

  // 🔄 조건 변경 시 1페이지로
  useEffect(() => {
    setCurrentPage(1);
  }, [query, scope, category, location.search]);

  // 페이지네이션
  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;
  const currentSummaries = searchFiltered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(searchFiltered.length / postsPerPage) || 1;

  // 화면에 보여줄 카테고리 옵션 (내가 좋아요한 글들에서 추출)
  const categoryOptions = useMemo(() => {
    const set = new Set((likedBase || []).map((s) => s.category || "기타"));
    return ["전체", ...Array.from(set)];
  }, [likedBase]);

  return (
    <MyPageLayout>
      <FormWrapper style={{ width: 1000, maxWidth: "100%" }}>
        <Title>내가 좋아요 한 글</Title>

        {/* 🔎 상단 툴바 */}
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
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {/* 카테고리 */}
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
              {categoryOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* 검색 범위 */}
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
          </div>

          {/* 검색 입력 */}
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
          style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20 }}
        >
          <thead>
            <tr style={{ borderBottom: "2px solid #ddd" }}>
              <th style={{ padding: 10, width: 80 }}>번호</th>
              <th style={{ padding: 10 }}>제목</th>
              <th style={{ padding: 10, width: 140 }}>날짜</th>
              <th style={{ padding: 10, width: 100 }}>조회수</th>
              <th style={{ padding: 10, width: 100 }}>좋아요</th>
              <th style={{ padding: 10, width: 120 }}>카테고리</th>
            </tr>
          </thead>

        <tbody>
          {currentSummaries.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: "center", padding: 24 }}>
                검색 결과가 없습니다.
              </td>
            </tr>
          ) : (
            currentSummaries.map((s, index) => (
              <tr key={s.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ textAlign: "center", padding: 8 }}>
                  {searchFiltered.length -
                    ((currentPage - 1) * postsPerPage + index)}
                </td>
                <td style={{ textAlign: "center", padding: 8 }}>
                  <Link to={`/summary/${s.id}`} style={{ color: "#333" }}>
                    {s.title}
                  </Link>
                </td>
                <td style={{ textAlign: "center", padding: 8 }}>{s.date}</td>
                <td style={{ textAlign: "center", padding: 8 }}>
                  {s.views ?? 0}
                </td>
                <td style={{ textAlign: "center", padding: 8 }}>
                  {s.likes ?? 0}
                </td>
                <td style={{ textAlign: "center", padding: 8 }}>
                  {s.category || "기타"}
                </td>
              </tr>
            ))
          )}
        </tbody>
        </table>


        {/* 페이지네이션 */}
        <div style={{ textAlign: "center", marginTop: 20 }}>
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
    </MyPageLayout>
  );
}
