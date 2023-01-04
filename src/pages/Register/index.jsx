import { Link } from "react-router-dom";
import { useState } from "react";
import { LayoutComponents } from "../../components/LayoutComponents/index";
import { api } from "../../services/api";

export const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name,
      email,
      password,
    };
    await api.post("/blog/register", data);
    alert("Usuário criado com sucesso!");
  };

  return (
    <LayoutComponents>
      <form onSubmit={handleSubmit} className="login-form">
        <span className="login-form-title"> Criar Conta </span>

        <div className="wrap-input">
          <input
            className={name !== "" ? "has-val input" : "input"}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <span className="focus-input" data-placeholder="Nome"></span>
        </div>

        <div className="wrap-input">
          <input
            className={email !== "" ? "has-val input" : "input"}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <span className="focus-input" data-placeholder="Email"></span>
        </div>

        <div className="wrap-input">
          <input
            className={password !== "" ? "has-val input" : "input"}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="focus-input" data-placeholder="Password"></span>
        </div>

        <div className="container-login-form-btn">
          <button type="submit" className="login-form-btn">
            Criar Conta
          </button>
        </div>

        <div className="text-center">
          <span className="txt1">Já possui conta? </span>
          <Link className="txt2" to="/login">
            Login.
          </Link>
        </div>
      </form>
    </LayoutComponents>
  );
};
