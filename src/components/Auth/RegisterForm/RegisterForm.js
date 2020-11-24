import React, { useState } from "react";
import { Button, Icon, Form, Input } from "semantic-ui-react";
import { toast } from "react-toastify";
import { validateEmail } from "../../../utils/Validations";
import firebase from "../../../utils/Firebase";
import "firebase/auth";

import "./RegisteForm.scss";

export default function RegisterForm(props) {
  const { setSelectedForm } = props;
  const [formData, setFormData] = useState(defaultValueForm());
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState({});
  const [isLoading, setisLoading] = useState(false);

  const handlerShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = () => {
    setFormError({});
    let errors = {};
    let formOk = true;

    if (!validateEmail(formData.email)) {
      errors.email = true;
      formOk = false;
    }

    if (formData.password.length < 6) {
      errors.password = true;
      formOk = false;
    }

    if (!formData.username) {
      errors.username = true;
      formOk = false;
    }

    setFormError(errors);

    if (formOk) {
      setisLoading(true);
      firebase
        .auth()
        .createUserWithEmailAndPassword(formData.email, formData.password)
        .then(() => {
          console.log("Success");
          changeUserName();
          sendVerificationEmail();
        })
        .catch(() => {
          toast.error("Error in creating account");
        })
        .finally(() => {
          setisLoading(false);
          setSelectedForm(null);
        });
    }
  };

  const changeUserName = () => {
    firebase
      .auth()
      .currentUser.updateProfile({
        displayName: formData.username,
      })
      .catch(() => {
        toast.error("Error! Username alreday taken!");
      });
  };

  const sendVerificationEmail = () => {
    firebase
      .auth()
      .currentUser.sendEmailVerification()
      .then(() => {
        toast.success("Verification email was sent successfully");
      })
      .catch(() => {
        toast.error("Error to send verification e-mail. ");
      });
  };

  return (
    <div className="register-form">
      <h1>Start listen to your favorite music for FREE!</h1>
      <Form onSubmit={onSubmit} onChange={onChange}>
        <Form.Field>
          <Input
            type="text"
            name="email"
            placeholder="Write your e-mail"
            icon="mail outline"
            error={formError.email}
          />
          {formError.email && (
            <span className="error-text">Please, enter a valid e-mail</span>
          )}
        </Form.Field>
        <Form.Field>
          <Input
            type={showPassword ? "text" : "password"}
            name="password"
            error={formError.password}
            placeholder="Enter your password"
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
          {formError.password && (
            <span className="error-text">
              Please, enter a password bigger than 6 characteres
            </span>
          )}
        </Form.Field>
        <Form.Field>
          <Input
            type="text"
            name="username"
            placeholder="Enter your nickname"
            icon="user circle outline"
            error={formError.username}
          />
          {formError.username && (
            <span className="error-text">Please, enter a nickname</span>
          )}
        </Form.Field>
        <Button type="submit" loading={isLoading}>
          Next
        </Button>
      </Form>

      <div className="register-form__options">
        <p onClick={() => setSelectedForm(null)}>Go back</p>
        <p>
          Have an account? /{" "}
          <span onClick={() => setSelectedForm("login")}>Log in</span>
        </p>
      </div>
    </div>
  );
}

function defaultValueForm() {
  return {
    email: "",
    password: "",
    username: "",
  };
}
