import { useState } from "react";
import { registerUser } from "../services/api";

export default function Register() {
  const [display_name, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await registerUser({ display_name, username, email, password });
    console.log(res.data); // created user
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={display_name} onChange={e=>setDisplayName(e.target.value)} placeholder="Display Name" />
      <input type="text" value={username} onChange={e=>setUsername(e.target.value)} placeholder="Username" />
      <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" />
      <button type="submit">Register</button>
    </form>
  );
}
