import React, { useState, useEffect, useCallback } from "react";
import { Form, Input, Button, Image, Dropdown } from "semantic-ui-react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import NoImage from "../../../assests/png/no-image.png";
import firebase from "../../../utils/Firebase";
import { v4 as uuidv4 } from "uuid";
import { map } from "lodash";
import "firebase/firestore";
import "firebase/storage";

import "./AddAlbumForm.scss";

const db = firebase.firestore(firebase);

export default function AddAlbumForm(props) {
  const { setShowModal } = props;
  const [albumImage, setAlbumImage] = useState(null);
  const [formData, setFormData] = useState(initialValueform());
  const [file, setFile] = useState(null);
  const [artists, setArtists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    db.collection("artists")
      .get()
      .then((response) => {
        const arrayArtists = [];
        map(response?.docs, (artist) => {
          const data = artist.data();
          arrayArtists.push({
            key: artist.id,
            value: artist.id,
            text: data.name,
          });
        });
        setArtists(arrayArtists);
      });
  }, []);

  const onDrop = useCallback((acceptedfiles) => {
    const file = acceptedfiles[0];
    setFile(file);
    setAlbumImage(URL.createObjectURL(file));
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/jpeg, image/png",
    noKeyboard: true,
    onDrop,
  });

  const uploadImage = (fileName) => {
    const ref = firebase.storage().ref().child(`album/${fileName}`);
    return ref.put(file);
  };

  const onSubmit = () => {
    if (!formData.name || !formData.artist) {
      toast.warning("Album's and Artist's name can't be blank");
    } else if (!file) {
      toast.warning("Please select a cover for the album");
    } else {
      setIsLoading(true);
      const fileName = uuidv4();
      uploadImage(fileName)
        .then(() => {
          db.collection("album")
            .add({
              name: formData.name,
              artist: formData.artist,
              banner: fileName,
            })
            .then(() => {
              toast.success("Album was added!");
              resetForm();
              setIsLoading(false);
              setShowModal(false);
            })
            .catch(() => {
              toast.warning("Error to creat album");
              setIsLoading(false);
            });
        })
        .catch(() => {
          toast.warning("Error to upload image!");
          setIsLoading(false);
        });
    }
  };
  const resetForm = () => {
    setFormData(initialValueform());
    setFile(null);
    setAlbumImage(null);
  };

  return (
    <Form className="add-album-form" onSubmit={onSubmit}>
      <Form.Group>
        <Form.Field className="album-avatar" width={5}>
          <div
            {...getRootProps()}
            className="avatar"
            style={{ backgroundImage: `url('${albumImage}')` }}
          />
          <input {...getInputProps()} />
          {!albumImage && <Image src={NoImage} />}
        </Form.Field>
        <Form.Field className="album-inputs" width={11}>
          <Input
            placeholder="Album's name"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Dropdown
            placeholder="Album belongs to"
            fluid
            search
            selection
            options={artists}
            lazyLoad
            onChange={(e, data) =>
              setFormData({ ...formData, artist: data.value })
            }
          />
        </Form.Field>
      </Form.Group>
      <Button type="submit" loading={isLoading}>
        Add Album
      </Button>
    </Form>
  );
}

function initialValueform() {
  return {
    name: "",
    artist: "",
  };
}
