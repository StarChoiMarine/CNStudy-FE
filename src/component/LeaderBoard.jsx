// src/component/LeaderBoard.jsx
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { http } from "../api/axios";
import userIcon from "../styles/images/usericon.png";

/* ============ styled ============ */


const Wrap = styled.section`
  backdrop-filter: blur(10px);
  background: rgba(255,255,255,0.28);
  border: 1px solid rgba(255,255,255,0.22);
  border-radius: 18px;
  box-shadow: 0 10px 28px rgba(0,0,0,0.12);
  padding: 18px 22px;
`;

const Title = styled.h3`
  margin: 0 0 14px;
  font-size: 22px;
  font-weight: 800;
  text-align: center;
`;

const Top3 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  justify-items: center;
  align-items: end; /* 2,3등은 아래쪽 정렬 */
  gap: 12px;
  margin-bottom: 10px;
`;

const MedalCard = styled.div`
  font-size: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  opacity: ${({$placeholder}) => ($placeholder ? .6 : 1)};
`;

const StarRow = styled.div`
  color: #ff6aa5;
  font-size: 20px;
  letter-spacing: 2px;
  height: 16px;
`;

const Avatar = styled.div`
  width: ${({$big}) => ($big ? "88px" : "68px")};
  height: ${({$big}) => ($big ? "88px" : "68px")};
  margin-top: ${({$lower}) => ($lower ? "20px" : "0")}; /* 2,3등 살짝 내려감 */
  border-radius: 50%;
  display: grid;
  place-items: center;
  border: 3px solid ${({$placeholder}) => ($placeholder ? "#d7d6dd" : "#ff6aa5")};
  background: #eceaf3;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const MedalInfo = styled.div`
  text-align: center;
  line-height: 1.2;
  margin-top: ${({$lower}) => ($lower ? "15px" : "0")}; /* 2,3등 살짝 내려감 */
  font-size: ${({$bigger}) => ($bigger ? "24px" : "20px")};
  small { display:block; opacity:.7; }
  b { font-weight:900; }
  gap: 6px;
`;

const List = styled.div`
  margin-top: 6px;
  display: grid;
  gap: 8px;
  min-height: 120px;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 28px 1fr auto;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 12px;
`;

const SmallAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #eceaf3;
  border: 2px solid #ff6aa5;
  overflow: hidden;
  img { width: 100%; height: 100%; object-fit: cover; }
`;
const Rank = styled.span` font-size:20px; font-weight: 800; width: 28px; text-align:center; `;
const Name = styled.span` font-size:20px; font-weight: 700; `;
const Count = styled.span` font-size:20px; font-variant-numeric: tabular-nums; opacity: .8; `;
const EmptyHint = styled.div` opacity:.7; padding: 8px 2px; `;

/* ============ helpers ============ */
function sortRanking(a, b) {
  if (b.count !== a.count) return b.count - a.count;
  if ((b.likes ?? 0) !== (a.likes ?? 0)) return (b.likes ?? 0) - (a.likes ?? 0);
  const dA = a.latest ? +new Date(a.latest) : 0;
  const dB = b.latest ? +new Date(b.latest) : 0;
  return dB - dA;
}
function assignRanks(arr){ return arr.map((x,i)=>({...x, rank:i+1})); }

/* ============ component ============ */
export default function LeaderBoard() {
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async() => {
      try {
        const res = await http.get("/summaries");
        setSummaries(res.data || []);
      } catch(e) {
        console.error("leaderboard fetch error", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const ranking = useMemo(() => {
    const byAuthor = new Map();
    for (const s of summaries) {
      const key = s.author ?? "알 수 없음";
      const prev = byAuthor.get(key) || { name:key, count:0, likes:0, latest:null };
      prev.count += 1;
      prev.likes += s.likes ?? 0;
      if (!prev.latest || new Date(s.date) > new Date(prev.latest)) prev.latest = s.date;
      byAuthor.set(key, prev);
    }
    return assignRanks(Array.from(byAuthor.values()).sort(sortRanking));
  }, [summaries]);

  // 항상 3칸 고정
  const paddedTop3 = Array.from({ length: 3 }, (_, i) => {
    const item = ranking[i];
    return item ?? { rank: i+1, name: "없음", count: 0, placeholder: true };
  });

  const rest = ranking.slice(3, 10);

  return (
    <Wrap>
      <Title>사용자 순위</Title>

      {loading ? (
        <div>불러오는 중…</div>
      ) : (
        <>
          {/* Top3 (1등은 중앙, 2등 왼쪽, 3등 오른쪽) */}
          <Top3>
            {/* 2등 */}
            <MedalCard $placeholder={paddedTop3[1].placeholder} $lower>
              <Avatar $lower><img src={userIcon} alt="user"/></Avatar>
              <MedalInfo >
                <div><b>2등</b></div>
                <div>{paddedTop3[1].name}</div>
                <small>({paddedTop3[1].count}개)</small>
              </MedalInfo>
            </MedalCard>

            {/* 1등 (중앙, 크게) */}
            <MedalCard $placeholder={paddedTop3[0].placeholder}>
              <StarRow>★ ★ ★</StarRow>
              <Avatar $big ><img src={userIcon} alt="user"/></Avatar>
              <MedalInfo $lower $bigger>
                <div><b>1등</b></div>
                <div>{paddedTop3[0].name}</div>
                <small>({paddedTop3[0].count}개)</small>
              </MedalInfo>
            </MedalCard>

            {/* 3등 */}
            <MedalCard $placeholder={paddedTop3[2].placeholder}>
              <Avatar $lower><img src={userIcon} alt="user"/></Avatar>
              <MedalInfo >
                <div><b>3등</b></div>
                <div>{paddedTop3[2].name}</div>
                <small>({paddedTop3[2].count}개)</small>
              </MedalInfo>
            </MedalCard>
          </Top3>

          {/* 4등 이후 */}
          <List>
            {rest.length === 0 ? (
              <EmptyHint>추가 순위가 아직 없어요.</EmptyHint>
            ) : (
              rest.slice(0,3).map(u => (
                <Row key={u.name}>
                  <Rank>{u.rank} </Rank>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <SmallAvatar><img src={userIcon} alt="user"/></SmallAvatar>
                    <Name>{u.name}</Name>
                  </div>
                  <Count>{u.count}개</Count>
                </Row>
              ))
            )}
          </List>
        </>
      )}
    </Wrap>
  );
}
