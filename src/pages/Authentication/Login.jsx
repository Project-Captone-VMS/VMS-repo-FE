import React, { useState } from "react";
import container from "../../assets/images/Container.png";
import circle from "../../assets/images/Circle.png";
import logo from "../../assets/images/logo.png";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
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
          <img src={logo} alt="VMS Logo" className="w-[100px] mb-1" />
          <p className="text-[#055bc7] text-5xl font-bold">VMS</p>
        </div>
        <div className="text-left w-full">
          <h2 className="text-3xl font-semibold mb-2">Hello</h2>
          <p className="text-sm text-gray-500 mb-4">Login to Get Started</p>
        </div>

        <form className="w-full flex flex-col">
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
            className=" w-full bg-[#0073ff] text-[white] cursor-pointer text-base p-3 rounded-[5px] border-[none] hover:bg-[#005bb5]"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
