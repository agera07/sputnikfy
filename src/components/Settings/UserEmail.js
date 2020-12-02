import React, { useState } from "react";
import { Button, Form, Input, Icon } from "semantic-ui-react";
import { toast } from "react-toastify";
import { reauthenticate } from "../../utils/Api";

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
        // setReloadApp={setReloadApp}
      />
    );
  };

  return (
    <div className="user-email">
      <h3>Email: {user.email}</h3>
      <Button circular onClick={onEdit}>
        {" "}
        Update
      </Button>
    </div>
  );
}

function ChangeEmailForm(props) {
  const { email, setShowModal, setReloadApp } = props;
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = () => {
    if (!formData.email) {
      setShowModal(false);
    } else {
      setIsLoading(true);
      firebase
        .auth()
        .currentUser.updateProfile({ displayName: formData.email })
        .then(() => {
          setReloadApp((prevState) => !prevState);
          toast.success("Email updated");
          setIsLoading(false);
          setShowModal(false);
        })
        .catch(() => {
          toast.error("Something went wrong, try again!");
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
