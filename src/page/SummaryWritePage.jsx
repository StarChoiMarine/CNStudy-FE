// src/page/SummaryWritePage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { http } from "../api/axios";

const SummaryWritePage = () => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      alert("제목과 강의 내용을 입력하세요!");
      return;
    }

    // 로그인된 사용자 정보 가져오기
    const user = JSON.parse(localStorage.getItem("user"));

    try {
      await http.post("/summaries", {
        title,
        url,
        content,
        author: user?.name || "알 수 없음", // 로그인 사용자 이름 자동 저장
        date: new Date().toISOString().split("T")[0],
      });

      alert("글이 작성되었습니다!");
      navigate("/summary");
    } catch (err) {
      console.error(err);
      alert("글 작성 중 오류가 발생했습니다.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",  // ✅ 세로 위쪽 정렬
        minHeight: "100vh",        // ✅ 최소 화면 높이 채움
        paddingTop: "60px",        // ✅ 위쪽 여백
        paddingBottom: "60px",     // ✅ 아래쪽 여백
        backgroundColor: "#f9f9f9",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "1000px",   // ✅ 기존보다 넓게
          padding: "40px",
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "30px",
            fontFamily: "monospace",
          }}
        >
          Lecture Note Writing
        </h2>

        {/* 제목 */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
          <label style={{ width: "100px", fontWeight: "bold" }}>제 목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력해주세요."
            style={{
              flex: 1,
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          />
        </div>

        {/* URL */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
          <label style={{ width: "100px", fontWeight: "bold" }}>URL</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="강의 내용과 관련된 링크를 첨부할 수 있습니다."
            style={{
              flex: 1,
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          />
        </div>

        {/* 내용 */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>
            강의 내용
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="학습한 내용을 입력해주세요."
            rows="8"   // ✅ 조금 더 늘려줌
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          />
        </div>

        {/* 버튼 */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button
            type="button"
            onClick={() => navigate("/summary")}
            className="button"   // ✅ 통일
          >
            목록보기
          </button>
          <button
            type="submit"
            className="button"   // ✅ 통일
          >
            글 작성
          </button>
        </div>
      </form>
    </div>
  );
};

export default SummaryWritePage;
