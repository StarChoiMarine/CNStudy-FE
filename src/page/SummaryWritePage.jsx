// src/page/SummaryWritePage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { http } from "../api/axios";
import Header from "../component/Header";

import { Input, Button } from "../styles/common";

const SummaryWritePage = () => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("기타");
  const [hashtags, setHashtags] = useState(""); // ✅ 해시태그 추가
  const [aiKeyword, setAiKeyword] = useState("");
  const [aiResponse, setAiResponse] = useState("");

  const navigate = useNavigate();

  // ✅ 글 작성 저장
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return alert("제목과 강의 내용을 입력하세요!");

    const user = JSON.parse(localStorage.getItem("user"));

    const { data: all } = await http.get("/summaries");
    const numericIds = all
      .map((x) => Number(x.id))
      .filter((n) => Number.isFinite(n));
    const nextId = (numericIds.length ? Math.max(...numericIds) : 0) + 1;

<<<<<<< Updated upstream
  await http.post("/summaries", {
  id: String(nextId),   // ✅ 숫자를 문자열로 변환해서 저장
  title,
  url,
  content,
  author: user?.name || "알 수 없음",
  date: new Date().toISOString().split("T")[0],
});

=======
    await http.post("/summaries", {
      id: String(nextId),
      title,
      url,
      content,
      category,
      hashtags,
      author: user?.name || "알 수 없음",
      date: new Date().toISOString().split("T")[0],
    });
>>>>>>> Stashed changes

    alert("글이 작성되었습니다!");
    navigate("/summary");
  };

  // ✅ 임시 저장 (localStorage 활용)
  const handleTempSave = () => {
    const tempData = { title, url, content, category, hashtags };
    localStorage.setItem("tempSummary", JSON.stringify(tempData));
    alert("임시 저장되었습니다!");
  };

  // ✅ AI 도움 (백엔드 API 연결 예정)
const handleAskAI = async () => {
  if (!content) return alert("강의 내용을 입력해주세요!");

  try {
    // ⬇️ 백엔드 API 붙이면 이 부분 활성화
    /*
    const { data } = await http.post("/api/ai-summary", { content });
    setAiResponse(data.summary); // { summary: "..." } 형태로 받는다고 가정
    */

    // 임시 mock 동작 (지금은 이거만 실행됨)
    setAiResponse(`📌 (예시) "${content.slice(0, 30)}..." 요약 결과입니다.`);
  } catch (err) {
    console.error(err);
    alert("AI 요약 요청에 실패했습니다.");
  }
};


  return (
    <>
      <Header />
      <div style={{ padding: "20px" }}>
        {/* ✅ 항상 맨 위에 고정 */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>
            Lecture Note Writing
          </h2>
        </div>

        {/* 좌/우 flex 배치 */}
        <div style={{ display: "flex", gap: "20px", alignItems: "stretch" }}>
          {/* 왼쪽: 글 작성 영역 */}
          <div
            style={{
              flex: 1,
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "20px",
              background: "#fff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {/* 제목 */}
            <div style={{ marginBottom: "15px" }}>
              <label
                style={{
                  display: "block",
                  fontWeight: "bold",
                  marginBottom: "5px",
                }}
              >
                제목
              </label>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력해주세요."
                style={{ boxSizing: "border-box" }}   // ✅ 너비 문제 해결

              />
            </div>

            {/* URL */}
            <div style={{ marginBottom: "15px" }}>
              <label
                style={{
                  display: "block",
                  fontWeight: "bold",
                  marginBottom: "5px",
                }}
              >
                URL
              </label>
              <Input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="강의 내용과 관련된 링크를 첨부할 수 있습니다."
                style={{ boxSizing: "border-box" }}   // ✅ 너비 문제 해결

              />
            </div>

            {/* 카테고리 */}
            <div style={{ marginBottom: "15px" }}>
              <label
                style={{
                  display: "block",
                  fontWeight: "bold",
                  marginBottom: "5px",
                }}
              >
                카테고리
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  fontSize: "16px",
                }}
              >
                <option value="백엔드">백엔드</option>
                <option value="프론트엔드">프론트엔드</option>
                <option value="클라우드">클라우드</option>
                <option value="AI">AI</option>
                <option value="알고리즘">알고리즘</option>
                <option value="기타">기타</option>
              </select>
            </div>

            {/* 강의 내용 */}
            <div style={{ marginBottom: "15px", flex: 1 }}>
              <label
                style={{
                  display: "block",
                  fontWeight: "bold",
                  marginBottom: "5px",
                }}
              >
                강의 내용
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="학습한 내용을 입력해주세요."
                
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  fontSize: "16px",
                  minHeight: "250px",
                  boxSizing: "border-box"   // ✅ 너비 문제 해결
                }}
              />
            </div>

            {/* 해시태그 */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontWeight: "bold",
                  marginBottom: "5px",
                }}
              >
                해시태그
              </label>
              <Input
                type="text"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                placeholder="#해시태그"
                style={{ boxSizing: "border-box" }}   // ✅ 너비 문제 해결
              />
            </div>

           
          </div>

          {/* 오른쪽: AI 도움 */}
          <div
            style={{
              flex: 1,
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "20px",
              background: "#fff",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h4 style={{ marginBottom: "10px" }}>🤖 학습 도움 AI</h4>
            <Input
              type="text"
              value={aiKeyword}
              onChange={(e) => setAiKeyword(e.target.value)}
              placeholder="학습 도움 받고 싶은 키워드 입력"
                              style={{ boxSizing: "border-box" }}   // ✅ 너비 문제 해결

            />
            <Button
              style={{ marginTop: "10px", width: "100%" }}
              onClick={handleAskAI}
            >
              요약하기 gpt mini 4.0
            </Button>
            <div
              style={{
                marginTop: "15px",
                padding: "10px",
                border: "1px solid #eee",
                borderRadius: "6px",
                flex: 1,
                fontSize: "14px",
                background: "#fafafa",
              }}
            >
              {aiResponse || "AI 답변 ..."}
            </div>
          </div>
        </div>
<<<<<<< Updated upstream
      </FormWrapper>
    </Container>
  </>
=======
      </div>

 {/* 버튼 */}
            <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
              <Button type="button" onClick={() => navigate("/summary")}>
                목록보기
              </Button>
              <Button type="button" onClick={handleTempSave}>
                임시저장
              </Button>
              <Button type="submit" onClick={handleSubmit}>
                글 작성
              </Button>
            </div>

    </>
>>>>>>> Stashed changes
  );
};

export default SummaryWritePage;