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
          author: user?.name || "알 수 없음",
          date: new Date().toISOString().split("T")[0],
          createdAt: new Date().toISOString(), //  DB에 저장할 때 실제 작성 시각 넣기
        });


    // try {
    //   await http.post("/summaries", {
    //     title,
    //     url,
    //     content,
    //     author: user?.name || "알 수 없음", // 로그인 사용자 이름 자동 저장
    //     date: new Date().toISOString().split("T")[0],
    //   });

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
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f9f9f9",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "700px",
          padding: "30px",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
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
            rows="6"
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
            style={{
              padding: "8px 16px",
              backgroundColor: "#ddd",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            목록보기
          </button>
          <button
            type="submit"
            style={{
              padding: "8px 16px",
              backgroundColor: "#FF69B4",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            글 작성
          </button>
        </div>
      </form>
    </div>
  );
};

export default SummaryWritePage;
