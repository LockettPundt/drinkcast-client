/* eslint-disable react/button-has-type */
/* eslint-disable react/prop-types */
import React from 'react';
import styled from 'styled-components';

const ButtonStyled = styled.a`
  text-align: center;
  cursor: pointer;
  margin: 1rem auto;

  button {
    font-family: 'uomo regular';
    background-color: var(--white);
    color: var(--black);
    width: 120px;
    transition: 0.2s ease-in;
    border-radius: 3px;
    border-style: none;
    font-weight: bold;
    padding: 10px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.49);
    z-index: 5;
    cursor: pointer;
  }

  button:hover {
    background-color: var(--black);
    color: var(--white);
  }
`;

const Button = ({ url, type, children }) => (

  <ButtonStyled href={url} type="button">
    <button type={type}>
      {children}
    </button>
  </ButtonStyled>
);

export default Button;
