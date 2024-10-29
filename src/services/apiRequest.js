import axios from "axios";
import {
  loginFailed,
  loginStart,
  loginSuccess,
  registerFailed,
  registerStart,
  registerSuccess,
} from "../redux/authSlice";

const api = axios.create({
  baseURL: "http://localhost:8082/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

export const loginUser = async (user, dispatch, navigate) => {
  dispatch(loginStart());

  try {
    const res = await api.post("auth/token", user);
    console.log(res.data);
    console.log(dispatch(loginSuccess(res.data)));
    if (res.data.result.roles[0] == "ADMIN") {
      navigate("/dashboard");
    } else if (res.data.result.roles[0] == "USER") {
      navigate("/drive");
    }
  } catch (err) {
    dispatch(loginFailed());
    alert("Login failed. Please check your credentials.");
  }
};

//   try {
//     const res = await api.post("auth/token", user);
//     console.log(res.data);
//     const userData = res.data.user;
//     const roles = res.data.result.roles;

//     // dispatch(loginSuccess(res.data));
//     console.log("ok");
//   } catch (err) {
//     dispatch(loginFailed());
//     alert("Login failed. Please check your credentials.");
//   }
// };

export const registerUser = async (user, dispatch, navigate) => {
  dispatch(registerStart());

  try {
    const res = await api.post("user/create", user);
    dispatch(registerSuccess(res.data));
    console.log(res.data);
    alert("ok");
    navigate("/login");
  } catch (err) {
    dispatch(registerFailed());
  }
};
