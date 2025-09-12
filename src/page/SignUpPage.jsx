// src/page/SignUpPage.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { http } from "../api/axios"; // 경로: src/page → src/api/axios.js
import { Container, FormWrapper, Title, Input, Button, LinkText } from "../styles/common";


const SignUpPage = () => {
  const [name, setName] = useState("");
  const [birth, setBirth] = useState("");
  const [email, setEmail] = useState("");
  const [passwd, setPasswd] = useState("");
  const [confirmPasswd, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !birth || !email || !passwd || !confirmPasswd) {
      alert("모든 항목을 입력해 주세요.");
      return;
    }
    if (passwd !== confirmPasswd) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      setLoading(true);

      // 1) 이메일 중복 체크
      const { data: existed } = await http.get("/users", { params: { email } });
      if (Array.isArray(existed) && existed.length > 0) {
        alert("이미 가입된 이메일입니다.");
        return;
      }

      // 2) 회원 저장 (json-server: POST /users)
      await http.post("/users", { name, birth, email, passwd });

      alert("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
      navigate("/login", { replace: true });
    } catch (err) {
      console.error(err);
      alert("회원가입 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <FormWrapper>
        <Title>회원가입</Title>

        <Input
          type="text"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          type="password"
          placeholder="비밀번호"
          value={passwd}
          onChange={(e) => setPasswd(e.target.value)}
          required
        />

        <Input
          type="password"
          placeholder="비밀번호 확인"
          value={confirmPasswd}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />

        <Input
          type="date"
          placeholder="생년월일"
          value={birth}
          onChange={(e) => setBirth(e.target.value)}
          required
        />

        <Button type="button" onClick={handleSubmit} disabled={loading}>
          {loading ? "처리 중..." : "가입하기"}
        </Button>

        <LinkText>
          이미 회원이신가요? <Link to="/login">로그인</Link>
        </LinkText>
      </FormWrapper>
    </Container>
  );
};

export default SignUpPage;
