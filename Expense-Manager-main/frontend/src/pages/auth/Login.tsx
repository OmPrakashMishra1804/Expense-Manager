import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import HashLoader from "react-spinners/HashLoader";
import Carousel from "../../components/ui/Carousel";
import { LOGIN_USER } from "../../api/authAPIs";
import img1 from '../../assets/carousel-img1.png';
import img2 from '../../assets/carousel-img2.png';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const slides = [img1, img2];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await LOGIN_USER({ email, password });
      if (response.success) {
        localStorage.setItem("expToken", response.token || "");
        localStorage.setItem("expUser", JSON.stringify(response.data));
        toast.success("Logged in Successfully!");
        navigate("/");
      } else {
        toast.error(response.error || "Enter valid Credentials!");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#1e3a8a]">
      <div className="flex w-[800px] h-[600px] bg-gradient-to-br from-[#1e293b] to-[#0f172a] rounded-xl rounded-bl-[65px] overflow-hidden shadow-2xl">
        <div className="w-2/5 bg-slate-500 flex items-center justify-center m-3 rounded-xl rounded-bl-[65px] rounded-tr-[65px]">
          <Carousel autoSlide={true}>
            {slides.map((s, i) => (
              <img key={i} src={s} alt="Expense-Ease" />
            ))}
          </Carousel>
        </div>
        <div className="w-3/5 p-6 px-8 mt-16">
          <h2 className="text-3xl font-bold text-white mb-4">
            Welcome to{" "}
            <span className="gradient-text">ExpenseEase</span>
          </h2>
          <p className="text-gray-400 mb-6">
            <span className="text-2xl">👋</span> Log in to continue your journey.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-8">
              <label className="block text-gray-300 mb-1" htmlFor="email">
                Email
              </label>
              <input
                className="w-full p-3 rounded-lg bg-[#1e293b] text-white placeholder-gray-500 border border-[#334155] focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400"
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-12">
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
              {loading ? <HashLoader size={35} color="white" /> : "Login"}
            </button>
          </form>

          <div className="text-gray-400 mt-6 text-center">
            Not signed up?{" "}
            <span className="text-indigo-300 font-semibold">
              <Link to="/signup">Sign Up</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
