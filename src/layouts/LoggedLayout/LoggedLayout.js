import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Grid } from "semantic-ui-react";
import Routes from "../../routes/Routes";
import SideBar from "../../components/SideBar";
import TopBar from "../../components/TopBar";
import Player from "../../components/Player";

import "./LoggedLayout.scss";

export default function LoggedLayout(props) {
  const { user, setReloadApp } = props;
  const [songData, setSongData] = useState(null);

  const playerSong = (albumImage, songName, songUrl) => {
    // setSongData({ songUrl, image: albumImage, name: songName });
  };

  return (
    <Router>
      <Grid className="logged-layout">
        <Grid.Row>
          <Grid.Column width={3}>
            <SideBar user={user} />
          </Grid.Column>
          <Grid.Column className="content" width={13}>
            <TopBar user={user} />
            <Routes user={user} setReloadApp={setReloadApp} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            <Player songData={songData} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Router>
  );
}
