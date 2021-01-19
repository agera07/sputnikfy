import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import { Grid, Progress, Icon, Input, Image } from "semantic-ui-react";

import "./Player.scss";

// const songData = {
//   image:
//     "https://firebasestorage.googleapis.com/v0/b/sputnikfy-d5f68.appspot.com/o/album%2Fd5e294b4-4b7f-41d7-85e7-735e104fc1ef?alt=media&token=f55db783-ddca-416d-83b0-ed98a420bb3b",
//   name: "Lucifer",
//   url: "",
// };

export default function Player(props) {
  const { songData } = props;

  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);

  useEffect(() => {
    if (songData?.url) {
      onStart();
    }
  }, [songData]);

  const onStart = () => {
    setPlaying(true);
  };

  const onPause = () => {
    setPlaying(false);
  };

  const onProgress = (data) => {
    setPlayedSeconds(data.playedSeconds);
    setTotalSeconds(data.playedSeconds);
  };

  return (
    <div className="player">
      <Grid>
        <Grid.Column width={4} className="left">
          <Image src={songData?.image} />
          {songData?.name}
        </Grid.Column>
        <Grid.Column width={8} className="center">
          <div className="controls">
            {playing ? (
              <Icon onClick={onPause} name="pause circle outline" />
            ) : (
              <Icon onClick={onStart} name="play circle outline" />
            )}
          </div>
          <Progress
            progress="value"
            value={playedSeconds}
            total={totalSeconds}
            size="tiny"
          />
        </Grid.Column>
        <Grid.Column width={4} className="right">
          <Input
            name="volume"
            type="range"
            label={<Icon name="volume up" />}
            min={0}
            max={1}
            step={0.01}
            onChange={(e, data) => setVolume(Number(data.value))}
            value={volume}
          />
        </Grid.Column>
      </Grid>
      <ReactPlayer
        className="react-player"
        url={songData?.url}
        playing={playing}
        height="0"
        width="0"
        volume={volume}
        onProgress={(e) => onProgress(e)}
      />
    </div>
  );
}
