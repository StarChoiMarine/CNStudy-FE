// src/page/MyPageEdit.jsx
import React, { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import MyPageLayout from "../component/MyPageLayout";
import { http } from "../api/axios";
import {
  Container, FormWrapper, Title, Input, Button,
  LinkText, FieldRow, Select
} from "../styles/common";
import { Eye, EyeOff } from "lucide-react";

// 공용 DateSelect: 회원가입과 동일 로직 + 초기값 적용 가능
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
  const daysInMonth = (y, m) => {
    if (!y || !m) return 31;
    return new Date(Number(y), Number(m), 0).getDate();
  };

  const emit = (y, m, d) => {
    if (y && m && d) onChange(`${y}-${m}-${d}`);
    else onChange("");
  };

  const onChangeY = (v) => {
    setYear(v);
    setDay("");
    emit(v, month, "");
  };

  const onChangeM = (v) => {
    setMonth(v);
    setDay("");
    emit(year, v, "");
  };

  const onChangeD = (v) => {
    setDay(v);
    emit(year, month, v);
  };

  return (
    <FieldRow>
      <Select value={year} onChange={(e) => onChangeY(e.target.value)}>
        <option value="">년</option>
        {years.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </Select>

      <Select
        value={month}
        onChange={(e) => onChangeM(e.target.value)}
        disabled={!year}
      >
        <option value="">월</option>
        {months.map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </Select>

      <Select
        value={day}
        onChange={(e) => onChangeD(e.target.value)}
        disabled={!year || !month}
      >
        <option value="">일</option>
        {Array.from({ length: daysInMonth(year, month) }, (_, i) =>
          String(i + 1).padStart(2, "0")
        ).map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </Select>
    </FieldRow>
  );
}

export default function MyPageEdit() {
  const me = JSON.parse(localStorage.getItem("user")) || {
    id: "", name: "", email: "", birth: "", passwd: ""
  };

  const [name, setName] = useState(me.name || "");
  const [email, setEmail] = useState(me.email || "");
  const [birth, setBirth] = useState(me.birth || "");
  const [passwd, setPasswd] = useState("");       // 새 비밀번호 (선택)
  const [pass2, setPass2] = useState("");         // 새 비밀번호 확인
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      alert("이름과 이메일은 필수입니다.");
      return;
    }
    if (passwd && passwd !== pass2) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      setLoading(true);

      // 이메일 중복 체크 (본인 제외)
      const { data: dup } = await http.get("/users", { params: { email } });
      const duplicated = Array.isArray(dup) && dup.some(u => String(u.id) !== String(me.id));
      if (duplicated) {
        alert("이미 사용 중인 이메일입니다.");
        return;
      }

      // PATCH 데이터 구성
      const payload = { name, email, birth };
      if (passwd) payload.passwd = passwd;

      // 저장
      const { data: saved } = await http.patch(`/users/${me.id}`, payload);

      // localStorage 갱신
      localStorage.setItem("user", JSON.stringify(saved));

      alert("저장되었습니다.");
      navigate("/mypage", { replace: true });
    } catch (err) {
      console.error(err);
      alert("저장 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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

          {/* 이메일 */}
          <div>
            <label style={{ fontSize: 15 }}>이메일</label>
            <Input
              type="email"
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

          {/* 비밀번호(선택) */}
          <div style={{ position: "relative", width: "100%" }}>
            <label style={{ fontSize: 15 }}>새 비밀번호 (선택)</label>
            <Input
              type={showPw ? "text" : "password"}
              placeholder="변경 시에만 입력해 주세요"
              value={passwd}
              onChange={(e) => setPasswd(e.target.value)}
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

          {/* 비밀번호 확인(선택) */}
          <div style={{ position: "relative", width: "100%" }}>
            <label style={{ fontSize: 15 }}>새 비밀번호 확인</label>
            <Input
              type={showPw2 ? "text" : "password"}
              placeholder="변경 시에만 입력해 주세요"
              value={pass2}
              onChange={(e) => setPass2(e.target.value)}
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
    </>
  );
}
