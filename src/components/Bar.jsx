/* eslint-disable react/prop-types */
import React, {
  useState, useContext, useEffect, useRef,
} from 'react';
import { OTSession, OTStreams, preloadScript } from 'opentok-react';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';
import Publisher from './Publisher';
import Subscriber from './Subscriber';
import StateContext from '../context';
import Game from './Game';
import Nav from './Nav';
import Modal from './Modal';
import { get, post, API_URL } from '../utils/apiConn';

const BarRoom = styled.div`
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - var(--nav-height));
  text-align: center;

  h1 {
    margin: 10px auto;
  }
`;

const Display = styled.div`
  display: flex;
  flex-wrap: wrap;
  height: auto;
  flex-direction: row;

  @media screen and (max-width: 600px) {
    flex-direction: column;
  }
`;

const VideoBoxStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50%;
  min-height: 70vh;

  @media screen and (max-width: 600px) {
    width: 100%;
  }
`;

const SubscribersBoxStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  > div {
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
  }
`;

const GameStyled = styled.div`
  display: flex;
  align-content: center;
  justify-content: center;
  margin: auto;
  width: 50%;

  @media screen and (max-width: 600px) {
    width: 100%;
  }
`;

const Bar = () => {
  const [value] = useContext(StateContext);
  const sessionRef = useRef();
  const [gameStart, setGameStart] = useState(false);
  const [gameSelected, setGameSelected] = useState(''); // "neverhaveiever" or "wouldyourather"
  const [roundText, setRoundText] = useState('');

  const getLocalData = (localKey) => {
    const itemStr = localStorage.getItem(localKey);
    if (!itemStr) {
      return '';
    }
    const item = JSON.parse(itemStr);
    const currentDate = new Date();
    if (currentDate.getTime() > item.expiry) {
      localStorage.removeItem(localKey);
      return '';
    }
    return item.localValue;
  };

  useEffect(() => {
    const loadData = {
      barName: value.barName,
    };

    const postURL = `${API_URL}api/updatebar`;
    // eslint-disable-next-line no-unused-vars
    const loadResp = post(postURL, loadData);
  }, [value.barName]);

  const signalStartGame = (signal) => {
    setGameStart(signal.data);
  };

  const signalChangeGame = (signal) => {
    setGameSelected(signal.data);
  };

  const signalSetRoundText = (signal) => {
    setRoundText(signal.data);
  };



  const sessionEvents = {
    'signal:startGame': (event) => setGameStart(event.data),
    'signal:changeGame': (event) => setGameSelected(event.data),
    'signal:setRoundText': (event) => setRoundText(event.data),
  };

  const sendSignal = (type, data) => {
    sessionRef.current.sessionHelper.session.signal(
      {
        type,
        data,
      },
      (err) => {
        if (err) {
          // eslint-disable-next-line no-console
          console.log('signal error: ', err.message);
        } else {
          // eslint-disable-next-line no-console
          console.log('signal sent');
        }
      },
    );
  };

  const startGame = () => {
    sendSignal('startGame', !gameStart);
  };

  const changeGame = (game) => {
    sendSignal('changeGame', game.value);
    sendSignal('setRoundText', '');
  };

  const getRoundText = async () => {
    const getUrl = `${API_URL}api/${gameSelected}`;
    const response = await get(getUrl);
    if (gameSelected === 'neverhaveiever') {
      sendSignal('setRoundText', response.statement);
    } else {
      sendSignal('setRoundText', response.question);
    }
  };

  const onError = (err) => {
    // eslint-disable-next-line no-console
    console.log(`Failed to connect: ${err.message}`);
  };

  const greeting = `Welcome to ${value.barName}! Pull up a seat ${value.userName}!`;

  return (
    <>
      {
        !value.barName
          ? <Redirect to="/" />
          : (
            <>
              <Nav />
              <BarRoom>
                <h1>{value.barName}</h1>
                <Modal text={greeting} />
                <OTSession
                  ref={sessionRef}
                  apiKey={value.key || getLocalData('key')}
                  sessionId={value.sessionId || getLocalData('sessionId')}
                  token={value.token || getLocalData('token')}
                  eventHandlers={sessionEvents}
                  onError={onError}
                >
                  <Display>
                    <VideoBoxStyled>
                      <Publisher />
                      <SubscribersBoxStyled>
                        <OTStreams>
                          <Subscriber />
                        </OTStreams>
                      </SubscribersBoxStyled>
                    </VideoBoxStyled>
                    <GameStyled>
                      <Game
                        gameStart={gameStart}
                        gameSelected={gameSelected}
                        roundText={roundText}
                        getRoundText={getRoundText}
                        startGame={startGame}
                        changeGame={changeGame}
                      />
                    </GameStyled>
                  </Display>
                </OTSession>
              </BarRoom>
            </>
          )
      }
    </>
  );
};

export default preloadScript(Bar);
