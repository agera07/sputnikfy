import React from "react";
import { Modal, Icon } from "semantic-ui-react";

import "./BasicModal.scss";

export default function BasicModal(props) {
  const { show, setShow, title, children } = props;
  console.log(props);

  const onClose = () => {
    setShow(false);
  };

  return (
    <Modal open={show} onClose={onClose} className="basic-modal" size="tiny">
      <Modal.Headers>
        <h3>{title}</h3>
        <Icon name="close" onClick={onClose}></Icon>
      </Modal.Headers>
      <Modal.Content>{children}</Modal.Content>
    </Modal>
  );
}
