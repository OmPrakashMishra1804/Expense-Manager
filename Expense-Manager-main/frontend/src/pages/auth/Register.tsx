import React, { useState } from "react";
import { Link } from "react-router-dom";
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import HashLoader from 'react-spinners/HashLoader';
import Carousel from "../../components/ui/Carousel";
import { REGISTER_USER } from "../../api/authAPIs";
import img1 from '../../assets/carousel-img1.png';
import img2 from '../../assets/carousel-img2.png';

const SignupPage = () => {
  let navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const slides = [img1, img2];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const data = { email, password, name };
    try {
      const response = await REGISTER_USER(data);
      if (response.success) {
        toast.success("Congratulations! You are successfully registered.");
        navigate("/login");
      } else {
        toast.error(response.error || "Registration failed. Please try again.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#1e3a8a]">
      <div className="flex w-[800px] h-[600px] bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-xl rounded-bl-[65px] overflow-hidden shadow-2xl">
        <div className="w-2/5 bg-slate-500 flex items-center justify-center m-3 rounded-xl rounded-bl-[65px] rounded-tr-[65px]">
          <Carousel autoSlide={true} >
            {slides.map((s, i) => (
              <img key={i} src={s} alt="Expense-Ease" />
            ))}
          </Carousel>
        </div>
        <div className="w-3/5 p-6 px-8 mt-12 py-5">
          <h2 className="text-3xl font-bold text-white mb-4">
            Welcome to{" "}
            <span className="gradient-text">ExpenseEase</span>
          </h2>
          <p className="text-gray-400 mb-6">
            <span className="text-2xl">👋</span> Sign Up to get started.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block text-gray-300 mb-1" htmlFor="name">
                Full Name
              </label>
              <input
                className="w-full p-3 rounded-lg bg-[#1e293b] text-white placeholder-gray-500 border border-[#334155] focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400"
                type="text"
                placeholder="Enter your full name"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-5">
              <label className="block text-gray-300 mb-1" htmlFor="email">
                Email
              </label>
              <input
                className="w-full p-3 rounded-lg bg-[#1e293b] text-white placeholder-gray-500 border border-[#334155] focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400"
                type="email"
                placeholder="Enter your email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-10">
              <label className="block text-gray-300 mb-1" htmlFor="password">
                Password
              </label>
              <input
                className="w-full p-3 rounded-lg bg-[#1e293b] text-white placeholder-gray-500 border border-[#334155] focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400"
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              className="w-full p-3 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 transition duration-300 shadow-lg"
              type="submit"
            >
              {loading ? <HashLoader size={35} color="white" /> : "Register"}
            </button>
          </form>
          <div className="text-center mt-2 text-gray-400">
            Already registered? {" "}
            <span>
              <Link to="/login" className="text-indigo-300">Login</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
