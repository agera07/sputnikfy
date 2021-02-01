import React, { useState } from "react";
import { Button, Icon, Form, Input } from "semantic-ui-react";
import { toast } from "react-toastify";
import { validateEmail } from "../../../utils/Validations";
import firebase from "../../../utils/Firebase";
import "firebase/auth";
import "./LoginForm.scss";

export default function LoginForm(props) {
  const { setSelectedForm } = props;
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(defaultValueForm());
  const [formError, setFormError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userActive, setUserActive] = useState(true);
  const [user, setUser] = useState(null);

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

    setFormError(errors);

    if (formOk) {
      setIsLoading(true);
      firebase
        .auth()
        .signInWithEmailAndPassword(formData.email, formData.password)
        .then((response) => {
          setUser(response.user);
          setUserActive(response.user.emailVerified);
          if (!response.user.emailVerified) {
            toast.warning("To access: Please, verify your email ");
          }
        })
        .catch((err) => {
          console.log(err);
          handlerErrors(err.code);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  return (
    <div className="login-form">
      <h1>To the sky with your music!</h1>

      <Form onSubmit={onSubmit} onChange={onChange}>
        <Form.Field>
          <Input
            type="text"
            name="email"
            placeholder="Enter your email"
            icon="mail outline"
            error={formError.email}
          />

          {formError.email && (
            <span className="error-text">Please, enter a valid email</span>
          )}
        </Form.Field>
        <Form.Field>
          <Input
            type={showPassword ? "text" : "password"}
            name="password"
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
            error={formError.password}
          />
          {formError.password && (
            <span className="error-text">
              Please, enter a password bigger than 6 characteres
            </span>
          )}
        </Form.Field>
        <Button type="submit" loading={isLoading}>
          {" "}
          Log in
        </Button>
      </Form>

      {!userActive && (
        <ButtonResetSendEmailVerification
          user={user}
          setisLoading={setIsLoading}
          setUserActive={setUserActive}
        />
      )}

      <div className="login-form__options">
        <p onClick={() => setSelectedForm(null)}> Back</p>
        <p>
          Get an account{" "}
          <span
            className="login-link"
            onClick={() => setSelectedForm("register")}
          >
            here!
          </span>
        </p>
      </div>
    </div>
  );
}

function ButtonResetSendEmailVerification(props) {
  const { user, setisLoading, setUserActive } = props;

  const resendVerificationEmail = () => {
    user
      .sendEmailVerification()
      .then(() => {
        toast.success("Verification email was sent again");
      })
      .catch((err) => {
        console.log(err);
        handlerErrors(err.code);
      })
      .finally(() => {
        setisLoading(false);
        setUserActive(true);
      });
  };

  return (
    <div className="resend-verification-email">
      <p>
        Resend verification email{" "}
        <span onClick={resendVerificationEmail}>here</span>
      </p>
    </div>
  );
}

function handlerErrors(code) {
  switch (code) {
    case "auth/wrong-password":
      toast.warning("Username or Password incorrect");
      break;
    case "auth/too-many-requests":
      toast.warning("Too many email request, wait 2 minutes");
      break;
    case "auth/user-not-found":
      toast.warning("Username or Password incorrect");
      break;
    default:
      break;
  }
}

function defaultValueForm() {
  return {
    email: "",
    password: "",
    username: "",
  };
}
