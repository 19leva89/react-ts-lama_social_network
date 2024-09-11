import { useState, ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";

import axios from "axios";
import { BASE_URL } from "../../axios";

const Register = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
  });

  const [err, setErr] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await axios.post(`${BASE_URL}/auth/register`, inputs);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setErr(err.response?.data);
      } else {
        setErr("An unexpected error occurred");
      }
    }
  };

  // console.log(inputs)
  // console.log(err)

  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>Dima Social.</h1>

          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cum, alias totam numquam
            ipsa exercitationem dignissimos, error nam, consequatur.
          </p>

          <span>Do you have an account?</span>

          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>

        <div className="right">
          <h1>Register</h1>

          <form onSubmit={handleRegister}>
            <input type="text" placeholder="Username" name="username" onChange={handleChange} />

            <input type="email" placeholder="Email" name="email" onChange={handleChange} />

            <input type="password" placeholder="Password" name="password" onChange={handleChange} />

            <input type="text" placeholder="Name" name="name" onChange={handleChange} />

            {err && err}
            <button type="submit">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
