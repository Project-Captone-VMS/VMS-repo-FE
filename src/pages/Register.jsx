import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from 'lucide-react';
import { registerUser } from "../services/apiRequest";
import { useFormik } from "formik";
import container from "../assets/images/Container.png";
import circle from "../assets/images/circle.png";
import logo from "../assets/images/logo.png";
import * as Yup from "yup";

const Register = () => {
  const [isSecondForm, setIsSecondForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const firstFormSchema = Yup.object().shape({
    firstName: Yup.string()
      .matches(/^[a-zA-Z]+$/, "First name must contain only letters")
      .required("First name is required"),
    lastName: Yup.string()
      .matches(/^[a-zA-Z]+$/, "Last name must contain only letters")
      .required("Last name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required")
      .test('unique-email', 'Email already exists', async function(value) {
        // Implement API call to check if email exists
        const isUnique = await checkEmailUnique(value);
        return isUnique;
      }),
    phoneNumber: Yup.string()
      .matches(/^0\d{9}$/, "Phone number must start with 0 and be 10 digits")
      .required("Phone number is required")
      .test('unique-phone', 'Phone number already exists', async function(value) {
        // Implement API call to check if phone number exists
        const isUnique = await checkPhoneUnique(value);
        return isUnique;
      }),
  });

  const secondFormSchema = Yup.object().shape({
    username: Yup.string()
      .required("Username is required")
      .matches(/^[a-z0-9_]+$/, "Username can only contain lowercase letters, numbers, and underscores")
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must not exceed 20 characters")
      .test('unique-username', 'Username already exists', async function(value) {
        // Implement API call to check if username exists
        const isUnique = await checkUsernameUnique(value);
        return isUnique;
      }),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .max(50, "Password must not exceed 50 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      )
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  const firstFormFormik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
    },
    validationSchema: firstFormSchema,
    onSubmit: () => setIsSecondForm(true),
  });

  const secondFormFormik = useFormik({
    initialValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: secondFormSchema,
    onSubmit: async (values) => {
      const newUser = {
        ...firstFormFormik.values,
        ...values,
      };
      try {
        await registerUser(newUser, dispatch, navigate);
      } catch (error) {
        // Handle registration error
        console.error("Registration failed:", error);
      }
    },
  });

  // Implement these functions to check for uniqueness
  const checkEmailUnique = async (email) => {
    // API call to check if email is unique
    return true; // Replace with actual API call
  };

  const checkPhoneUnique = async (phone) => {
    // API call to check if phone is unique
    return true; // Replace with actual API call
  };

  const checkUsernameUnique = async (username) => {
    // API call to check if username is unique
    return true; // Replace with actual API call
  };

  return (
    <div className="bg-[rgb(243,238,250)] flex h-screen p-[30px]">
      <div
        className="flex-[2] justify-center items-center relative rounded-l-[10px] hidden md:flex"
        style={{
          background:
            "linear-gradient(180deg, #0575e6 0%, #02298a 85%, #021b79 100%)",
        }}
      >
        <div className="z-[2] absolute text-[white] left-[10%] top-[20%]">
          <h1 className="text-3xl lg:text-5xl font-bold">GoFinance</h1>
          <p className="text-sm lg:text-xl">
            Vehicle Monitoring System for Logistics Operations
          </p>
        </div>
        <img
          src={container}
          alt="container"
          className="absolute w-[82%] h-[95%] right-[2%] top-0"
        />
        <img
          src={circle}
          alt="circle"
          className="absolute left-0 bottom-0 w-[60%] h-[40%]"
        />
      </div>

      <div className="flex-1 flex flex-col justify-center items-center bg-[white] p-10 rounded-r-[10px]">
        <div className="flex flex-col items-center mb-4">
          <img src={logo} alt="VMS Logo" className="w-[90px] mb-1" />
          <p className="text-[#055bc7] text-3xl font-bold">VMS</p>
        </div>

        {!isSecondForm ? (
          <form
            onSubmit={firstFormFormik.handleSubmit}
            className="w-full flex flex-col"
          >
            <div className="flex justify-between gap-3">
              <div className="mt-2">
                <label className="block text-sm font-normal text-gray-500">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="first name"
                  value={firstFormFormik.values.firstName}
                  onChange={firstFormFormik.handleChange}
                  onBlur={firstFormFormik.handleBlur}
                  className={`text-black rounded-lg border-2 block w-full p-2 ${
                    firstFormFormik.touched.firstName && firstFormFormik.errors.firstName ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {firstFormFormik.touched.firstName && firstFormFormik.errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">
                    {firstFormFormik.errors.firstName}
                  </p>
                )}
              </div>

              <div className="mt-2">
                <label className="block text-sm font-normal text-gray-500">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="last name"
                  value={firstFormFormik.values.lastName}
                  onChange={firstFormFormik.handleChange}
                  onBlur={firstFormFormik.handleBlur}
                  className={`text-black rounded-lg border-2 block w-full p-2 ${
                    firstFormFormik.touched.lastName && firstFormFormik.errors.lastName ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {firstFormFormik.touched.lastName && firstFormFormik.errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">
                    {firstFormFormik.errors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-2">
              <label className="block text-sm font-normal text-gray-500">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="email"
                value={firstFormFormik.values.email}
                onChange={firstFormFormik.handleChange}
                onBlur={firstFormFormik.handleBlur}
                className="text-black rounded-lg border-2 block w-full p-2"
              />
              {firstFormFormik.touched.email && firstFormFormik.errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {firstFormFormik.errors.email}
                </p>
              )}
            </div>

            <div className="mt-2">
              <label className="block text-sm font-normal text-gray-500">
                Phone Number
              </label>
              <input
                type="text"
                name="phoneNumber"
                placeholder="phone number"
                value={firstFormFormik.values.phoneNumber}
                onChange={firstFormFormik.handleChange}
                onBlur={firstFormFormik.handleBlur}
                className="text-black rounded-lg border-2 block w-full p-2"
              />
              {firstFormFormik.touched.phoneNumber && firstFormFormik.errors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {firstFormFormik.errors.phoneNumber}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#0073ff] hover:bg-[#005bb5] text-white p-2 rounded-lg mt-6"
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
            onSubmit={secondFormFormik.handleSubmit}
            className="w-full flex flex-col"
          >
            {/* Username */}
            <div className="mt-2">
              <label className="block text-sm font-normal text-gray-500">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={secondFormFormik.values.username}
                onChange={secondFormFormik.handleChange}
                onBlur={secondFormFormik.handleBlur}
                className="text-black rounded-lg border-2 block w-full p-2"
              />
              {secondFormFormik.touched.username && secondFormFormik.errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {secondFormFormik.errors.username}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="mt-2 relative">
              <label className="block text-sm font-normal text-gray-500">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={secondFormFormik.values.password}
                onChange={secondFormFormik.handleChange}
                onBlur={secondFormFormik.handleBlur}
                className="text-black rounded-lg border-2 block w-full p-2"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 transform -translate-y-[50%] cursor-pointer"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
              {secondFormFormik.touched.password && secondFormFormik.errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {secondFormFormik.errors.password}
                </p>
              )}
            </div>

            <div className="mt-2">
              <label className="block text-sm font-normal text-gray-500">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={secondFormFormik.values.confirmPassword}
                onChange={secondFormFormik.handleChange}
                onBlur={secondFormFormik.handleBlur}
                className="text-black rounded-lg border-2 block w-full p-2"
              />
              {secondFormFormik.touched.confirmPassword && secondFormFormik.errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {secondFormFormik.errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#0073ff] text-white p-2 rounded-lg mt-4"
            >
              Register
            </button>

            <div className="flex justify-between gap-12 mt-3 mb-3 w-72">
              <button
                type="button"
                onClick={() => setIsSecondForm(false)}
                className=" text-[#0073ff] underline"
              >
                Back
              </button>
              <p className="text-center text-[1.3vw] font-light text-gray-500 dark:text-gray-500">
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

