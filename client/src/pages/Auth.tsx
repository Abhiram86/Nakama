import Login from "../components/Login";
import Register from "../components/Register";
import { useSearchParams } from "react-router-dom";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  return <section>{type === "register" ? <Register /> : <Login />}</section>;
};

export default Auth;
