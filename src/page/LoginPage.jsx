import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { http } from "../api/axios"; 
import { Container, FormWrapper, Title, Input, Button, LinkText } from "../styles/common";
import {Eye, EyeOff} from "lucide-react"; 


const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [passwd, setPasswd] = useState("");
  const [isShowPasswd, setIsShowPasswd] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const toggleShowPasswd = () => 
    setIsShowPasswd(prev => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !passwd) {
      alert("이메일과 비밀번호를 모두 입력하세요.");
      return;
    }

    try {
      setLoading(true);
      console.log("[debug] >>> email : ", email);
      console.log("[debug] >>> passwd : ", passwd);

      const { data } = await http.post("/api/v1/users/signin", { email, passwd });

      if (data ?.accessToken) {
        localStorage.setItem("user", JSON.stringify({
          userId: data.userId,
          email: data.email,
          name: data.name,
          birthday: data.birthday,
        }));
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
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
      <FormWrapper as="form" style={{ display: "flex", flexDirection: "column", gap: "30px"}}>
        <Title>로그인</Title>

        <div className="email-group">
        <label>이메일</label>
        <Input
          type="email"
          placeholder="이메일을 입력해 주세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{backgroundColor: "#F7F7FB", 
                  height:"35px", 
                  border: "none", 
                  marginTop: "10px"}}
          required
        />
        </div>

        <div className="passwd-group" style = {{position: "relative", width: "100%"}}>
          <label>비밀번호</label>
          <Input
            type={isShowPasswd ? "text" : "password"}
            placeholder="비밀번호를 입력해 주세요"
            value={passwd}
            onChange={(e) => setPasswd(e.target.value)}
            style={{backgroundColor: "#F7F7FB", 
                    height:"35px", 
                    border: "none",
                    marginTop: "10px"}}
            required
          />
          <button
            type="button"
            onClick={toggleShowPasswd}
            aria-label={isShowPasswd ? "비밀번호 숨기기" : "비밀번호 보기"}
            style={{
              position: "absolute",
              right: 10,
              top: "55%",
              transform: "translateY(-50%)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: 0,
              lineHeight: 0, 
            }}
          >
            {isShowPasswd ? <Eye /> : <EyeOff />}
          </button>
        </div>

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

