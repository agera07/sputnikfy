import { toast } from "react-toastify";

export default function alertErrors(type) {
  switch (type) {
    case "auth/wrong-password":
      toast.warning("Password is not correct!");
      break;
    case "auth/email-already-in-use":
      toast.warning("Email is already in use!");
      break;

    default:
      toast.warning("Server problems, try later!");
      break;
  }
}
