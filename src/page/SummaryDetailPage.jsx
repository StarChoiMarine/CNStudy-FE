import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { http } from "../api/axios";
import "../styles/SummaryDetailPage.css";

const SummaryDetailPage = () => {
  const { id } = useParams(); 
  const [summary, setSummary] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

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

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const user = JSON.parse(localStorage.getItem("user")) || { name: "익명" };

    const updated = [
      ...comments,
      {
        author: user.name,
        text: newComment,
        date: new Date().toISOString().split("T")[0],
      },
    ];
    setComments(updated);
    setNewComment("");

    // 서버 저장 필요시 PATCH/POST
    http.patch(`/summaries/${id}`, { comments: updated }).catch((err) =>
      console.error("댓글 저장 실패:", err)
    );
  };

  if (!summary) return <p>로딩 중...</p>;

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
    </>
    
  );
};

export default SummaryDetailPage;