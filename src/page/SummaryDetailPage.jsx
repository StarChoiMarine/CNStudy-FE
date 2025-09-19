import React, { useEffect, useState } from "react";
import { useParams, Link, } from "react-router-dom";
import { http } from "../api/axios";
import "../styles/SummaryDetailPage.css";
import Header from "../component/Header";
import { Button } from "../styles/common";
import { useNavigate } from "react-router-dom";




const SummaryDetailPage = () => {
  const { id } = useParams(); 
  const [summary, setSummary] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [likedByMe, setLikedByMe] = useState(false);
  const [likeBusy, setLikeBusy] = useState(false);

  const navigate = useNavigate();
  const { id: routeId } = useParams(); // /summary/:id 라우트라고 가정



// 상세 로딩(setSummary) 이후, 또는 id 바뀔 때 liked 상태 복원
useEffect(() => {
  try {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const userId =
      storedUser.userId ?? storedUser.id ?? storedUser.userSeq ?? storedUser.seq ?? storedUser.uid;
    const boardId = summary?.boardId ?? summary?.id ?? id;
    if (userId && boardId) {
      const key = `liked:${boardId}:${userId}`;
      setLikedByMe(localStorage.getItem(key) === "1");
    } else {
      setLikedByMe(false);
    }
  } catch {
    setLikedByMe(false);
  }
  // summary, id 중 하나라도 바뀌면 다시 계산
}, [summary, id]);




useEffect(() => {
  const fetchComments = async (boardId) => {
    try {
      // GET /api/v1/comments/list/{boardId}
      const { data } = await http.get(`/api/v1/comments/list/${boardId}`);
      // CommentResponseData 안에 리스트가 어느 키로 들어올지 방어적으로 처리
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data.comments)
        ? data.comments
        : Array.isArray(data.commentList)
        ? data.commentList
        : Array.isArray(data.items)
        ? data.items
        : [];

      setComments(
        list.map((c) => ({
          // 화면은 기존 author/text/date 필드 사용
          id: c.commentId,
          userId: c.userId,
          author: c.userName,
          text: c.content,
          date: c.createdAt, // "yyyy-MM-dd"
        }))
      );
    } catch (err) {
      console.error("댓글 로딩 실패:", err?.response?.data || err);
      setComments([]);
    }
  };

  const fetchData = async () => {
    try {
      // ✅ 게시글 상세 (조회 시 viewCount는 서버에서 증가됨)
      const { data } = await http.get(`/api/v1/boards/read/${id}`);

      // 서버 BoardResponseDTO -> 화면 상태로 매핑
      setSummary({
        id: data.boardId,                         // 기존 코드에서 summary.id 쓰면 대비
        boardId: data.boardId,
        title: data.title,
        url: data.url,
        author: data.name ?? "알 수 없음",
        date: data.createdAt,                     // "yyyy-MM-dd"
        category: data.category || "기타",
        views: data.viewCount ?? 0,
        likes: data.likeCount ?? 0,
        content: data.content,
        hashtags: Array.isArray(data.hashtags) ? data.hashtags : [],
      });

      // ✅ 댓글 로딩
      await fetchComments(id);
    } catch (err) {
      console.error("상세/댓글 로딩 실패:", err?.response?.data || err);
    }
  };

  fetchData();
}, [id]);

  const handleDelete = async () => {
    // summary.boardId, summary.id, 라우트 id 중 사용 가능한 값 선택
    const targetId = summary?.boardId ?? summary?.id ?? routeId;
    if (!targetId) return alert("잘못된 게시글 ID입니다.");

    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await http.delete(`/api/v1/boards/delete/${targetId}`); // baseURL이 /api/v1까지면 OK
      alert("삭제되었습니다.");
      navigate("/summary", { replace: true }); // 목록 페이지로 이동 (프로젝트 라우트에 맞춰 조정)
    } catch (err) {
      const status = err?.response?.status;
      if (status === 404) {
        alert("이미 삭제되었거나 존재하지 않는 글입니다.");
        navigate("/summary", { replace: true });
      } else if (status === 401 || status === 403) {
        alert("삭제 권한이 없습니다. 로그인 상태를 확인해 주세요.");
      } else {
        console.error("삭제 실패:", err);
        alert("삭제 중 오류가 발생했습니다.");
      }
    }
  };
