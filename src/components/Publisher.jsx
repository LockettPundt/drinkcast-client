import React, { useState, useContext } from 'react';
import { OTPublisher } from 'opentok-react';
import styled from 'styled-components';
import CheckBox from './CheckBox';
import StateContext from '../context';

const PublisherStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;

  @media screen and (max-width: 600px) {
    padding: 0 0.4rem;
  }

  .OTPublisherContainer {
    width: 120px !important;
    height: 100px !important;
  }
`;

const Publisher = () => {
  const [error, setError] = useState(null);
  const [audio, setAudio] = useState(false);
  const [video, setVideo] = useState(true);
  const [value] = useContext(StateContext);

  const onError = (err) => {
    setError(`Failed to connect: ${err.message}`);
  };

  return (
    <PublisherStyled>
      {error ? <p>{error}</p> : null}
      <OTPublisher
        style={{
          name: value.userName,
          width: '100',
          height: '100',
        }}
        properties={{
          name: value.userName,
          nameDisplayMode: 'on',
          publishAudio: audio,
          publishVideo: video,
        }}
        onError={onError}
      />
      <CheckBox

        label="Share Video"
        initialChecked={video}
        onChange={setVideo}
      />
      <CheckBox
        label="Share Audio"
        initialChecked={audio}
        onChange={setAudio}

      />
    </PublisherStyled>
  );
};

export default Publisher;
