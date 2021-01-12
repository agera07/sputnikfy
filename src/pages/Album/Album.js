import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { Loader } from "semantic-ui-react";
import firebase from "../../utils/Firebase";
import "firebase/firestore";
import "firebase/storage";

import "./Album.scss";

const db = firebase.firestore(firebase);

function Album(props) {
  const { match } = props;
  const [album, setAlbum] = useState(null);
  const [albumImage, setAlbumImage] = useState(null);
  const [artist, setArtist] = useState(null);

  useEffect(() => {
    db.collection("album")
      .doc(match.params.id)
      .get()
      .then((response) => {
        setAlbum(response.data());
      });
  }, [match]);

  useEffect(() => {
    if (album) {
      firebase
        .storage()
        .ref(`album/${album?.banner}`)
        .getDownloadURL()
        .then((url) => {
          setAlbumImage(url);
        });
    }
  }, [album]);

  useEffect(() => {
    if (album) {
      db.collection("artists")
        .doc(album?.artist)
        .get()
        .then((response) => {
          setArtist(response.data());
        });
    }
  }, [album]);

  if (!album || !artist) {
    return <Loader active>Loading...</Loader>;
  }

  return (
    <div className="album">
      <div className="album__header">
        <HeaderAlbum album={album} albumImage={albumImage} artist={artist} />
      </div>
      <div className="album__songs">
        <p>Tracklist</p>
      </div>
    </div>
  );
}

export default withRouter(Album);

function HeaderAlbum(props) {
  const { album, albumImage, artist } = props;

  return (
    <>
      <div
        className="image"
        style={{ backgroundImage: `url('${albumImage}')` }}
      />
      <div className="info">
        <h1>{album.name}</h1>
        <p>
          From <span>{artist.name}</span>
        </p>
      </div>
    </>
  );
}
