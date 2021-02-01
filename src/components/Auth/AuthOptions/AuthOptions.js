import React from "react";
import { Button } from "semantic-ui-react";
import "./AuthOptions.scss";

export default function AuthOptions(props) {
  const { setSelectedForm } = props;

  return (
    <div className="auth-options">
      <h2>
        {" "}
        Don't miss your favorites song everywhere you go, try Sputnikfy!{" "}
      </h2>
      <Button
        className="register"
        onClick={() => {
          setSelectedForm("register");
        }}
      >
        Sign up free
      </Button>
      <Button
        className="login"
        onClick={() => {
          setSelectedForm("login");
        }}
      >
        Log in
      </Button>
    </div>
  );
}
