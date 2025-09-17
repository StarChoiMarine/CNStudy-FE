import React, { useEffect, useMemo, useState } from "react";
import Header from "../component/Header";
import { Container, FormWrapper, Title, Button } from "../styles/common";
import { http } from "../api/axios";
import { Link } from "react-router-dom";
import MyPageLayout from "../component/MyPageLayout";


export default function MyLikesPage() {
  const me = JSON.parse(localStorage.getItem("user"));
  const [summaries, setSummaries] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await http.get("/summaries");
        setSummaries(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("좋아요 글 불러오기 오류:", err);
      }
    })();
  }, []);

  // 👉 내가 좋아요한 글만 필터링
  const likedSummaries = useMemo(() => {
    const myId = me?.id;
    if (!myId) return [];
    return summaries
      .filter((s) => Array.isArray(s.likedUsers) && s.likedUsers.includes(myId))
      .sort((a, b) => Number(b.id) - Number(a.id));
  }, [summaries, me]);

  return (
    <>
      <MyPageLayout>
        <FormWrapper style={{ width: 1000 }}>
          <Title>내가 좋아요 한 글</Title>

          {likedSummaries.length === 0 ? (
            <div style={{ padding: "40px 0", textAlign: "center", color: "#777" }}>
              아직 좋아요 한 글이 없습니다.
              <div style={{ marginTop: 16 }}>
                <Link to="/summary">
                  <Button style={{ width: "auto", padding: "8px 16px" }}>
                    글 보러가기
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #ddd" }}>
                  <th style={{ padding: 10, width: 80 }}>번호</th>
                  <th style={{ padding: 10, textAlign: "left" }}>제목</th>
                  <th style={{ padding: 10, width: 140 }}>날짜</th>
                  <th style={{ padding: 10, width: 100 }}>조회수</th>
                  <th style={{ padding: 10, width: 100 }}>좋아요</th>
                </tr>
              </thead>
              <tbody>
                {likedSummaries.map((s, idx) => (
                  <tr key={s.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ textAlign: "center", padding: 8 }}>
                      {likedSummaries.length - idx}
                    </td>
                    <td style={{ textAlign: "left", padding: 8 }}>
                      <Link to={`/summary/${s.id}`} style={{ color: "#333" }}>
                        {s.title}
                      </Link>
                    </td>
                    <td style={{ textAlign: "center", padding: 8 }}>{s.date}</td>
                    <td style={{ textAlign: "center", padding: 8 }}>{s.views ?? 0}</td>
                    <td style={{ textAlign: "center", padding: 8 }}>{s.likes ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </FormWrapper>
      </MyPageLayout>
    </>
  );
}
