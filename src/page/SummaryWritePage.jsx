// src/page/SummaryWritePage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { http } from "../api/axios";

// ✅ 공통 스타일 가져오기
import {
  Container,
  FormWrapper,
  Title,
  Input,
  Button,
} from "../styles/common"; // common.js 위치에 맞게 경로 확인

const SummaryWritePage = () => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!title || !content) {
  //     alert("제목과 강의 내용을 입력하세요!");
  //     return;
  //   }

  //   const user = JSON.parse(localStorage.getItem("user"));

  //   try {
  //     await http.post("/summaries", {
  //       title,
  //       url,
  //       content,
  //       author: user?.name || "알 수 없음",
  //       date: new Date().toISOString().split("T")[0],
  //     });

  //     alert("글이 작성되었습니다!");
  //     navigate("/summary");
  //   } catch (err) {
  //     console.error(err);
  //     alert("글 작성 중 오류가 발생했습니다.");
  //   }
  // };
// SummaryWritePage.jsx (핵심만)
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!title || !content) return alert("제목과 강의 내용을 입력하세요!");

  const user = JSON.parse(localStorage.getItem("user"));

  // 1) 현재 summaries 불러와서 숫자 id의 최댓값 계산
  const { data: all } = await http.get("/summaries");
  const numericIds = all
    .map(x => Number(x.id))
    .filter(n => Number.isFinite(n));
  const nextId = (numericIds.length ? Math.max(...numericIds) : 0) + 1;

  // 2) 우리가 id를 직접 지정해 POST
  await http.post("/summaries", {
    id: nextId,               // ★ 직접 숫자 id 부여
    title,
    url,
    content,
    author: user?.name || "알 수 없음",
    date: new Date().toISOString().split("T")[0],
  });

  alert("글이 작성되었습니다!");
  navigate("/summary");
};

  return (
    <Container>
      <FormWrapper>
        <Title>Lecture Note Writing</Title>

        {/* 제목 */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>
            제 목
          </label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력해주세요."
          />
        </div>

        {/* URL */}
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>
            URL
          </label>
          <Input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="강의 내용과 관련된 링크를 첨부할 수 있습니다."
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
            rows="8"
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              fontSize: "16px",
            }}
          />
        </div>

        {/* 버튼 */}
        <div style={{ display: "flex", gap: "10px" }}>
          <Button type="button" onClick={() => navigate("/summary")}>
            목록보기
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            글 작성
          </Button>
        </div>
      </FormWrapper>
    </Container>
  );
};

export default SummaryWritePage;
