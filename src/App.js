import firebase from "./utils/Firebase";
import "firebase/auth";
import { useState } from "react";
import Auth from "./pages/Auth";
import { ToastContainer } from "react-toastify";

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  firebase.auth().onAuthStateChanged((currentUser) => {
    if (!currentUser?.emailVerified) {
      firebase.auth().signOut();
      setUser(null);
    } else {
      setUser(currentUser);
    }
    setIsLoading(false);
  });

  if (isLoading) {
    return null;
  }

  return (
    <>
      {!user ? <Auth /> : <UserLogged />}
      <ToastContainer
        position="top-center"
        autoClose={50000000}
        hideProgressBar
        newestOnTop
        closeOnclick
        rtl={false}
        pauseOnVisibilityChange
        draggable
        pauseOnHover={false}
      />
    </>
  );

  function UserLogged() {
    const logOut = () => {
      firebase.auth().signOut();
    };
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        <h1> User Logged! </h1>
        <button onClick={logOut}> Log Out</button>
      </div>
    );
  }
}

export default App;