const handleAddComment = async () => {
  const content = newComment.trim();
  if (!content) return;

  const raw = JSON.parse(localStorage.getItem("user")) || {};
  const userId =
    raw.userId ?? raw.id ?? raw.seq ?? raw.userSeq ?? raw.uid ?? undefined;

  if (!userId) {
    alert("로그인 후 댓글 작성이 가능합니다.");
    return;
  }

  try {
    // POST /api/v1/comments/register
    await http.post(
      `/api/v1/comments/register`,
      {
        boardId: Number(summary?.boardId ?? id),
        userId: Number(userId),
        content,
      },
      { headers: { "Content-Type": "application/json" } }
    );

    // 서버에서 201만 주는 구조이므로, 등록 후 목록 재조회
    const { data } = await http.get(`/api/v1/comments/list/${summary?.boardId ?? id}`);
    const list = Array.isArray(data)
      ? data
      : Array.isArray(data.comments)
      ? data.comments
      : Array.isArray(data.commentList)
      ? data.commentList
      : Array.isArray(data.items)
      ? data.items
      : [];
    setComments(
      list.map((c) => ({
        id: c.commentId,
        userId: c.userId,
        author: c.userName,
        text: c.content,
        date: c.createdAt,
      }))
    );

    setNewComment("");
  } catch (err) {
    console.error("댓글 등록 실패:", err?.response?.data || err);
    alert("댓글 등록 중 오류가 발생했습니다.");
  }
};



  if (!summary) return <p>로딩 중...</p>;

  return (
    <>
      <Header />
 
      <div className="summaryDetail">
        <div className="detailWrapper">
        <h2 className="title">Lecture Note</h2>

        {/* 글 정보 테이블 */}
        <table className="table">
          <tbody>
            <tr>
              <td><strong>제목</strong></td>
              <td colSpan="7">{summary.title}</td>
            </tr>
            <tr>
              <td><strong>URL</strong></td>
              <td colSpan="7">
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
              <td><strong>카테고리</strong></td>
              <td>{summary.category || "기타"}</td>
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
  disabled={likeBusy}
  onClick={async () => {
    const stored = JSON.parse(localStorage.getItem("user") || "{}");
    const userId =
      stored.userId ?? stored.id ?? stored.userSeq ?? stored.seq ?? stored.uid;
    if (!userId) {
      alert("로그인 후 좋아요 가능합니다!");
      return;
    }

    const boardId = summary.boardId ?? summary.id ?? id;
    const key = `liked:${boardId}:${userId}`;

    const tryAdd = () => http.post(`/api/v1/boards/like/${boardId}?userId=${userId}`);
    const tryDel = () => http.delete(`/api/v1/boards/like/${boardId}?userId=${userId}`);

    setLikeBusy(true);
    try {
      if (likedByMe) {
        // 보통은 취소가 맞다
        try {
          await tryDel();
          setSummary((s) => ({ ...s, likes: Math.max(0, (s.likes || 0) - 1) }));
          setLikedByMe(false);
          localStorage.removeItem(key);
        } catch (err) {
          // 서버는 이미 취소된 상태라고 보는 경우(404) → 보정: 추가 시도
          if (err?.response?.status === 404) {
            await tryAdd();
            setSummary((s) => ({ ...s, likes: (s.likes || 0) + 1 }));
            setLikedByMe(true);
            localStorage.setItem(key, "1");
          } else {
            throw err;
          }
        }
      } else {
        // 보통은 추가가 맞다
        try {
          await tryAdd();
          setSummary((s) => ({ ...s, likes: (s.likes || 0) + 1 }));
          setLikedByMe(true);
          localStorage.setItem(key, "1");
        } catch (err) {
          // 서버는 이미 좋아요 돼있다고 보는 경우(404) → 보정: 취소 시도
          if (err?.response?.status === 404) {
            await tryDel();
            setSummary((s) => ({ ...s, likes: Math.max(0, (s.likes || 0) - 1) }));
            setLikedByMe(false);
            localStorage.removeItem(key);
          } else {
            throw err;
          }
        }
      }
    } catch (err) {
      console.error("좋아요 처리 실패:", err?.response?.data || err);
      alert("좋아요 처리에 실패했습니다.");
    } finally {
      setLikeBusy(false);
    }
  }}
>
  {likedByMe ? "❤️" : "❤️"} {summary.likes || 0}
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
                <div className="commentRow">
                  <p className="commentText">{c.text}</p>
                  <span className="commentDate">{c.date}</span>
                </div>
              </div>
            ))
          )}
        </div>

     {/* 목록 버튼 */}
        <div style={{ marginTop: "30px", textAlign: "right" }}>
          <Link to="/summary">
            <Button style={{ width: "auto", padding: "10px 20px" }}>
              목록보기
            </Button>
          </Link>
          <button
              onClick={handleDelete}className="commentButton" style={{ marginLeft: "10px" }}
           >
         삭제
         </button>
    </div>

     {/* 해시태그 */}
        <div style={{ marginTop: "15px" }}>
          {summary.hashtags?.map((tag, idx) => (
            <Link
              key={idx}
              to={`/summary?tag=${encodeURIComponent(tag)}`}
              style={{
                marginRight: "8px",
                color: "#007BFF",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              #{tag}
            </Link>
          ))}
        </div>
      </div>
   </div>

    </>
  );
};

export default SummaryDetailPage;
