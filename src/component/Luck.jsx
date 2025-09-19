import React, { useEffect, useState } from "react";

export default function Luck({
  name = "게스트",
  birth = "1997-09-04",
  mock = true,   // 테스트할 땐 true, 실제 API 연결 시 false
  style = {},
}) {
  const [text, setText] = useState("운세 받아와서 로드하기");
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        if (mock) {
          await new Promise((r) => setTimeout(r, 500));
          if (alive)
            setText(`오늘은 집중력 상승! ${name}님, 중요한 일 먼저 처리해보자 😊`);
        } else {
          // 실제 API 연동 자리
          // const { data } = await http.post("/fortune", { name, birth });
          // if (alive) setText(data.message);
        }
      } catch (e) {
        console.error(e);
        if (alive) setErr("운세를 불러오지 못했어요.");
      }
    })();

    return () => {
      alive = false;
    };
  }, [name, birth, mock]);

  const pillStyle = {
    alignSelf: "flex-start",
    maxWidth: "560px",
    width: "min(100%, 560px)",
    padding: "10px 14px",
    borderRadius: "999px", // 알약형
    background: "rgba(255,255,255,0.82)",
    border: "1px solid rgba(255,255,255,0.25)",
    backdropFilter: "blur(8px)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
    color: "#333",
    fontSize: 14,
    lineHeight: 1.5,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    ...style,
  };

  return <div style={pillStyle}>{err ? err : text}</div>;
}
