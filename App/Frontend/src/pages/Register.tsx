import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";

import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("  ");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [serverResponse, setServerResponse] = useState("");
  const [infoUser, setInfoUser] = useState(false);
  const [infoPassword, setInfoPassword] = useState(false);

  const [sent, setSent] = useState(false);

  const navigate = useNavigate();


  /*
      Send registration data
  */

  const emailRegex = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

  /* nonce get */

  const nonce = document
    .querySelector('meta[property="csp-nonce"]')
    ?.getAttribute("content");

  const cache = createCache({
    key: "mui",
    nonce: nonce!,
  });

  /*
    Sent data to backend 
  */


  const handleSubmit = async () => { 
    const csrfToken = await fetch('/api/csrf-token').then(res => res.json());

    if (username && email && password && confirmPassword) {
      try {
        if (
          username.length >= 1 &&
          password.length >= 1 &&
          password === confirmPassword &&
          emailRegex.test(email)
        ) {
          const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json",
               'X-CSRF-Token': csrfToken.csrfToken },
            body: JSON.stringify({ username, email, password, phoneNumber }),
          };
          console.log("sent");
          const response = await fetch(
            "https://localhost:3000/api/register",
            requestOptions
          );

          const data = await response.json();
          if (response.ok) {
            navigate("/login");
            window.location.reload();
          } else {
            setServerResponse(data);
            console.log(data);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <CacheProvider value={cache}>
      <section className=" mx-auto max-w-[1440px] px-6 lg:px-20 3xl:px-0 flex items-center justify-center flex-col pt-32">
        <div className=" max-w-[555px] w-[400px] bg-slate-500 px-auto  h-auto m-auto px-14 py-10 rounded-md">
          <h3 className="text-[48px] leading-tight md:text-[50px] md:leading-[1.3] mb-8 font-bold">
            Sign up
          </h3>
          <div className=" flex flex-col gap-4 mt-7">
            <input
              type="email"
              placeholder="Email Address"
              className="h-14 w-full pl-5  outline-none rounded-xl"
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => {
                setInfoUser(false);
                setInfoPassword(false);
              }}
            />
            {sent && !emailRegex.test(email) && email ? (
              <Alert className="mb-4" severity="error">
                {" "}
                Incorrect email.{" "}
              </Alert>
            ) : null}
            <input
              type="text"
              placeholder="Username"
              className="h-14 w-full pl-5  outline-none rounded-xl"
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => {
                setInfoUser(true);
                setInfoPassword(false);
              }}
            />
            {infoUser && username.length < 6 ? (
              <Alert className="mb-4" severity="info">
                {" "}
                Username must have at least 6 characters.{" "}
              </Alert>
            ) : null}
            <input
              type="text"
              placeholder="phoneNumber"
              className="h-14 w-full pl-5  outline-none rounded-xl"
              onChange={(e) => setPhoneNumber(e.target.value)}
              onFocus={() => {}}
            />
            <input
              type="password"
              placeholder="Password"
              className="h-14 w-full pl-5  outline-none rounded-xl"
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => {
                setInfoPassword(true);
                setInfoUser(false);
              }}
            />
            {infoPassword && password.length < 6 ? (
              <Alert className="mb-4 " severity="info">
                {" "}
                Password must have at least 6 characters.{" "}
              </Alert>
            ) : null}
            <input
              type="password"
              placeholder="Confirm Password"
              className="h-14 w-full pl-5 outline-none rounded-xl"
              onChange={(e) => setConfirmPassword(e.target.value)}
              onFocus={() => {}}
            />
            {sent && password !== confirmPassword && password ? (
              <Alert className="mb-4" severity="error">
                {" "}
                Passwords don't match.{" "}
              </Alert>
            ) : null}
          </div>
          <button
            className="border border-gray-900 bg-gray-600 px-7 py-3 text-white transition-all hover:bg-black rounded-full my-5 w-full "
            onClick={() => {
              handleSubmit();
              setSent(true);
              setInfoUser(false);
              setInfoPassword(false);
            }}
          >
            Continue
          </button>
          {sent && (!username || !email || !password || !confirmPassword) ? (
            <Alert className="mb-4 " severity="error">
              {" "}
              No field can be empty.
            </Alert>
          ) : null}
          {sent && serverResponse ? (
            <Alert className="mb-4 " severity="error">
              {" "}
              {serverResponse}
            </Alert>
          ) : null}
          <p className="text-black font-bold">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-secondary underline cursor-pointer"
            >
              Login
            </a>
          </p>
        </div>
      </section>
    </CacheProvider>
  );
};

export default Register;
