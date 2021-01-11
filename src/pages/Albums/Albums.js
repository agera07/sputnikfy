import React, { useState, useEffect } from "react";
import { Grid } from "semantic-ui-react";
import firebase from "../../utils/Firebase";
import { map } from "lodash";
import "firebase/firestore";

import "./Albums.scss";

const db = firebase.firestore(firebase);

export default function Albums() {
  const [albums, setAlbums] = useState(null);

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
  console.log(albums);
  return (
    <div className="albums">
      <h1>Albums</h1>
      <Grid>
        {map(albums, (album) => {
          <Grid.Column key={album.id} mobile={8} tablet={4} computer={3}>
            <h3>{album.name}</h3>
          </Grid.Column>;
        })}
      </Grid>
    </div>
  );
}
