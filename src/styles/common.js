import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #ffffff;
`;

export const FormWrapper = styled.div`
  background-color: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0px 8px 16px rgba(0,0,0,0.1);
  width: 400px;
`;

export const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: #333;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #FF68A5;
    box-shadow: 0 0 5px rgba(0,123,255,0.3);
  }
`;

export const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #FF68A5;
  color: white;
  border: none;
  font-size: 16px;
  border-radius: 10px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #e05595;
  }

  &:disabled {
    background-color: #aaa;
    cursor: not-allowed;
  }
`;

export const LinkText = styled.div`
  text-align: center;
  margin-top: 15px;
  font-size: 14px;

  a {
    color: #FF68A5;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const FieldRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 10px;
`;

export const Select = styled.select`
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  height: 40px;
  min-width: 110px;         /* 필요에 맞게 조절 */
  padding: 0 40px 0 14px;   /* 오른쪽은 화살표 자리 */
  border: 1px #e6e7ec;
  border-radius: 10px;    /* 알약 모양 */
  background-color: #f7f7fb;
  color: #333;
  font-size: 14px;
  line-height: 40px;
  outline: none;

  &:hover {
    border-color: #d7d8de;
  }
  
  &:disabled {
    background-color: #f7f7fb;
    color: #b5b7bf;
    opacity: 1;
    cursor: not-allowed;
  }

  option { color: #333; }
  option[value=""] { color: #9aa0a6; } /* placeholder 느낌 */
`;

