import React from "react";
import { Button, Icon, Form, Input } from "semantic-ui-react";
import firebase from "../../../utils/Firebase";
import "firebase/auth";

export default function RegisterForm(props) {
  const { setSelectedForm } = props;

  const onSubmit = () => {
    console.log("Form Sent!");
  };

  return (
    <div className="register-form">
      <h1>Start listen to your favorite music for FREE!</h1>
      <Form onSubmit={onSubmit}>
        <Form.Field>
          <Input
            type="text"
            name="email"
            placeholder="Write your e-mail"
            icon="mail outline"
            // onChange={}
            // error={}
          />
        </Form.Field>
      </Form>
    </div>
  );
}
