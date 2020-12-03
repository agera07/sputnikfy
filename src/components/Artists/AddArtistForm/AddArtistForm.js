import React, { useCallback, useState } from "react";
import { Form, Input, Button, Image } from "semantic-ui-react";
import { useDropzone } from "react-dropzone";
import NoImage from "../../../../src/assests/png/no-image.png";
import { toast } from "react-toastify";

import "./AddArtistForm.scss";

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

  const onSubmit = () => {
    if (!formData.name) {
      toast.warning("Add artist's name please");
    } else if (!file) {
      toast.warning("Add artist's image please");
    } else {
      setisLoading(true);
    }
    // setShowModal(false);
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
