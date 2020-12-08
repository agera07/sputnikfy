import React, { useState, useEffect } from "react";
import firebase from "../../../utils/Firebase";
import "firebase/storage";

import "./BannerArtist.scss";

export default function BannerArtist(props) {
  const { artist } = props;
  const [bannerUrl, setBannerUrl] = useState(null);

  useEffect(() => {
    firebase
      .storage()
      .ref(`artist/${artist.banner}`)
      .getDownloadURL()
      .then((url) => {
        setBannerUrl(url);
      });
  }, [artist]);

  return (
    <div
      style={{ backgroundImage: `url('${bannerUrl}')` }}
      className="banner-artist"
    >
      <div className="banner-artist__gradient" />
      <div className="banner-artist__info">
        <h4>Artist</h4>
        <h1>{artist.name}</h1>
      </div>
    </div>
  );
}
