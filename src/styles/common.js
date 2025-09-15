import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f2f2f2;
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
  border-radius: 6px;
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
