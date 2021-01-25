import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import BannerArtist from "../../components/Artists/BannerArtist";
import BasicSliderItems from "../../components/Sliders/BasicSliderItems";
import firebase from "../../utils/Firebase";
import "firebase/firestore";
import { map } from "lodash";

import "./Artist.scss";

const db = firebase.firestore(firebase);

function Artist(props) {
  const { match } = props;
  const [albums, setAlbums] = useState([]);
  const [artist, setArtist] = useState(null);

  useEffect(() => {
    db.collection("artists")
      .doc(match?.params?.id)
      .get()
      .then((response) => {
        const data = response.data();
        console.log(data);
        console.log("response", response);
        if (data) {
          data.id = response.id;
          setArtist(data);
        }
      });
  }, [match?.params?.id]);

  useEffect(() => {
    if (artist) {
      db.collection("album")
        .where("artist", "==", artist.id)
        .get()
        .then((response) => {
          const arrayAlbums = [];
          map(response?.docs, (album) => {
            const data = album.data();
            data.id = album.id;
            arrayAlbums.push(data);
          });
          setAlbums(arrayAlbums);
        });
    }
  }, [artist]);

  return (
    <div className="artist">
      {artist && <BannerArtist artist={artist} />}
      <div className="artist__content">
        <BasicSliderItems
          title="Albums"
          data={albums}
          folderImage="album"
          urlName="album"
        />
      </div>
    </div>
  );
}
export default withRouter(Artist);
