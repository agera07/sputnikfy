import React, { useState, useEffect, useCallback } from "react";
import { Form, Input, Button, Icon, Dropdown } from "semantic-ui-react";
import { useDropzone } from "react-dropzone";
import firebase from "../../../utils/Firebase";
import "firebase/firestore";
import { map } from "lodash";

import "./AddSongForm.scss";
const db = firebase.firestore(firebase);

export default function AddSongForm(props) {
  const { setShowModal } = props;

  const [albums, setAlbums] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    db.collection("album")
      .get()
      .then((response) => {
        const albumsArray = [];
        map(response?.docs, (album) => {
          const data = album.data();
          albumsArray.push({
            key: album.id,
            value: album.id,
            text: data.name,
          });
        });
        setAlbums(albumsArray);
      });
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setFile(file);
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: ".mp3",
    noKeyboard: true,
    onDrop,
  });

  const onSubmit = () => {};

  return (
    <Form className="add-song-form" onSubmit={onSubmit}>
      <Form.Field>
        <Input placeholder="Song's name" />
      </Form.Field>
      <Form.Field>
        <Dropdown
          placeholder="Choose the album"
          search
          selection
          lazyLoad
          options={albums}
        />
      </Form.Field>
      <Form.Field>
        <div className="song-upload" {...getRootProps()}>
          <input {...getInputProps()} />
          <Icon name="cloud upload" className={file && "load"} />

          <div className="cloud">
            <p>
              Drag your file or click <span>HERE</span>.
            </p>
            {file && (
              <p>
                File Uploaded: <span>{file.name}</span>
              </p>
            )}
          </div>
        </div>
      </Form.Field>
      <Button type="submit">Upload Song</Button>
    </Form>
  );
}
