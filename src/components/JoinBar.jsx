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
  height: 100vh;
  align-items: center;
  justify-content: center;
  background: url(${wood}) no-repeat top left fixed;
  background-size: cover;
  
  div {
    display: inherit;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    height: 250px;
    text-align: center;
  }
 
`;

const Form = styled.form`
  display: flex;
  height: auto;
  align-items: center;
  justify-content: center;
  margin: auto;

  h1 {
    font-size: 3rem;
    display: inherit;
    flex-direction: inherit;
    align-self: center;
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
  const [joinBar, setJoinBar] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [value, dispatch] = useContext(StateContext);
  const [redirect, setRedirect] = useState(false);
  const [alert, setAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  // console.log(value);
  const submitJoinBar = async (e) => {
    e.preventDefault();
    const data = { joinBar, password };
    const getUrl = `${API_URL}api/joinbar`;
    const response = await post(getUrl, data);
    const opentokInfo = await response.json();

    // console.log('session', opentokInfo);
    if (!opentokInfo.hasOwnProperty('error') && joinBar !== '' && password !== '') {
      dispatch({
        type: 'ACTION_JOIN_BAR',
        token: opentokInfo.token,
        sessionId: opentokInfo.sessionId,
        key: opentokInfo.key,
        barName: joinBar,
        userName,
      });
      setAlert(false);
      setJoinBar('');
      setPassword('');
      setRedirect(true);
    }

    setErrorMessage(opentokInfo.error);
    setAlert(true);
    setJoinBar('');
    setPassword('');
    setUserName('');
  };

  return (
    <FormDiv>
      {redirect && (<Redirect to="./bar" />)}
      <div>


        <Form onSubmit={(e) => submitJoinBar(e)}>
          <h1>DRINKCAST</h1>
          <input
            name="joinBar"
            type="text"
            value={joinBar}
            placeholder="Enter a Bar to Join"
            onChange={(e) => setJoinBar(e.target.value)}
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
            placeholder="Enter a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button url="" type="submit">Join a Bar</Button>
        </Form>
        <div className="error">{errorMessage}</div>
      </div>
    </FormDiv>
  );
};

export default IndexPage;
