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
  align-items: end;
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
  margin-top: ${({$lower}) => ($lower ? "20px" : "0")};
  border-radius: 50%;
  display: grid;
  place-items: center;
  border: 3px solid ${({$placeholder}) => ($placeholder ? "#d7d6dd" : "#ff6aa5")};
  background: #eceaf3;
  overflow: hidden;
  img { width: 100%; height: 100%; object-fit: cover; }
`;
const MedalInfo = styled.div`
  text-align: center;
  line-height: 1.2;
  margin-top: ${({$lower}) => ($lower ? "15px" : "0")};
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
  width: 32px; height: 32px; border-radius: 50%;
  background: #eceaf3; border: 2px solid #ff6aa5; overflow: hidden;
  img { width: 100%; height: 100%; object-fit: cover; }
`;
const Rank = styled.span` font-size:20px; font-weight: 800; width: 28px; text-align:center; `;
const Name = styled.span` font-size:20px; font-weight: 700; `;
const Count = styled.span` font-size:20px; font-variant-numeric: tabular-nums; opacity: .8; `;
const EmptyHint = styled.div` opacity:.7; padding: 8px 2px; `;

/* ============ helpers ============ */
function sortByScore(a, b) {
  if ((b.score ?? 0) !== (a.score ?? 0)) return (b.score ?? 0) - (a.score ?? 0);
  if ((b.postCount ?? 0) !== (a.postCount ?? 0)) return (b.postCount ?? 0) - (a.postCount ?? 0);
  if ((b.commentCount ?? 0) !== (a.commentCount ?? 0)) return (b.commentCount ?? 0) - (a.commentCount ?? 0);
  return String(a.userName || "").localeCompare(String(b.userName || ""));
}
const assignRanks = (arr) => arr.map((x, i) => ({ ...x, rank: i + 1 }));



/* ============ component ============ */
export default function LeaderBoard() {
  const [leaders, setLeaders] = useState([]);  
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    (async () => {
      try {
        
        // 백엔드: GET /api/v1/rank/leaderboard?size=10
        const res = await http.get("/api/v1/rank/leaderboard", { params: { size: 10 } });
        const data = Array.isArray(res.data) ? res.data : [];
      


        const sorted = [...data].sort(sortByScore);
        setLeaders(assignRanks(sorted));
      } catch (e) {
        console.error("leaderboard fetch error", e?.response?.data || e);
        setLeaders([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Top3 + 나머지(최대 10위까지)
  const paddedTop3 = useMemo(() => {
    const top3 = leaders.slice(0, 3);
    return Array.from({ length: 3 }, (_, i) => top3[i] ?? { rank: i + 1, userName: "없음", postCount: 0, placeholder: true });
  }, [leaders]);

  const rest = useMemo(() => leaders.slice(3, 10), [leaders]);

  return (
    <Wrap>
      <Title>사용자 순위</Title>

      {loading ? (
        <div>불러오는 중…</div>
      ) : (
        <>
          {/* Top3 (1등 중앙, 2등 왼쪽, 3등 오른쪽) */}
          <Top3>
            {/* 2등 */}
            <MedalCard $placeholder={paddedTop3[1].placeholder} $lower>
              <Avatar $lower $placeholder={paddedTop3[1].placeholder}>
                <img src={userIcon} alt="user" />
              </Avatar>
              <MedalInfo>
                <div><b>2등</b></div>
                <div>{paddedTop3[1].userName}</div>
                <small>({paddedTop3[1].score}점)</small>
              </MedalInfo>
            </MedalCard>

            {/* 1등 */}
            <MedalCard $placeholder={paddedTop3[0].placeholder}>
              <StarRow>★ ★ ★</StarRow>
              <Avatar $big $placeholder={paddedTop3[0].placeholder}>
                <img src={userIcon} alt="user" />
              </Avatar>
              <MedalInfo $lower $bigger>
                <div><b>1등</b></div>
                <div>{paddedTop3[0].userName}</div>
                <small>({paddedTop3[0].score}점)</small>
              </MedalInfo>
            </MedalCard>

            {/* 3등 */}
            <MedalCard $placeholder={paddedTop3[2].placeholder}>
              <Avatar $lower $placeholder={paddedTop3[2].placeholder}>
                <img src={userIcon} alt="user" />
              </Avatar>
              <MedalInfo>
                <div><b>3등</b></div>
                <div>{paddedTop3[2].userName}</div>
                <small>({paddedTop3[2].score}점)</small>
              </MedalInfo>
            </MedalCard>
          </Top3>

          {/* 4등 이후 */}
          <List>
            {rest.length === 0 ? (
              <EmptyHint>추가 순위가 아직 없어요.</EmptyHint>
            ) : (
              rest.map((u) => (
                <Row key={u.userId ?? u.userName}>
                  <Rank>{u.rank}</Rank>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <SmallAvatar><img src={userIcon} alt="user" /></SmallAvatar>
                    <Name>{u.userName}</Name>
                  </div>
                  <Count>{u.score}점</Count>
                </Row>
              ))
            )}
          </List>
        </>
      )}
    </Wrap>
  );
}
