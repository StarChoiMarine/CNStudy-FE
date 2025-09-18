
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { http } from "../api/axios"; 
import { Container, FormWrapper, Title, Input, Button, LinkText, FieldRow, Select  } from "../styles/common";
import {Eye, EyeOff} from "lucide-react"; 

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState(""); 
  const [email, setEmail] = useState("");
  const [passwd, setPasswd] = useState("");
  const [confirmPasswd, setConfirm] = useState("");
  const [isShowPasswd, setIsShowPasswd] = useState(false);
  const [isShowPasswdCheck, setIsShowPasswdCheck] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const toggleShowPasswd = () => 
    setIsShowPasswd(prev => !prev);

  const toggleShowPasswdCheck = () => 
    setIsShowPasswdCheck(prev => !prev);

  const DateSelect = ( {value, onChange}) => {
    const years = Array.from({length:100}, (_,i) => new Date().getFullYear() - i);
    const months = Array.from({length: 12}, (_,i) => i+1);
    const[year, setYear] = useState("");
    const[month, setMonth] = useState("");
    const[day, setDay] = useState("");

    const daysInMonth = (y, m) => {
      if (!y || !m) return 31;
      return new Date(y, m, 0).getDate();
    };

    const handleChange = (type, val) => {
      if (type === "year") {
        setYear(val);
        setDay("");
      } else if (type === "month") {
        setMonth(val);
        setDay("");
      } else if (type === "day") {
        setDay(val);
      }

      const y = type === "year" ? val : year;
      const m = type === "month" ? val : month;
      const d = type === "day" ? val : day;

      if (y && m && d) {
        const formatt = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        onChange(formatt);
      }
    }
  

    return (
    <FieldRow>
      <Select value={year} onChange={(e)=>handleChange("year", e.target.value)}>
        <option value="">년</option>
        {years.map(y => <option key={y} value={y}>{y}</option>)}
      </Select>

      <Select value={month} onChange={(e)=>handleChange("month", e.target.value)} disabled={!year}>
        <option value="">월</option>
        {months.map(m => <option key={m} value={m}>{String(m).padStart(2,"0")}</option>)}
      </Select>

      <Select value={day} onChange={(e)=>handleChange("day", e.target.value)} disabled={!year || !month}>
        <option value="">일</option>
        {Array.from({ length: daysInMonth(year, month) }, (_, i) => i + 1).map(d => (
          <option key={d} value={String(d).padStart(2,"0")}>{String(d).padStart(2,"0")}</option>
        ))}
      </Select>
    </FieldRow>
  );

  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !birthday || !email || !passwd || !confirmPasswd) {
      alert("모든 항목을 입력해 주세요.");
      return;
    }
    if (passwd !== confirmPasswd) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      setLoading(true);
      
      await http.post("/api/v1/users/signup", { name, birthday, email, passwd });
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
      <FormWrapper as="form" style={{ display: "flex", flexDirection: "column", gap: "2px"}}>
        <Title>회원가입</Title>

        <div className="name-group">
        <label style={{fontSize: "15px"}}>이름</label>
        <Input
          type="text"
          placeholder="이름을 입력해 주세요"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{backgroundColor: "#F7F7FB", 
                  height:"15px", 
                  border: "none", 
                  marginTop: "5px",
                  fontSize: "13px"}}
          required
        />
        </div>

        <div className="email-group">
        <label style={{fontSize: "15px"}}>이메일</label>
        <Input
          type="email"
          placeholder="이메일을 입력해 주세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{backgroundColor: "#F7F7FB", 
                  height:"15px", 
                  border: "none", 
                  marginTop: "10px",
                  fontSize: "13px"}}
          required
        />
        </div>

        <div className="passwd-group" style = {{position: "relative", width: "100%"}}>
        <label style={{fontSize: "15px"}}>비밀번호</label>
        <Input
          type={isShowPasswd ? "text" : "password"}
          placeholder="비밀번호를 입력해 주세요"
          value={passwd}
          onChange={(e) => setPasswd(e.target.value)}
          style={{backgroundColor: "#F7F7FB", 
                  height:"15px", 
                  border: "none", 
                  marginTop: "10px",
                  fontSize: "13px"}}
          required
        />
        <button
          type="button"
          onClick={toggleShowPasswd}
          aria-label={isShowPasswd ? "비밀번호 숨기기" : "비밀번호 보기"}
          style={{
            position: "absolute",
            right: 8,
            top: "58%",
            transform: "translateY(-50%)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 0,
            lineHeight: 0, 
          }}
        >
          {isShowPasswd ? <Eye size={16}/> : <EyeOff size={16}/>}
        </button>
        </div>

        <div className="checkpw-group" style = {{position: "relative", width: "100%"}}>
        <label style={{fontSize: "15px"}}>비밀번호 확인</label>
        <Input
          type="password"
          placeholder="비밀번호를 입력해 주세요"
          value={confirmPasswd}
          onChange={(e) => setConfirm(e.target.value)}
          style={{backgroundColor: "#F7F7FB", 
                  height:"15px", 
                  border: "none", 
                  marginTop: "10px",
                  fontSize: "13px"}}
          required
        />
        <button
          type="button"
          onClick={toggleShowPasswdCheck}
          aria-label={isShowPasswdCheck ? "비밀번호 숨기기" : "비밀번호 보기"}
          style={{
            position: "absolute",
            right: 8,
            top: "58%",
            transform: "translateY(-50%)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 0,
            lineHeight: 0
          }}
        >
          {isShowPasswdCheck ? <Eye size={16}/> : <EyeOff size={16}/>}
        </button>
        </div>

        <div>
          <label style={{fontSize: "15px"}}>생년월일</label>
          <DateSelect value={birthday} onChange={setBirthday} />
        </div>

        <Button type="button" onClick={handleSubmit} disabled={loading} style={{fontSize: "15px"}}>
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

