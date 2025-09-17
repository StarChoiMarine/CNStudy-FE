// src/page/MyPage.jsx
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import MyPageLayout from "../component/MyPageLayout";
import Header from "../component/Header";
import {
  Container, FormWrapper, Title, Input, Button,Select,
} from "../styles/common";


const Label = ({ children }) => (
  <div style={{ fontSize: 15, fontWeight: 600, marginTop: 6 }}>{children}</div>
);

export default function MyPage() {


  // 로그인 유저 정보
  const user = JSON.parse(localStorage.getItem("user")) || {
    id: "",
    name: "",
    email: "",
    birth: "",
    passwd: "",
  };
  const navigate = useNavigate();

  const [, y = "", m = "", d = ""] =
    user.birth?.match(/^(\d{4})-(\d{2})-(\d{2})$/) || [];

  return (
    <>
      <MyPageLayout>
      
        <FormWrapper style={{ width: 520 }}>
          <Title>회원정보 확인</Title>

          <Label>이름</Label>
          <Input 
                    style={{backgroundColor: "#F7F7FB", 
                    height:"35px", 
                    border: "none",
                    marginTop: "10px"}}
          value={user.name} readOnly />

          <Label>이메일</Label>
          <Input 
                    style={{backgroundColor: "#F7F7FB", 
                    height:"35px", 
                    border: "none",
                    marginTop: "10px"}}
                    value={user.email} readOnly />

          <Label>생년월일</Label>
          <div style={{ display: "flex", gap: 8 }}>
            <Input 
                    style={{backgroundColor: "#F7F7FB", 
                    height:"35px", 
                    border: "none",
                    marginTop: "10px",
                    width: 120}}
            readOnly value={`${y || ""} 년`} />
            <Input readOnly 
                    style={{backgroundColor: "#F7F7FB", 
                    height:"35px", 
                    border: "none",
                    marginTop: "10px",
                    width: 120}}
            value={`${parseInt(m || 0, 10) || ""} 월`} />
            <Input readOnly 
                    style={{backgroundColor: "#F7F7FB", 
                    height:"35px", 
                    border: "none",
                    marginTop: "10px",
                    width: 120}}
            
            value={`${parseInt(d || 0, 10) || ""} 일`} />
          </div>

          <Button
            type="button"
            onClick={() => navigate("/mypage/edit")}
            style={{ marginTop: 16 }}
          >
            수정
          </Button>

        </FormWrapper>
     </MyPageLayout>
    </>
  );
}
