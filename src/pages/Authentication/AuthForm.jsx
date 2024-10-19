import React, { useState } from "react";
import logo from "../../assets/images/logo.png";

const AuthForm = ({
  title,
  subtitle,
  buttonText,
  onSubmit,
  showConfirmPassword,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div className="form-container flex flex-col justify-center items-center bg-[white]">
      <HeaderSection title={title} subtitle={subtitle} />
      <form onSubmit={onSubmit} className="w-full flex flex-col">
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
        {showConfirmPassword && (
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full border mb-4 p-3 rounded-[5px] border-solid border-[#ddd]"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}
        <button
          type="submit"
          className=" w-full bg-[#0073ff] text-[white] cursor-pointer text-base p-3 rounded-[5px] border-[none] hover:bg-[#005bb5]"
        >
          {buttonText}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;
