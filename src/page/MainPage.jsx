// src/page/MainPage.jsx
import React from "react";
import styled from "styled-components";

// 컨테이너 스타일
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #fafafa;
  font-size: 20px;
  font-weight: bold;
`;

const MainPage = () => {
  // 로그인한 유저 정보 가져오기
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Container>
      {user ? (
        <div>
          {user.name}님 안녕하세요! 😊 <br />
          오늘의 운세는 <strong>"모든 게 잘 풀릴 겁니다~"</strong>
        </div>
      ) : (
        <div>로그인 정보가 없습니다. 다시 로그인해주세요.</div>
      )}
    </Container>
  );
};

export default MainPage;
