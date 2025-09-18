// src/component/FortuneWidget.jsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { http } from "../api/axios";
import { CalendarDays, Sparkles, RefreshCcw, AlertCircle } from "lucide-react";

const Card = styled.section`
  position: relative;
  border-radius: 20px;
  padding: 18px 20px;
  overflow: hidden;
  backdrop-filter: blur(12px);
  background:
    radial-gradient(1200px 300px at -10% -20%, rgba(255, 104, 165, 0.25), transparent 60%),
    radial-gradient(800px 260px at 120% 0%, rgba(103, 232, 249, 0.22), transparent 60%),
    rgba(255, 255, 255, 0.28);
  border: 1px solid rgba(255, 255, 255, 0.24);
  box-shadow: 0 12px 34px rgba(0, 0, 0, 0.15);
`;

const Header = styled.div`
  display: flex; align-items: center; gap: 10px; margin-bottom: 10px;
  h3 { margin: 0; font-size: 18px; font-weight: 900; letter-spacing: .2px; }
  .badge {
    margin-left: auto; display: inline-flex; align-items: center; gap: 6px;
    font-size: 12px; padding: 6px 10px; border-radius: 999px;
    background: rgba(0,0,0,0.08); border: 1px solid rgba(255,255,255,0.45);
    backdrop-filter: blur(6px); opacity: .9;
  }
  .refresh {
    margin-left: 8px; border: 0; background: rgba(255,255,255,.55);
    border: 1px solid rgba(0,0,0,.06); border-radius: 10px; padding: 6px 8px;
    cursor: pointer; display: inline-flex; align-items: center; gap: 6px;
    font-size: 12px; transition: transform .1s ease, background .2s ease;
  }
  .refresh:hover { background: rgba(255,255,255,.75); }
  .refresh:active { transform: translateY(1px); }
`;

const Title = styled.div` font-size: 22px; font-weight: 900; line-height: 1.2; margin: 2px 0 6px; `;
const Summary = styled.p` margin: 0; line-height: 1.55; font-size: 14px; opacity: .95; `;
const Empty = styled.div` display: grid; place-items: center; padding: 22px 10px; color: rgba(0,0,0,.65); font-size: 14px; `;
const ErrorWrap = styled(Empty)` color: #b42318; background: rgba(244,63,94,.06); border: 1px dashed rgba(244,63,94,.3); border-radius: 14px; `;
const KeyBox = styled.div`
  margin-top: 14px; border-radius: 14px; padding: 12px 14px;
  background: rgba(255,255,255,.6); border: 1px solid rgba(0,0,0,.06);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.55);
  small { display: inline-flex; align-items: center; gap: 6px; font-weight: 800; opacity: .75; }
  div { margin-top: 6px; font-size: 14px; }
`;

export default function FortuneWidget() {
  const [loading, setLoading] = useState(false);
  const [fortune, setFortune] = useState(null); // { title, date, summary, keyPoint }
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const birthday = user.birthday || user.birth || ""; // "YYYY-MM-DD"

  const fetchFortune = async () => {
    if (!birthday) {
      setError("생년월일 정보가 없습니다. 마이페이지에서 등록해 주세요.");
      setFortune(null);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const { data } = await http.get(`/api/v1/fortune/${encodeURIComponent(birthday)}`);
      setFortune(data);
    } catch (e) {
      console.error("fortune error", e?.response?.data || e);
      setError("운세를 불러오는 데 실패했어요.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFortune();
    // birthday가 바뀌면 자동 갱신
  }, [birthday]); // eslint-disable-line react-hooks/exhaustive-deps

  // UI
  if (loading) {
    return (
      <Card>
        <Header>
          <Sparkles size={16} />
          <h3>오늘의 운세</h3>
          <span className="badge"><CalendarDays size={14}/> 로딩 중…</span>
        </Header>
        <Empty>잠시만요, 좋은 기운 모으는 중… ✨</Empty>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <Header>
          <Sparkles size={16} />
          <h3>오늘의 운세</h3>
          <button className="refresh" onClick={fetchFortune}>
            <RefreshCcw size={14}/> 다시 시도
          </button>
        </Header>
        <ErrorWrap><AlertCircle size={16}/> {error}</ErrorWrap>
      </Card>
    );
  }

  if (!fortune) {
    return (
      <Card>
        <Header>
          <Sparkles size={16} />
          <h3>오늘의 운세</h3>
          <button className="refresh" onClick={fetchFortune}>
            <RefreshCcw size={14}/> 불러오기
          </button>
        </Header>
        <Empty>버튼을 눌러 오늘의 운세를 받아보세요 ✨</Empty>
      </Card>
    );
  }

  const { title, date, summary, keyPoint } = fortune;

  return (
    <Card>
      <Header>
        <Sparkles size={16} />
        <h3>오늘의 운세</h3>
        {date && (
          <span className="badge">
            <CalendarDays birthday size={14} />
            {date}
          </span>
        )}
        <button className="refresh" onClick={fetchFortune}>
          <RefreshCcw size={14}/> 새로고침
        </button>
      </Header>

      <Title>{title || "좋은 하루가 될 징조"}</Title>
      {summary && <Summary>{summary}</Summary>}

      {keyPoint && (
        <KeyBox>
          <small>키포인트</small>
          <div>{keyPoint}</div>
        </KeyBox>
      )}
    </Card>
  );
}
