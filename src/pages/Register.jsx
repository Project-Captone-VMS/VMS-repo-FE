import React, { useEffect, useState } from "react";
import { registerUser } from "../services/apiRequest";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import container from "../assets/images/Container.png";
import circle from "../assets/images/circle.png";
import logo from "../assets/images/logo.png";

const Register = () => {
  const [isSecondForm, setIsSecondForm] = useState(false);
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSecondFormSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return;
    }
    const newUser = {
      firstName,
      lastName,
      phoneNumber,
      email,
      username,
      password,
    };
    registerUser(newUser, dispatch, navigate);
  };

  const handleBack = () => {
    setIsSecondForm(false);
  };

  const handleFirstFormSubmit = (e) => {
    e.preventDefault();
    setIsSecondForm(true);
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
          <img src={logo} alt="VMS Logo" className="w-[70px] mb-1 mt-5" />
          <p className="text-[#055bc7] text-4xl font-bold">VMS</p>
        </div>
        <div className="text-left w-full">
          <h2 className="text-3xl font-semibold mb-2">Hello</h2>
          <p className="text-sm text-gray-500 mb-4">
            {isSecondForm ? "Create your account" : "Register to Get Started"}
          </p>
        </div>

        {!isSecondForm ? (
          <form
            onSubmit={handleFirstFormSubmit}
            className="w-full flex flex-col"
          >
            <div className="flex justify-between gap-3">
              <div>
                <label
                  for="First Name"
                  class="block text-sm font-normal0 text-gray-500 dark:text-gray-700"
                >
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="First Name"
                  className=" text-black rounded-lg border-2 border-inherit block w-full p-2 "
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  for="Last Name"
                  class="block  text-sm font-normal0 text-gray-500 dark:text-gray-700"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Last Name"
                  className=" text-black rounded-lg border-2 border-inherit block w-full p-2 "
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="mt-2">
              <label
                for="Email"
                class="block text-sm font-normal0 text-gray-500 dark:text-gray-700"
              >
                Email
              </label>
              <input
                type="text"
                placeholder="Email"
                className=" text-black rounded-lg border-2 border-inherit block w-full p-2 "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mt-2">
              <label
                for="Phone Number"
                class="block text-sm font-normal0 text-gray-500 dark:text-gray-700"
              >
                Phone Number
              </label>
              <input
                type="text"
                placeholder="Phone Number"
                className=" text-black rounded-lg border-2 border-inherit block w-full p-2"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#0073ff] text-[white] cursor-pointer text-base p-2 rounded-[5px] border-[none] hover:bg-[#005bb5] mt-6"
            >
              Next
            </button>
            <p className="mt-2 text-center text-sm font-light text-gray-500 dark:text-gray-500">
              Already a member?{" "}
              <a
                href="/login"
                className="font-medium text-primary-600 hover:underline dark:text-primary-500 text-[#0073ff] "
              >
                Login
              </a>
            </p>
          </form>
        ) : (
          <form
            onSubmit={handleSecondFormSubmit}
            className="w-full flex flex-col"
          >
            <div className="mt-2">
              <label
                for="Username"
                class="block text-sm font-normal0 text-gray-500 dark:text-gray-700"
              >
                User name
              </label>
              <input
                type="text"
                placeholder="Username"
                className=" text-black rounded-lg border-2 border-inherit block w-full p-2"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="mt-2">
              <label
                for="password"
                class="block text-sm font-normal0 text-gray-500 dark:text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                placeholder="Password"
                className=" text-black rounded-lg border-2 border-inherit block w-full p-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="mt-2">
              <label
                for="Confirm Password"
                class="block text-sm font-normal0 text-gray-500 dark:text-gray-700"
              >
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm Password"
                className=" text-black rounded-lg border-2 border-inherit block w-full p-2"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full mt-4 bg-[#0073ff] text-[white] cursor-pointer text-base p-3 rounded-[5px] border-[none] hover:bg-[#005bb5]"
            >
              Register
            </button>

            <div className="flex justify-between gap-12 mt-3 mb-3 w-72">
              <button
                type="button"
                onClick={handleBack}
                className=" text-[#0073ff] underline"
              >
                Back
              </button>
              <p className="text-center text-sm font-light text-gray-500 dark:text-gray-500">
                Already a member?{" "}
                <a
                  href="/login"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500 text-[#0073ff] "
                >
                  Login
                </a>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;
