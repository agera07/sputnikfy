import React, { useCallback, useState } from "react";
import { Form, Input, Button, Image } from "semantic-ui-react";
import { useDropzone } from "react-dropzone";
import NoImage from "../../../../src/assests/png/no-image.png";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import firebase from "../../../utils/Firebase";
import "firebase/storage";
import "firebase/firestore";

import "./AddArtistForm.scss";

const db = firebase.firestore(firebase);

export default function AddArtistForm(props) {
  const { setShowModal } = props;
  const [formData, setFormData] = useState(initialValueForm());
  const [banner, setBanner] = useState(null);
  const [file, setFile] = useState(null);
  const [isLoading, setisLoading] = useState(false);

  const onDrop = useCallback((acceptedFile) => {
    const file = acceptedFile[0];
    setFile(file);
    setBanner(URL.createObjectURL(file));
  });

  const { getInputProps, getRootProps } = useDropzone({
    accept: "image/jpeg, image/png",
    noKeyboard: true,
    onDrop,
  });

  const uploadImage = (fileName) => {
    const ref = firebase.storage().ref().child(`artist/${fileName}`);
    return ref.put(file);
  };

  const onSubmit = () => {
    if (!formData.name) {
      toast.warning("Add artist's name please");
    } else if (!file) {
      toast.warning("Add artist's image please");
    } else {
      setisLoading(true);
      const fileName = uuidv4();
      uploadImage(fileName)
        .then(() => {
          db.collection("artists")
            .add({ name: formData.name, banner: fileName })
            .then(() => {
              toast.success("Arstis was created!");
              resetForm();
              setisLoading(false);
              setShowModal(false);
            })
            .catch(() => {
              toast.error("Oops! Error in creating artist!");
              setisLoading(false);
            });
        })
        .catch(() => {
          toast.error("Oops! Something happened try again please!");
          setisLoading(false);
        });
    }
  };

  const resetForm = () => {
    setFormData(initialValueForm());
    setFile(null);
    setBanner(null);
  };

  return (
    <Form className="add-artist-form" onSubmit={onSubmit}>
      <Form.Field className="artist-banner">
        <div
          {...getRootProps()}
          className="banner"
          style={{ backgroundImage: `url('${banner}')` }}
        ></div>
        <Input {...getInputProps()} />
        {!banner && <Image src={NoImage} />}
      </Form.Field>
      <Form.Field className="artist-avatar">
        <div
          className="avatar"
          style={{ backgroundImage: `url('${banner ? banner : NoImage}')` }}
        ></div>
      </Form.Field>
      <Form.Field className="artist-name">
        <Input
          placeholder="Arstits name"
          onChange={(e) => setFormData({ name: e.target.value })}
        />
      </Form.Field>
      <Button type="submit" loading={isLoading}>
        Add artist
      </Button>
    </Form>
  );
}

function initialValueForm() {
  return {
    name: "",
  };
}
