import React, { useState, useEffect, useCallback } from "react";
import { Form, Input, Button, Icon, Dropdown } from "semantic-ui-react";
import { useDropzone } from "react-dropzone";
import firebase from "../../../utils/Firebase";
import "firebase/firestore";
import "firebase/storage";
import { map } from "lodash";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

import "./AddSongForm.scss";
const db = firebase.firestore(firebase);

export default function AddSongForm(props) {
  const { setShowModal } = props;
  const [formData, setFormData] = useState(initalValueForm());
  const [albums, setAlbums] = useState([]);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const uploadSong = (fileName) => {
    const ref = firebase.storage().ref().child(`song/${fileName}`);
    return ref.put(file);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: ".mp3",
    noKeyboard: true,
    onDrop,
  });

  const onSubmit = () => {
    if (!formData.name || !formData.album) {
      toast.warning("File's name and album must be completed!");
    } else if (!file) {
      toast.warning("File must be attached!");
    } else {
      setIsLoading(true);
      const fileName = uuidv4();
      console.log(fileName);
      uploadSong(fileName)
        .then(() => {
          db.collection("songs")
            .add({
              name: formData.name,
              album: formData.album,
              fileName: fileName,
            })
            .then(() => {
              toast.success("File was uploaded succefully!");
              resetForm();
              setIsLoading(false);
              setShowModal(false);
            })
            .catch(() => {
              toast.error("Error, please try again!");
              setIsLoading(false);
            });
        })
        .catch(() => {
          toast.error("Error, please try again!");
          setIsLoading(false);
        });
    }
  };

  const resetForm = () => {
    setFormData(initalValueForm());
    setFile(null);
    setAlbums([]);
  };
  return (
    <Form className="add-song-form" onSubmit={onSubmit}>
      <Form.Field>
        <Input
          placeholder="Song's name"
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </Form.Field>
      <Form.Field>
        <Dropdown
          placeholder="Choose the album"
          search
          selection
          lazyLoad
          options={albums}
          onChange={(e, data) =>
            setFormData({ ...formData, album: data.value })
          }
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
      <Button type="submit" loading={isLoading}>
        Upload Song
      </Button>
    </Form>
  );
}

function initalValueForm() {
  return {
    name: "",
    album: "",
  };
}
