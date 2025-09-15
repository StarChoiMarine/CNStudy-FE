import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { http } from "../api/axios"; // 경로 확인: src/page → src/api/axios.js
import { Container, FormWrapper, Title, Input, Button, LinkText } from "../styles/common";



const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [passwd, setPasswd] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !passwd) {
      alert("이메일과 비밀번호를 모두 입력하세요.");
      return;
    }

    try {
      setLoading(true);
      // json-server: GET /users?email=...&passwd=...
      const { data } = await http.get("/users", { params: { email, passwd } });

      if (Array.isArray(data) && data.length > 0) {
        // 로그인 성공 처리 (간단 버전)
        localStorage.setItem("user", JSON.stringify(data[0]));
        // 필요시 토큰 흉내
        localStorage.setItem("accessToken", `mock.${data[0].id}`);
        alert("로그인 성공!");
        navigate("/main", { replace: true });
      } else {
        alert("이메일 또는 비밀번호가 올바르지 않습니다.");
      }
    } catch (err) {
      console.error(err);
      alert("로그인 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <FormWrapper>
        <Title>로그인</Title>

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

        <Button type="button" onClick={handleSubmit} disabled={loading}>
          {loading ? "처리 중..." : "로그인"}
        </Button>

        <LinkText>
          아직 회원이 아니신가요? <Link to="/">회원가입</Link>
        </LinkText>
      </FormWrapper>
    </Container>
  );
};

export default LoginPage;
