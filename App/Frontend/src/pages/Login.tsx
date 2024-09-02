import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [sent, setSent] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (username && password) {
      const requestOptions = {
        method: "POST",
        credentials: "include" as RequestCredentials,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      };
      const response = await fetch(
        "http://localhost:3000/api/login",
        requestOptions
      );
      
      if (response.status !== 200) {
        console.log(response.json())
      } else {
        const data = await response.json();
        console.log("wysłano");
        console.log('Logged in successfully:', data.message); 
        localStorage.setItem("token", "true");
        navigate("/");
        window.location.reload();
      }
    }
  };
  return (
    <section className="mx-auto max-w-[1440px] px-6 lg:px-20 3xl:px-0 flex items-center justify-center flex-col pt-32">
      <div className="max-w-[555px] h-auto bg-slate-500 m-auto px-14 py-10 rounded-md">
        <h3 className="text-[48px] leading-tight md:text-[50px] md:leading-[1.3] mb-8 font-bold">
          Sign in
        </h3>
        <div className="flex flex-col gap-4 mt-7">
          <input
            type="text"
            placeholder="Username"
            className="h-14 w-full pl-5 outline-none rounded-xl"
            onChange={(e) => setUsername(e.target.value)}
          />
          {sent && !username ? (
            <Alert className="mb-4" severity="error">
              {" "}
              Username can't be empty.{" "}
            </Alert>
          ) : null}
          <input
            type="password"
            placeholder="Password"
            className="h-14 w-full pl-5 outline-none rounded-xl"
            onChange={(e) => setPassword(e.target.value)}
          />
          {sent && !password ? (
            <Alert className="mb-4" severity="error">
              {" "}
              Password can't be empty.{" "}
            </Alert>
          ) : null}
        </div>
        <button
          className="border border-gray-900 bg-gray-600 px-7 py-3 text-white transition-all hover:bg-black rounded-full my-5 w-full"
          onClick={() => {
            handleSubmit();
            setSent(true);
          }}
        >
          Continue
        </button>
        <p className="text-black font-bold">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-secondary underline cursor-pointer"
          >
            Register
          </a>
        </p>
      </div>
    </section>
  );
};

export default Login;
