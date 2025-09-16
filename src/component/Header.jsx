// src/components/Header.jsx
import React from "react";
import styled from "styled-components";
import { NavLink, useNavigate } from "react-router-dom";
import userIcon from "../styles/images/usericon.png"; 
const Bar = styled.header`
  height: 56px; display:flex; align-items:center; justify-content:space-between;
  padding: 0 16px; background:#fff; border-bottom:1px solid #eee; position:sticky; top:0; z-index:10;
`;
const Left = styled.div`display:flex; gap:14px; align-items:center;`;
const Right = styled.div`display:flex; gap:15px; align-items:center;`;
const Logo = styled.div`font-weight:800; font-size:35px;`;
const LinkBtn = styled(NavLink)`
  padding:6px 10px; border-radius:8px; text-decoration:none; color:#333;
  font-size:20px;
  &:hover{ background: #ffd1e4ff; }
  &.active { background:#ff68a5; color:#ffffff; font-weight:400; }
`;
const MyBtn = styled(NavLink)`
  align-items: center;  /* 세로 가운데 정렬 */
  justify-content: center; /* 가로도 중앙 정렬 */
  padding: 6px 10px;       
  border: 0;
  border-radius:8px;
  background-color: #ff66a5;
  color: white;        
  font-weight: 400;
  cursor: pointer;
  text-decoration: none;
   &:hover{ filter:brightness(.95); }

`;
const Logout = styled.button`
  border:0; background:#C4C4C4; color:#fff; border-radius:8px; padding:6px 10px; cursor:pointer;
  font-size:16px;
  &:hover{ filter:brightness(.95); }
`;
const Icon = styled.img`
  align-items: center;  
  width: 18px;  
  height: 18px;
  border-radius: 50%; 
  margin-right: 5px;
  margin-bottom: -2.5px;
`;




export default function Header() {
  const nav = useNavigate();
  const onLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    nav("/login", { replace:true });
  };
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Bar>
      <Left>
        <Logo>LGCNS Inspire 3기</Logo>

      </Left>
      <Right>
        <LinkBtn to="/main">HOME</LinkBtn>
        <LinkBtn to="/summary">Lecture Notes</LinkBtn>
        <LinkBtn to="/schedule">Class Schedule</LinkBtn>
        <MyBtn to="/mypage"><Icon src={userIcon} alt="user icon" />  {user.name} 님</MyBtn>
        <Logout onClick={onLogout}>Logout</Logout>
      </Right>
    </Bar>
  );
}