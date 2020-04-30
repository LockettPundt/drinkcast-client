import React, { useState, useContext } from 'react';
import { OTSubscriber } from 'opentok-react';
import styled from 'styled-components';
import CheckBox from './CheckBox';
import StateContext from '../context';

const SubscriberStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 5px;

  @media screen and (max-width: 600px) {
    padding: 0 0.4rem;
  }

  .OTSubscriberContainer {
    width: 240px !important;
    height: 200px !important;
  }
`;

const Subscriber = () => {
  const [error, setError] = useState(null);
  const [audio, setAudio] = useState(false);
  const [video, setVideo] = useState(true);
  const [value] = useContext(StateContext);

  const onError = (err) => {
    setError(`Failed to connect: ${err.message}`);
  };

  const getUserName = () => {
    const item = localStorage.getItem('userName');
    const name = JSON.parse(item);
    return name.localValue;
  };

  const displayName = getUserName();

  return (
    <SubscriberStyled>
      {error ? <div>{error}</div> : null}
      <OTSubscriber
        style={{
          width: '100',
          height: '100',

        }}
        properties={{
          name: displayName,
          subscribeToAudio: audio,
          subscribeToVideo: video,
        }}
        onError={onError}
      />
      <CheckBox label="Show Video" initialChecked={video} onChange={setVideo} />
      <CheckBox label="Play Audio" initialChecked={audio} onChange={setAudio} />
    </SubscriberStyled>
  );
};

export default Subscriber;
