// src/page/MyPageEdit.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import MyPageLayout from "../component/MyPageLayout";
import { http } from "../api/axios";
import {
  FormWrapper, Title, Input, Button,
  LinkText, FieldRow, Select
} from "../styles/common";
import { Eye, EyeOff } from "lucide-react";

// 공용 DateSelect: 초기값 적용 + 동기화
function DateSelect({ value, onChange }) {
  const init = useMemo(() => {
    if (!value) return { y: "", m: "", d: "" };
    const m = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    return m ? { y: m[1], m: m[2], d: m[3] } : { y: "", m: "", d: "" };
  }, [value]);

  const [year, setYear] = useState(init.y);
  const [month, setMonth] = useState(init.m);
  const [day, setDay] = useState(init.d);

  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
  const daysInMonth = (y, m) => (!y || !m ? 31 : new Date(Number(y), Number(m), 0).getDate());

  const emit = (y, m, d) => {
    if (y && m && d) onChange(`${y}-${m}-${d}`);
    else onChange("");
  };

  const onChangeY = (v) => { setYear(v); setDay(""); emit(v, month, ""); };
  const onChangeM = (v) => { setMonth(v); setDay(""); emit(year, v, ""); };
  const onChangeD = (v) => { setDay(v); emit(year, month, v); };

  useEffect(() => {
    const m = (value || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (m) { setYear(m[1]); setMonth(m[2]); setDay(m[3]); }
  }, [value]);

  return (
    <FieldRow>
      <Select value={year} onChange={(e) => onChangeY(e.target.value)}>
        <option value="">년</option>
        {years.map((y) => (<option key={y} value={y}>{y}</option>))}
      </Select>
      <Select value={month} onChange={(e) => onChangeM(e.target.value)} disabled={!year}>
        <option value="">월</option>
        {months.map((m) => (<option key={m} value={m}>{m}</option>))}
      </Select>
      <Select value={day} onChange={(e) => onChangeD(e.target.value)} disabled={!year || !month}>
        <option value="">일</option>
        {Array.from({ length: daysInMonth(year, month) }, (_, i) => String(i + 1).padStart(2, "0"))
          .map((d) => (<option key={d} value={d}>{d}</option>))}
      </Select>
    </FieldRow>
  );
}

export default function MyPageEdit() {
  const stored = (() => {
    try { return JSON.parse(localStorage.getItem("user") || "{}"); }
    catch { return {}; }
  })();

  const userId =
    stored.userId ?? stored.id ?? stored.userSeq ?? stored.seq ?? stored.uid ?? "";

  const [name, setName] = useState(stored.name || "");
  const [email, setEmail] = useState(stored.email || "");
  const [birth, setBirth] = useState(stored.birth || stored.birthday || ""); // "YYYY-MM-DD"
  const [newPw, setNewPw] = useState("");     // 새 비밀번호(선택)
  const [newPw2, setNewPw2] = useState("");   // 새 비밀번호 확인
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 초기 프로필 로딩
  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;
      try {
        const { data } = await http.get(`/api/v1/users/${userId}`);
        setName(data?.name ?? "");
        setEmail(data?.email ?? "");
        setBirth(data?.birthday ?? "");
      } catch (err) {
        console.error("프로필 불러오기 실패:", err?.response?.data || err);
      }
    };
    fetchProfile();
  }, [userId]);

  const submit = async (e) => {
    e.preventDefault();

    if (!name) {
      alert("이름은 필수입니다.");
      return;
    }
    // 이메일 형식/중복 검증 제거 요청 → 아무 문자열도 허용
    // 비번 변경 시 확인 일치 체크만 수행
    if (newPw && newPw !== newPw2) {
      alert("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      setLoading(true);

      // 백엔드로 보낼 페이로드
      // - 새 비번이 있으면 newPasswd 포함 (없으면 생략)
      const payload = {
        name,
        email,                // 어떤 문자열이든 허용 (type="text" 로 입력 제한 없음)
        birthday: birth || "",
        ...(newPw ? { newPasswd: newPw } : {}),
      };

      const { data: saved } = await http.put(
        `/api/v1/users/update/${userId}`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      // 로컬 갱신
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...stored,
          userId: saved.userId ?? userId,
          name: saved.name,
          email: saved.email,
          birth: saved.birthday,
          birthday: saved.birthday,
        })
      );

      alert("저장되었습니다.");
      navigate("/mypage", { replace: true });
    } catch (err) {
      console.error("저장 실패:", err?.response?.data || err);
      const msg = err?.response?.data?.message || err?.response?.data?.error || "저장 중 오류가 발생했습니다.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MyPageLayout>
      <FormWrapper as="form" onSubmit={submit} style={{ width: 520 }}>
        <Title>회원정보 수정</Title>

        {/* 이름 */}
        <div>
          <label style={{ fontSize: 15 }}>이름</label>
          <Input
            type="text"
            placeholder="이름을 입력해 주세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              backgroundColor: "#F7F7FB",
              height: "15px",
              border: "none",
              marginTop: 6,
              fontSize: 13
            }}
            required
          />
        </div>

        {/* 이메일 (형식 검증 제거: type="text") */}
        <div>
          <label style={{ fontSize: 15 }}>이메일</label>
          <Input
            type="text"
            placeholder="이메일을 입력해 주세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              backgroundColor: "#F7F7FB",
              height: "15px",
              border: "none",
              marginTop: 10,
              fontSize: 13
            }}
            required
          />
        </div>

        {/* 새 비밀번호(선택) */}
        <div style={{ position: "relative", width: "100%" }}>
          <label style={{ fontSize: 15 }}>새 비밀번호 (선택)</label>
          <Input
            type={showPw ? "text" : "password"}
            placeholder="변경 시에만 입력해 주세요"
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
            style={{
              backgroundColor: "#F7F7FB",
              height: "15px",
              border: "none",
              marginTop: 10,
              fontSize: 13
            }}
          />
          <button
            type="button"
            onClick={() => setShowPw(p => !p)}
            aria-label={showPw ? "비밀번호 숨기기" : "비밀번호 보기"}
            style={{
              position: "absolute", right: 8, top: "58%",
              transform: "translateY(-50%)",
              background: "transparent", border: "none",
              cursor: "pointer", padding: 0, lineHeight: 0
            }}
          >
            {showPw ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        </div>

        {/* 새 비밀번호 확인(선택) */}
        <div style={{ position: "relative", width: "100%" }}>
          <label style={{ fontSize: 15 }}>새 비밀번호 확인</label>
          <Input
            type={showPw2 ? "text" : "password"}
            placeholder="변경 시에만 입력해 주세요"
            value={newPw2}
            onChange={(e) => setNewPw2(e.target.value)}
            style={{
              backgroundColor: "#F7F7FB",
              height: "15px",
              border: "none",
              marginTop: 10,
              fontSize: 13
            }}
          />
          <button
            type="button"
            onClick={() => setShowPw2(p => !p)}
            aria-label={showPw2 ? "비밀번호 숨기기" : "비밀번호 보기"}
            style={{
              position: "absolute", right: 8, top: "58%",
              transform: "translateY(-50%)",
              background: "transparent", border: "none",
              cursor: "pointer", padding: 0, lineHeight: 0
            }}
          >
            {showPw2 ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        </div>

        {/* 생년월일 */}
        <div>
          <label style={{ fontSize: 15 }}>생년월일</label>
          <DateSelect value={birth} onChange={setBirth} />
        </div>

        <Button type="submit" disabled={loading} style={{ fontSize: 15 }}>
          {loading ? "저장 중..." : "저장"}
        </Button>

        <LinkText>
          <Link to="/mypage">돌아가기</Link>
        </LinkText>
      </FormWrapper>
    </MyPageLayout>
  );
}
