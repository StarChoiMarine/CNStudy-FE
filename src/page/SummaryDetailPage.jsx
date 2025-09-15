import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { http } from "../api/axios";

const SummaryDetailPage = () => {
  const { id } = useParams(); // URL에서 글 ID 가져옴
  const [summary, setSummary] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await http.get(`/summaries/${id}`);
        setSummary(data);
        setComments(data.comments || []); // 댓글은 summary 안에 있다고 가정
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [id]);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const updated = [...comments, { text: newComment, date: new Date().toISOString().split("T")[0] }];
    setComments(updated);
    setNewComment("");
    // 실제라면 서버에도 PATCH/POST 요청 필요
  };

  if (!summary) return <p>로딩 중...</p>;

  return (
    <div style={{ maxWidth: "900px", margin: "50px auto", padding: "20px", background: "white" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Lecture Note</h2>

      {/* 글 정보 테이블 */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
        <tbody>
          <tr>
            <td style={{ fontWeight: "bold", padding: "8px" }}>제목</td>
            <td>{summary.title}</td>
          </tr>
          <tr>
            <td style={{ fontWeight: "bold", padding: "8px" }}>URL</td>
            <td><a href={summary.url} target="_blank" rel="noreferrer">{summary.url}</a></td>
          </tr>
          <tr>
            <td style={{ fontWeight: "bold", padding: "8px" }}>작성자</td>
            <td>{summary.author}</td>
          </tr>
          <tr>
            <td style={{ fontWeight: "bold", padding: "8px" }}>작성일</td>
            <td>{summary.date}</td>
          </tr>
          <tr>
            <td style={{ fontWeight: "bold", padding: "8px" }}>조회수</td>
            <td>{summary.views || 0}</td>
          </tr>
        </tbody>
      </table>

      {/* 본문 내용 */}
      <div style={{
        border: "1px solid #ddd",
        padding: "15px",
        minHeight: "100px",
        marginBottom: "20px"
      }}>
        {summary.content}
      </div>

      {/* 좋아요 버튼 */}
  <div style={{ marginBottom: "20px" }}>
    <button
      onClick={() => {
      const updatedLikes = (summary.likes || 0) + 1;
      setSummary({ ...summary, likes: updatedLikes });

      // 서버에도 반영 (json-server라면 PATCH 요청)
      http.patch(`/summaries/${id}`, { likes: updatedLikes })
        .catch(err => console.error("좋아요 저장 실패:", err));
    }}
    style={{
      background: "transparent",
      border: "none",
      fontSize: "18px",
      cursor: "pointer"
    }}
  >
    ❤️ {summary.likes || 0}
  </button>
</div>

      {/* 댓글 입력 */}
      <div style={{ marginBottom: "20px" }}>
        <textarea
          rows="3"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          style={{ width: "100%", padding: "10px" }}
          placeholder="댓글을 입력하세요"
        />
        <button onClick={handleAddComment} style={{ marginTop: "10px", background: "#FF69B4", color: "white", padding: "8px 15px", border: "none", borderRadius: "5px" }}>
          등록
        </button>
      </div>

      {/* 댓글 목록 */}
      <div>
        <h4>댓글</h4>
        {comments.length === 0 ? (
          <p>댓글이 없습니다.</p>
        ) : (
          comments.map((c, i) => (
            <div key={i} style={{ borderBottom: "1px solid #eee", padding: "8px 0" }}>
              <p>{c.text}</p>
              <small>{c.date}</small>
            </div>
          ))
        )}
      </div>

      
      {/* 목록으로 돌아가기 */}
      <div style={{ marginTop: "30px" }}>
        <Link to="/summary">목록으로 돌아가기</Link>
      </div>
    </div>
  );
};

export default SummaryDetailPage;