import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { loginUser } from "../services/apiRequest.js";
import { useDispatch } from "react-redux";
import container from "../assets/images/Container.png";
import circle from "../assets/images/circle.png";
import logo from "../assets/images/logo.png";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const newUser = {
      username: username,
      password: password,
    };

    loginUser(newUser, dispatch, navigate);
  };

  return (
    <div className="bg-[rgb(243,238,250)] flex h-screen p-[30px] ">
      <div
        className="flex-[2] justify-center items-center relative rounded-l-[10px] hidden md:flex"
        style={{
          background:
            "linear-gradient(180deg, #0575e6 0%, #02298a 85%, #021b79 100%)",
        }}
      >
        <div className="z-[2] absolute text-[white] left-[10%] top-[20%]">
          <h1
            className="text-[color:var(--White,#fff)] text-3xl lg:text-5xl not-italic font-bold leading-[normal]"
            style={{
              fontFamily: "Poppins",
            }}
          >
            GoFinance
          </h1>
          <p
            className="not-italic text-sm lg:text-xl  font-medium leading-[normal] text-[white]"
            style={{
              fontFamily: "Poppins",
            }}
          >
            The most popular peer to peer lending at SEA
          </p>
        </div>
        <img
          src={container}
          alt="Multimodal Logistics Trade"
          className="z-[1] absolute w-[82%] h-[95%] right-[2%] top-0"
        />
        <img
          src={circle}
          alt="circle"
          className="absolute left-0 bottom-0 w-[60%] h-[40%] "
        />
      </div>

      <div className="flex-1 flex flex-col justify-center items-center bg-[white] p-10 rounded-r-[10px]">
        <div className="flex flex-col items-center mb-4 ">
          <img src={logo} alt="VMS Logo" className="w-[70px] mb-1" />
          <p className="text-[#055bc7] text-4xl font-bold">VMS</p>
        </div>

        <div className="text-left w-full">
          <h2 className="text-3xl font-semibold mb-2">Hello</h2>
          <p className="text-sm text-gray-500 mb-4">Login to Get Started</p>
        </div>

        {/* <form className="w-full flex flex-col" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            className="w-full border mb-4 p-3 rounded-[5px] border-solid border-[#ddd]"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border mb-4 p-3 rounded-[5px] border-solid border-[#ddd]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-[#0073ff] text-[white] cursor-pointer text-base p-3 rounded-[5px] border-[none] hover:bg-[#005bb5]"
          >
            Submit
          </button>
        </form> */}

        <form class="space-y-4 md:space-y-2 w-full" onSubmit={handleLogin}>
          <div>
            <label
              for="email"
              class="block mb-1 text-ms font-normal0 text-gray-500 dark:text-gray-700"
            >
              User name
            </label>
            <input
              type="text"
              placeholder="User name"
              className=" text-black rounded-lg border-2 border-inherit block w-full p-2.5 "
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              for="password"
              className="block mb-1 text-ms font-normal0 text-gray-500 dark:text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              name="password"
              className=" text-black  rounded-lg border-2 border-inherit block w-full p-2.5"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input
                  aria-describedby="remember"
                  type="checkbox"
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-100 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                  required=""
                />
              </div>
              <div class="ml-3 text-sm">
                <label
                  for="remember"
                  className="text-gray-500 dark:text-gray-500"
                >
                  Remember me
                </label>
              </div>
            </div>
            <a
              href="#"
              className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500 text-[#0073ff]"
            >
              Forgot password?
            </a>
          </div>
          <button
            type="submit"
            className="w-full bg-[#0073ff] text-[white] cursor-pointer text-base p-3 rounded-[5px] border-[none] hover:bg-[#005bb5]"
          >
            Sign in
          </button>
          <p className="text-sm font-light text-gray-500 dark:text-gray-500">
            Don’t have an account yet?{" "}
            <a
              href="/register"
              className="font-medium text-primary-600 hover:underline dark:text-primary-500 text-[#0073ff] "
            >
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
