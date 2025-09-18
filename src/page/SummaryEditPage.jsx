import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { http } from "../api/axios";
import "../styles/SummaryWritePage.css";

const SummaryEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    url: "",
    content: "",
    category: "기타",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await http.get(`/summaries/${id}`);
        setForm(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await http.put(`/summaries/${id}`, form);
      alert("수정되었습니다!");
      navigate(`/summary/${id}`);
    } catch (err) {
      console.error(err);
      alert("수정 실패");
    }
  };

 return (
  <div className="container">
    <h2> 📄 게시글 수정 페이지 </h2>

    <label className="formLabel">제목</label>
    <input
      type="text"
      name="title"
      value={form.title}
      onChange={handleChange}
      placeholder="제목을 입력하세요"
      className="inputBox"
    />

    <label className="formLabel">URL</label>
    <input
      type="text"
      name="url"
      value={form.url}
      onChange={handleChange}
      placeholder="관련 링크를 입력하세요"
      className="inputBox"
    />

    <label className="formLabel">내용</label>
    <textarea
      name="content"
      value={form.content}
      onChange={handleChange}
      placeholder="내용을 입력하세요"
      className="textAreaBox"
    />

    <button onClick={handleSubmit} className="button">저장</button>
  </div>

  );
};

export default SummaryEditPage;
