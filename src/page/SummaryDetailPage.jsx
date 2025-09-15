// src/page/SummaryDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { http } from "../api/axios";

const SummaryDetailPage = () => {
  const { id } = useParams(); // URL에서 :id 값 추출
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await http.get(`/summaries/${id}`);
        setSummary(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [id]);

  if (!summary) return <p>불러오는 중...</p>;

  return (
    <div>
      <h2>{summary.title}</h2>
      <p>
        <strong>작성자:</strong> {summary.author}
      </p>
      <p>
        <strong>작성일:</strong> {summary.date}
      </p>
      <p>{summary.content}</p>

      <Link to="/summary">목록으로 돌아가기</Link>
    </div>
  );
};

export default SummaryDetailPage;
