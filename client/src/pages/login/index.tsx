import { useContext, useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";
import { AuthContext, AuthContextType } from "../../context/authContext";

const Login = () => {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });

  const [err, setErr] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const { login } = useContext(AuthContext) as AuthContextType;

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await login(inputs);
      navigate("/");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setErr(err.response?.data);
      } else {
        setErr("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="login">
      <div className="card">
        <div className="left">
          <h1>Hello World.</h1>

          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cum, alias totam numquam
            ipsa exercitationem dignissimos, error nam, consequatur.
          </p>

          <span>Don't you have an account?</span>

          <Link to="/register">
            <button>Register</button>
          </Link>
        </div>

        <div className="right">
          <h1>Login</h1>

          <form onSubmit={handleLogin}>
            <input type="text" placeholder="Username" name="username" onChange={handleChange} />

            <input type="password" placeholder="Password" name="password" onChange={handleChange} />

            {err && err}
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
