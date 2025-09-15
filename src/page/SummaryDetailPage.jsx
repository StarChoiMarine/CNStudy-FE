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

      // 조회수 증가
      const updatedViews = (data.views || 0) + 1;
      setSummary({ ...data, views: updatedViews });

      // 서버에 반영
      await http.patch(`/summaries/${id}`, { views: updatedViews });

      setComments(data.comments || []);
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
    <div className="container">
      <h2 className="title">Lecture Note</h2>

      {/* 글 정보 테이블 */}
              <table className="table">
        <tbody>
          <tr>
          <td><strong>제목</strong></td>
          <td colSpan="5">{summary.title}</td>
        </tr>
        <tr>
          <td><strong>URL</strong></td>
          <td colSpan="5">
            <a href={summary.url} target="_blank" rel="noreferrer">
              {summary.url}
            </a>
          </td>
        </tr>
        <tr>
          <td><strong>작성자</strong></td>
          <td>{summary.author}</td>
          <td><strong>작성일</strong></td>
          <td>{summary.date}</td>
          <td><strong>조회수</strong></td>
          <td>{summary.views || 0}</td>
        </tr>

        </tbody>
      </table>



      {/* 본문 */}
      <div className="contentBox">{summary.content}</div>

      {/* 좋아요 버튼 */}
      <button
  className="likeButton"
  onClick={() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("로그인 후 좋아요 가능합니다!");
      return;
    }

    const alreadyLiked = summary.likedUsers?.includes(user.id);

    let updatedLikes;
    let updatedUsers;

    if (alreadyLiked) {
      // 좋아요 취소
      updatedLikes = (summary.likes || 0) - 1;
      updatedUsers = summary.likedUsers.filter(uid => uid !== user.id);
    } else {
      // 좋아요 추가
      updatedLikes = (summary.likes || 0) + 1;
      updatedUsers = [...(summary.likedUsers || []), user.id];
    }

    // 프론트 반영
    setSummary({ ...summary, likes: updatedLikes, likedUsers: updatedUsers });

    // 서버 반영
    http.patch(`/summaries/${id}`, { 
      likes: updatedLikes,
      likedUsers: updatedUsers
    }).catch(err => console.error("좋아요 저장 실패:", err));
  }}
>
  ❤️ {summary.likes || 0}
</button>


      {/* 댓글 입력 */}
      <div className="commentBox">
        <textarea
          rows="3"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="commentInput"
          placeholder="댓글을 입력하세요"
        />
        <button onClick={handleAddComment} className="commentButton">
          등록
        </button>
      </div>

      {/* 댓글 목록 */}
      <div>
        <h4 className="commentTitle">댓글</h4>
        {comments.length === 0 ? (
          <p>댓글이 없습니다.</p>
        ) : (
          comments.map((c, i) => (
            <div key={i} className="commentItem">
              <p className="commentAuthor">{c.author || "익명"}</p>
              <p className="commentText">{c.text}</p>
              <span className="commentDate">{c.date}</span>
            </div>
          ))
        )}
      </div>

      {/* 목록 버튼 */}
      <div style={{ marginTop: "30px" ,  textAlign: "right"}}>
        <Link to="/summary" className="button">
          목록보기
        </Link>
      </div>
    </div>
  );
};

export default SummaryDetailPage;
