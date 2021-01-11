import React, { useState, useEffect } from "react";
import BannerHome from "../../components/BannerHome";
import firebase from "../../utils/Firebase";
import "firebase/firestore";
import { map } from "lodash";
import BasicSliderItems from "../../components/Sliders/BasicSliderItems";

import "./Home.scss";

const db = firebase.firestore(firebase);

export default function Home() {
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    db.collection("artists")
      .get()
      .then((response) => {
        const arrayArtists = [];
        map(response?.docs, (artist) => {
          const data = artist.data();
          data.id = artist.id;
          arrayArtists.push(data);
        });
        setArtists(arrayArtists);
      });
  }, []);

  useEffect(() => {
    db.collection("album")
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
  }, []);

  return (
    <>
      <BannerHome />
      <div className="home">
        <BasicSliderItems
          title="Last Artists"
          data={artists}
          folderImage="artist"
          urlName="artist"
        />
        <BasicSliderItems
          title="Last Albums"
          data={albums}
          folderImage="album"
          urlName="album"
        />
      </div>
    </>
  );
}
