// src/page/MyPostsPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { http } from "../api/axios";
import { Link } from "react-router-dom";
import MyPageLayout from "../component/MyPageLayout";
import { FormWrapper, Title, Input } from "../styles/common";

const FETCH_URL = "/api/v1/mypage/boards"; // ← 컨트롤러 base path에 맞게 조정

export default function MyPostsPage() {
  const me = JSON.parse(localStorage.getItem("user") || "{}");
  const myId =
    me.userId ?? me.id ?? me.userSeq ?? me.seq ?? me.uid ?? null;

  const [rows, setRows] = useState([]);           // 백엔드 데이터(내 글들)
  const [loading, setLoading] = useState(true);

  // 검색/필터/페이지네이션
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState("title");    // title | author (DTO엔 content가 없음)
  const [category, setCategory] = useState("전체");

  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    (async () => {
      if (!myId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        // ✅ 내 글 목록 가져오기
        // GET /api/v1/mypage/boards?userId=123
        const { data } = await http.get(FETCH_URL, { params: { userId: myId } });

        // DTO: { boardId, title, userName, createdAt, category }
        const mapped = (Array.isArray(data) ? data : []).map((b) => ({
          id: b.boardId,
          boardId: b.boardId,
          title: b.title,
          authorName: b.userName,
          date: b.createdAt,             // "yyyy-MM-dd"
          category: b.category || "기타",
        }));

        // 최신 글 우선(내림차순)
        mapped.sort((a, b) => Number(b.id) - Number(a.id));
        setRows(mapped);
      } catch (err) {
        console.error("내 글 불러오기 오류:", err?.response?.data || err);
      } finally {
        setLoading(false);
      }
    })();
  }, [myId]);

  // 카테고리 옵션(내 글에서만 추출)
  const categoryOptions = useMemo(() => {
    const set = new Set((rows || []).map((r) => r.category || "기타"));
    return ["전체", ...Array.from(set)];
  }, [rows]);

  // 필터링: 카테고리
  const categoryFiltered = useMemo(() => {
    if (category === "전체") return rows;
    return rows.filter((r) => (r.category || "기타") === category);
  }, [rows, category]);

  // 필터링: 검색(제목/작성자)
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categoryFiltered;

    return categoryFiltered.filter((r) => {
      const inTitle = (r.title || "").toLowerCase().includes(q);
      const inAuthor = (r.authorName || "").toLowerCase().includes(q);
      if (scope === "title") return inTitle;
      if (scope === "author") return inAuthor;
      return inTitle || inAuthor;
    });
  }, [categoryFiltered, query, scope]);

  // 페이지네이션
  useEffect(() => setCurrentPage(1), [query, scope, category]);

  const totalPages = Math.ceil(filtered.length / perPage) || 1;
  const start = (currentPage - 1) * perPage;
  const pageRows = filtered.slice(start, start + perPage);

  if (!myId) {
    return (
      <MyPageLayout>
        <FormWrapper style={{ width: 1000, maxWidth: "100%" }}>
          <Title>내가 작성한 글</Title>
          <div style={{ padding: 16 }}>로그인 후 이용해 주세요.</div>
        </FormWrapper>
      </MyPageLayout>
    );
  }

  return (
    <MyPageLayout>
      <FormWrapper style={{ width: 1000, maxWidth: "100%" }}>
        <Title>내가 작성한 글</Title>

        {/* 상단 툴바 */}
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

            {/* 검색 범위 (DTO에 content 없음) */}
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
              <option value="title">제목</option>
              <option value="author">작성자</option>
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

        {/* 목록 테이블 (views/likes 제거: DTO에 없음) */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: 20,
          }}
        >
          <thead>
            <tr style={{ borderBottom: "2px solid #ddd" }}>
              <th style={{ padding: 10, width: 80 }}>번호</th>
              <th style={{ padding: 10 }}>제목</th>
              <th style={{ padding: 10, width: 180 }}>작성일</th>
              <th style={{ padding: 10, width: 160 }}>카테고리</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", padding: 24 }}>
                  불러오는 중…
                </td>
              </tr>
            ) : pageRows.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", padding: 24 }}>
                  검색 결과가 없습니다.
                </td>
              </tr>
            ) : (
              pageRows.map((s, index) => (
                <tr key={s.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ textAlign: "center", padding: 8 }}>
                    {filtered.length - ((currentPage - 1) * perPage + index)}
                  </td>
                  <td style={{ textAlign: "center", padding: 8 }}>
                    <Link to={`/summary/${s.id}`} style={{ color: "#333" }}>
                      {s.title}
                    </Link>
                  </td>
                  <td style={{ textAlign: "center", padding: 8 }}>{s.date}</td>
                  <td style={{ textAlign: "center", padding: 8 }}>
                    {s.category || "기타"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* 페이지네이션 */}
        {!loading && (
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
        )}
      </FormWrapper>
    </MyPageLayout>
  );
}
