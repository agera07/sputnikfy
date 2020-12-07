import React, { useState, useEffect } from "react";
import BannerHome from "../../components/BannerHome";
import firebase from "../../utils/Firebase";
import "firebase/firestore";
import { map } from "lodash";
import BasicSliderItems from "../../components/Sliders/BasicSliderItems";

import "./Home.scss";

const db = firebase.firestore(firebase);

export default function Home() {
  const [artists, setAstists] = useState([]);

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
        setAstists(arrayArtists);
      });
  }, []);

  return (
    <>
      <BannerHome />
      <div className="home">
        <BasicSliderItems title="Last Artists" data={artists} />
        <h2>hello world</h2>
      </div>
    </>
  );
}
