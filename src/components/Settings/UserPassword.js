import React, { useState } from "react";
import { Button, Form, Icon, Input } from "semantic-ui-react";
import { toast } from "react-toastify";
import { reauthenticate } from "../../utils/Api";
import alertErrors from "../../utils/AlertErrors";
import firebase from "../../utils/Firebase";
import "firebase/auth";

export default function UserPassword(props) {
  const { setShowModal, setTitleModal, setContentModal } = props;

  const onEdit = () => {
    setTitleModal("Update Password");
    setContentModal(<ChangePasswordForm setShowModal={setShowModal} />);
    setShowModal(true);
  };
  return (
    <div className="user-password">
      <h3>Password: *** *** ***</h3>
      <Button circular onClick={onEdit}>
        Update Password
      </Button>
    </div>
  );
}

function ChangePasswordForm(props) {
  const { setShowModal } = props;
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    repeatNewPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handlerShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = () => {
    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.repeatNewPassword
    ) {
      toast.warning("Password can't be blank");
    } else if (formData.currentPassword === formData.newPassword) {
      toast.warning("Password can't be the same");
    } else if (formData.newPassword !== formData.repeatNewPassword) {
      toast.warning("Password are not the same");
    } else if (formData.newPassword.length < 6) {
      toast.warning("Password has to be bigger than 6 characteres");
    } else {
      setIsLoading(true);
      reauthenticate(formData.currentPassword)
        .then(() => {
          const currentUser = firebase.auth().currentUser;
          currentUser
            .updatePassword(formData.newPassword)
            .then(() => {
              toast.success("Password was updated succesfully");
              setIsLoading(false);
              setShowModal(false);
              firebase.auth().signOut();
            })
            .catch((err) => {
              alertErrors(err?.code);
              setIsLoading(false);
            });
        })
        .catch((err) => {
          setIsLoading(false);
          alertErrors(err?.code);
        });
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <Form.Field>
        <Input
          placeholder="Current password"
          type={showPassword ? "text" : "password"}
          onChange={(e) => {
            setFormData({
              ...formData,
              currentPassword: e.target.value,
            });
          }}
          icon={
            showPassword ? (
              <Icon
                name="eye slash outline"
                link
                onClick={handlerShowPassword}
              />
            ) : (
              <Icon name="eye" link onClick={handlerShowPassword} />
            )
          }
        />
      </Form.Field>
      <Form.Field>
        <Input
          placeholder="New password"
          type={showPassword ? "text" : "password"}
          onChange={(e) => {
            setFormData({
              ...formData,
              newPassword: e.target.value,
            });
          }}
          icon={
            showPassword ? (
              <Icon
                name="eye slash outline"
                link
                onClick={handlerShowPassword}
              />
            ) : (
              <Icon name="eye" link onClick={handlerShowPassword} />
            )
          }
        />
      </Form.Field>
      <Form.Field>
        <Input
          placeholder="Repeat new password"
          type={showPassword ? "text" : "password"}
          onChange={(e) => {
            setFormData({
              ...formData,
              repeatNewPassword: e.target.value,
            });
          }}
          icon={
            showPassword ? (
              <Icon
                name="eye slash outline"
                link
                onClick={handlerShowPassword}
              />
            ) : (
              <Icon name="eye" link onClick={handlerShowPassword} />
            )
          }
        />
      </Form.Field>
      <Button type="submit" loading={isLoading}>
        {" "}
        Update password
      </Button>
    </Form>
  );
}
