import { useEffect, useState } from "react";

import { AiOutlineGold } from "react-icons/ai";
import  mychits  from "../../src/assets/images/Logo.svg"
import { useNavigate } from "react-router-dom";
import api from "../instance/TokenInstance";
import {Input} from "antd";

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(`/admin/login`, {
        phoneNumber,
        password,
      });

      const { token } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user",JSON.stringify(response?.data?.admin))
      navigate("/dashboard");
      console.log("Login successful:", token);
    } catch (error) {
      setError("Invalid phone number or password.");
      console.error("Login error:", error);
    }
  };

  return (
    <>
      {/* <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-28 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img src={mychits} alt="MyChits" className="mx-auto  h-25 w-auto text-primary" />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Login to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Phone Number
              </label>
              <div className="mt-2">
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="text"
                  required
                  autoComplete="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-100 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-primary hover:text-red-500"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-red-200 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div> */}
      <div className="min-h-screen flex flex-col justify-center items-center px-6 py-20 bg-gray-50">
  <div className="w-full max-w-md space-y-8">
    

    <form onSubmit={handleLogin} className="space-y-6 bg-white p-20 shadow-3xl border rounded-3xl">
      <div className="text-center">
      <img src={mychits} alt="MyChits" className="mx-auto h-36 w-auto" />
      <h2 className="mt-6 text-2xl font-bold text-gray-900">
        Sign In
      </h2>
    </div>
      <div>
        <label htmlFor="phoneNumber" className="ml-3 block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <Input
          id="phoneNumber"
          name="phoneNumber"
          type="text"
          required
          autoComplete="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="mt-2 block w-full rounded-3xl border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        />
      </div>

      <div>
        <div className="flex justify-between items-center">
          <label htmlFor="password" className=" ml-3 block text-sm font-medium text-gray-700">
            Password
          </label>
          <a href="#" className="text-sm font-medium text-primary hover:underline">
            Forgot password?
          </a>
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 block w-full rounded-3xl border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        className="w-full flex justify-center items-center px-4 py-2 bg-primary text-white text-sm font-semibold rounded-3xl shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        Login
      </button>
    </form>
  </div>
</div>

    </>
  );
};

export default Login;
