// src/component/MyPageLayout.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import Header from "./Header";
import { User, Heart, FileText } from "lucide-react";

/* ====== 스타일 ====== */
const Shell = styled.div`
  height: calc(100vh - 64px);           /* 헤더 아래 전체 높이 채우기 */
  display: grid;
  grid-template-columns: 220px 1fr;     /* 좌: 사이드 / 우: 컨텐츠 */
  gap: 24px;
  padding: 24px clamp(16px, 3vw, 48px);
  align-items: center;                  /* 두 칼럼 모두 세로 가운데 */
  
  @media (max-width: 920px) {
    grid-template-columns: 180px 1fr;
  }
  @media (max-width: 680px) {
    grid-template-columns: 1fr;
    height: auto;                       /* 모바일은 일반 흐름 */
    align-items: stretch;
  }
`;

const Side = styled.aside`

  align-self: center;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;              /* 내부 항목(네비) 세로 가운데 */
  gap: 12px;


  width: 240px;
  min-height: 480px;                    /* 너무 작지 않게 가드 */
  border-radius: 16px;
  backdrop-filter: blur(10px);
  background: rgba(255,255,255,0.28);
  border: 1px solid rgba(255,255,255,0.22);
  box-shadow: 0 10px 28px rgba(0,0,0,0.12);
  padding: 14px;

  @media (max-width: 680px) {
    align-self: stretch;
    justify-content: flex-start;
  }
`;

const SideTitle = styled.div`
  font-size: 25px;
  font-weight: 700;
  color: #222;
  padding: 6px 10px 2px;
`;

const NavList = styled.nav`
  flex: 0.5;                /* 남은 공간 다 차지 */
  display: flex;
  flex-direction: column;
  justify-content: center; /* 세로 중앙 정렬 */
  gap: 8px;
`;

const NavItem = styled(Link)`
  display: flex;
  gap: 10px;
  padding: 14px 16px;
  border-radius: 10px;
  color: ${({ $active }) => ($active ? "#FF68A5" : "#333")};
  background: ${({ $active }) => ($active ? "rgba(255,104,165,.12)" : "transparent")};
  text-decoration: none;
  font-size: 18px;

  &:hover { background: rgba(0,0,0,.04); }
  svg { width: 18px; height: 18px; }
`;

const Content = styled.main`
  /* 우측 영역 정중앙 배치 */
  display: flex;
  align-items: center;
  justify-content: center;

  /* 컨텐츠가 커질 때 자연 스크롤 */
  min-width: 0;
  min-height: 60vh;  /* 적당한 높이 가드 */
`;

/* ====== 컴포넌트는 동일 ====== */
export default function MyPageLayout({ children }) {
  const { pathname } = useLocation();
  const items = [
    { to: "/mypage",        id: "profile", label: "회원정보",     icon: <User /> },
    { to: "/mypage/likes", id: "likes", label: "좋아요 한 글", icon: <Heart /> },
    { to: "/mypage/posts",  id: "posts",   label: "내가 작성한 글", icon: <FileText /> },
  ];
  return (
    <>
      <Header />
      <Shell>
        <Side>
          <SideTitle>마이페이지</SideTitle>
          <NavList>
            {items.map(it => (
              <NavItem key={it.id} to={it.to} $active={pathname === it.to}>
                {it.icon}
                {it.label}
              </NavItem>
            ))}
          </NavList>
        </Side>
        <Content>{children}</Content>
      </Shell>
    </>
  );
}
