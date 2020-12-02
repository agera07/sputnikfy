import React, { useState } from "react";
import { Button, Form, Input, Icon } from "semantic-ui-react";
import { toast } from "react-toastify";
import { reauthenticate } from "../../utils/Api";
import alertErrors from "../../utils/AlertErrors";

import firebase from "../../utils/Firebase";
import "firebase/auth";

export default function UserEmail(props) {
  const { user, setShowModal, setTitleModal, setContentModal } = props;

  const onEdit = () => {
    setShowModal(true);
    setTitleModal("Update Email");
    setContentModal(
      <ChangeEmailForm
        email={user.email}
        setShowModal={setShowModal}
        displayEmail={user.email}
      />
    );
  };

  return (
    <div className="user-email">
      <h3>Email: {user.email}</h3>
      <Button circular onClick={onEdit}>
        {" "}
        Update Email
      </Button>
    </div>
  );
}

function ChangeEmailForm(props) {
  const { email, setShowModal } = props;
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = () => {
    if (!formData.email) {
      toast.warning("Something went wrong, please try with other email!");
    } else {
      setIsLoading(true);
      reauthenticate(formData.password)
        .then(() => {
          const currentUser = firebase.auth().currentUser;
          currentUser
            .updateEmail(formData.email)
            .then(() => {
              toast.success("Email was updated!");
              setIsLoading(false);
              setShowModal(false);
              currentUser.sendEmailVerification().then(() => {
                firebase.auth().signOut();
              });
            })
            .catch((err) => {
              alertErrors(err?.code);
              setIsLoading(false);
            });
        })

        .catch((err) => {
          alertErrors(err?.code);
          setIsLoading(false);
        });
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <Form.Field>
        <Input
          defaultValue={email}
          type="text"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </Form.Field>
      <Form.Field>
        <Input
          placeholder="Password"
          type={showPassword ? "text" : "password"}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          icon={
            <Icon
              name={showPassword ? "eye slash outline" : "eye"}
              link
              onClick={() => setShowPassword(!showPassword)}
            />
          }
        />
      </Form.Field>
      <Button type="submit" loading={isLoading}>
        {" "}
        Update Email{" "}
      </Button>
    </Form>
  );
}
