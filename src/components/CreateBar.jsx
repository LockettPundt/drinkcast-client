/* eslint-disable no-unused-vars */
import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { Redirect } from 'react-router-dom';
import { post, API_URL } from '../utils/apiConn';
import StateContext from '../context';
import wood from '../images/wood.jpg';
import Button from './Button';

const FormDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: url(${wood}) no-repeat top left fixed;
  background-size: cover;
  height: 100vh;
  
  div {
    display: inherit;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    height: 250px;
  }
  
`;

const Form = styled.form`
  display: flex;
  height: auto;
  align-items: center;
  justify-content: center;
  margin: auto;
  
  h1 {
    display: inherit;
    flex-direction: inherit;
    align-self: center;
    font-size: 3rem;
    margin: 0 1rem;
  }

  input {
    border: none;
    font-family: inherit;
    padding: 10px;
    border-radius: 2px;
    margin: 1rem;
    text-align: center;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.49);
    z-index: 5;
  }
  
  @media screen and (max-width: 1000px) {
    flex-direction: column;
  }
`;

const IndexPage = () => {
  const [barName, setBarName] = useState('');
  const [password, setPassword] = useState('');
  const [nameCheck, setNameCheck] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [userName, setUserName] = useState('');

  const [value, dispatch] = useContext(StateContext);


  const submitBarName = async (e) => {
    e.preventDefault();
    const data = { barName, password };
    const postUrl = `${API_URL}api/createbar`;
    const response = await post(postUrl, data);
    const opentokInfo = await response.json();
    setNameCheck(opentokInfo.error);

    console.log(opentokInfo);
    if (!opentokInfo.hasOwnProperty('error') && barName !== '' && password !== '') {
      dispatch({
        type: 'ACTION_CREATE_BAR',
        sessionId: opentokInfo.newSession,
        token: opentokInfo.token,
        key: opentokInfo.key,
        barName,
        userName,
      });

      setRedirect(true);
    }


    setBarName('');
    setPassword('');
    setUserName('');
  };

  return (
    <FormDiv>
      {redirect && (<Redirect to="./bar" />)}
      <div>
        <Form onSubmit={(e) => submitBarName(e)}>
          <h1>DRINKCAST</h1>
          <input
            name="barName"
            type="text"
            value={barName}
            placeholder="Enter a New Bar Name"
            onChange={(e) => setBarName(e.target.value)}
            isRequired
          />
          <input
            name="userName"
            type="text"
            value={userName}
            placeholder="Enter your name"
            onChange={(e) => setUserName(e.target.value)}
          />
          <input
            type="password"
            name="password"
            value={password}
            placeholder="Enter a Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <Button url="" type="submit">Create New Bar</Button>
        </Form>
        <div>{nameCheck}</div>
      </div>
    </FormDiv>
  );
};

export default IndexPage;
