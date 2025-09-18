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

  const [hashtags, setHashtags] = useState([]); // string[]
  const [tagInput, setTagInput] = useState("");

  const [aiKeyword, setAiKeyword] = useState("");
  const [aiResponse, setAiResponse] = useState("");

  const navigate = useNavigate();

  // 로컬 user에서 userId 유추
  const getUserId = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const candidates = [user?.userId, user?.id, user?.seq, user?.userSeq];
      const firstNumeric = candidates
        .map((v) => (v == null ? NaN : Number(v)))
        .find((n) => Number.isFinite(n));
      return Number.isFinite(firstNumeric) ? firstNumeric : undefined;
    } catch {
      return undefined;
    }
  };

  // ✅ 글 작성 저장 (백엔드 연동)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("제목과 강의 내용을 입력하세요!");
      return;
    }

    try {
      const userId = getUserId();

      // 해시태그 정제: '#tag' → 'tag', 공백 제거
      const cleanTags = (hashtags || [])
        .map((t) => String(t).trim().replace(/^#/, ""))
        .filter((t) => t.length > 0);

      // 빈 문자열은 아예 보내지 않도록 undefined 처리
      const safeUrl = url.trim() ? url.trim() : undefined;

      // DTO에 정확히 맞춘 본문
      const body = {
        ...(userId !== undefined ? { userId } : {}), // userId가 있으면 포함
        title: title.trim(),
        content: content.trim(),
        category: category.trim() || "기타",
        ...(safeUrl ? { url: safeUrl } : {}),
        hashtags: cleanTags, // List<String>
      };

      await http.post("/api/v1/boards/register", body, {
        headers: { "Content-Type": "application/json" },
      });

      alert("글이 작성되었습니다!");
      navigate("/summary");
    } catch (err) {
      console.error("등록 오류:", err?.response?.data || err);
      alert(
        `글 작성 중 오류가 발생했습니다.\n` +
          `${err?.response?.status || ""} ${err?.response?.statusText || ""}\n` +
          `${JSON.stringify(err?.response?.data || {}, null, 2)}`
      );
    }
  };

  // ✅ 임시 저장
  const handleTempSave = () => {
    const tempData = { title, url, content, category, hashtags };
    localStorage.setItem("tempSummary", JSON.stringify(tempData));
    alert("임시 저장되었습니다!");
  };

  // ✅ 해시태그 추가
  const handleAddTag = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/^#/, "");
      if (newTag && !hashtags.includes(newTag)) {
        setHashtags((prev) => [...prev, newTag]);
      }
      setTagInput("");
    }
  };

  // ✅ 해시태그 삭제
  const handleRemoveTag = (tag) => {
    setHashtags((prev) => prev.filter((t) => t !== tag));
  };

  // ✅ AI 도움 (Mock)
  const handleAskAI = async () => {
    if (!content) return alert("강의 내용을 입력해주세요!");
    try {
      setAiResponse(`📌 (예시) "${content.slice(0, 30)}..." 요약 결과입니다.`);
    } catch (err) {
      console.error(err);
      alert("AI 요약 요청에 실패했습니다.");
    }
  };

  return (
    <>
      <Header />
      <div
        className="summaryPage"
        style={{
          padding: "20px",
          maxWidth: "900px",
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        {/* 제목 */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>
            Lecture Note Writing
          </h2>
        </div>

        {/* 제목 / URL / 카테고리 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1px",
            marginBottom: "15px",
          }}
        >
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력해주세요."
            style={{ width: "100%", boxSizing: "border-box" }}
          />

          <Input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="관련된 링크 첨부"
            style={{ width: "100%", boxSizing: "border-box" }}
          />

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

        {/* 좌/우 flex → 강의내용 + AI 도움 */}
        <div style={{ display: "flex", gap: "20px", alignItems: "stretch" }}>
          {/* 강의 내용 */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              paddingTop: "20px",
            }}
          >
            <label
              style={{
                display: "block",
                fontWeight: "bold",
                marginBottom: "5px",
              }}
            >
              ✏️ 강의 내용
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="학습한 내용을 입력해주세요."
              style={{
                flex: 1,
                padding: "12px",
                border: "1px solid #ccc",
                borderRadius: "6px",
                fontSize: "16px",
                minHeight: "350px",
                resize: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* AI 도움 */}
          <div style={{ flex: 1 }}>
            <h4 style={{ marginBottom: "5px" }}>🤖 학습 도움 AI</h4>
            <Input
              type="text"
              value={aiKeyword}
              onChange={(e) => setAiKeyword(e.target.value)}
              placeholder="키워드 입력"
              style={{ width: "93%" }}
            />
            <Button style={{ marginTop: "1px", width: "100%" }} onClick={handleAskAI}>
              요약하기 gpt mini 4.0
            </Button>
            <div
              style={{
                marginTop: "10px",
                padding: "10px",
                border: "1px solid #eee",
                borderRadius: "6px",
                minHeight: "250px",
                background: "#fafafa",
              }}
            >
              {aiResponse || "AI 답변 ..."}
            </div>
          </div>
        </div>

        {/* 해시태그 */}
        <div style={{ marginTop: "10px" }}>
          <label
            style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}
          >
            해시태그
          </label>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              padding: "1px",
              minHeight: "30px",
              alignItems: "center",
            }}
          >
            {hashtags.map((tag, idx) => (
              <span
                key={idx}
                style={{
                  background: "#f0f0f0",
                  padding: "5px 10px",
                  borderRadius: "12px",
                  fontSize: "11px",
                }}
              >
                #{tag}{" "}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  style={{
                    border: "none",
                    background: "transparent",
                    marginLeft: "5px",
                    cursor: "pointer",
                  }}
                >
                  ×
                </button>
              </span>
            ))}
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="해시태그 입력 후 Enter"
              style={{
                border: "none",
                outline: "none",
                flex: 1,
                minWidth: "100px",
              }}
            />
          </div>
        </div>

        {/* 하단 버튼 */}
        <div
          style={{
            marginTop: "30px",
            display: "flex",
            gap: "10px",
            justifyContent: "center",
          }}
        >
          <Button
            onClick={handleTempSave}
            style={{ background: "#f0f0f0", color: "#333" }}
          >
            임시 저장
          </Button>
          <Button
            onClick={handleSubmit}
            style={{ background: "#FF68A5", color: "#fff" }}
          >
            글 작성
          </Button>
          <Button
            onClick={() => navigate("/summary")}
            style={{ background: "#ddd", color: "#333" }}
          >
            목록 보기
          </Button>
        </div>
      </div>
    </>
  );
};

export default SummaryWritePage;
