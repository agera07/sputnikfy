import { toast } from "react-toastify";

export default function alertErrors(type) {
  switch (type) {
    case "auth/wrong-password":
      toast.warning("Password is not correct!");
      break;

    default:
      toast.warning("Server problems, try later!");
      break;
  }
}
