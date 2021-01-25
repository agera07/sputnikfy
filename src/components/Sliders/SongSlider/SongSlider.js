import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { size } from "lodash";
import { Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import firebase from "../../../utils/Firebase";
import "firebase/firestore";
import "firebase/storage";

import "./SongSlider.scss";

const db = firebase.firestore(firebase);

export default function SongSlider(props) {
  const { title, data, playerSong } = props;

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    speed: 500,
    centerMode: true,
    className: "song-slider__list",
  };

  if (size(data) < 5) {
    return null;
  }
  return (
    <div className="song-slider">
      <h2>{title}</h2>
      <Slider {...settings}>
        {data.map((item) => {
          return <Song key={item.id} item={item} playerSong={playerSong} />;
        })}
      </Slider>
    </div>
  );
}

function Song(props) {
  const { item, playerSong } = props;
  const [banner, setBanner] = useState(null);
  const [album, setAlbum] = useState(null);

  useEffect(() => {
    db.collection("album")
      .doc(item.album)
      .get()
      .then((response) => {
        const albumTemporal = response.data();
        albumTemporal.id = response.id;
        setAlbum(albumTemporal);
        getImage(albumTemporal);
      });
  }, [item]);

  const getImage = (album) => {
    firebase
      .storage()
      .ref(`album/${album.banner}`)
      .getDownloadURL()
      .then((bannerUrl) => {
        setBanner(bannerUrl);
      });
  };

  const onPlay = () => {
    playerSong(banner, item.name, item.fileName);
  };

  return (
    <div className="song-slider__list-song">
      <div
        className="avatar"
        style={{ backgroundImage: `url('${banner}')` }}
        onClick={onPlay}
      >
        <Icon name="play circle outline" />
      </div>
      <Link to={`/album/${album?.id}`}>
        <h3>{item.name}</h3>
      </Link>
    </div>
  );
}
