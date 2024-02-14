import { useState, useEffect } from "react";
import { FaLock, FaLockOpen } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import Spinner from "../Loader/Spinner";
import { useNavigate } from "react-router-dom";

function Signup() {
  const initialValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  useEffect(() => {
    const handleSignUp = async () => {
      if (Object.keys(formErrors).length === 0 && isSubmit) {
        // console.log("inside sign up");
        formValues.email = formValues.email.trim();
        try {
          const resp = await axios.post(
            "http://localhost:3000/auth/signup",
            formValues
          );
          // console.log(resp.data);
          if(resp.data.code === 200){
            setTimeout(() => {
              navigate("/auth/login");
            }, 2000);
          }
          else alert("Error Occured! Try Again")
        } catch (err) {
          console.error(err);
        }
      }
    };

    handleSignUp();
  }, [isSubmit, formErrors]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors(validate(formValues));
    setIsSubmit(true);
  };

  const validate = (values) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.username) {
      errors.username = "*Required";
    }
    if (!values.email) {
      errors.email = "*Required";
    } else if (!regex.test(values.email)) {
      errors.email = "This is not a valid email format!";
    }
    if (!values.password) {
      errors.password = "*Required";
    } else if (values.password.length < 4) {
      errors.password = "Password must be more than 4 characters";
    } else if (values.password.length > 10) {
      errors.password = "Password cannot exceed more than 10 characters";
    }
    if (values.password !== values.confirmPassword) {
      errors.confirmPassword = "Passwords didn't match. Try again.";
    }
    return errors;
  };

  return (
    <>
      <div className="container w-[20rem] flex-col items-center translate-x-[160%] translate-y-[15%] border-2 border-gray-400 rounded-md ">
        {Object.keys(formErrors).length === 0 && isSubmit && <Spinner />}

        <form onSubmit={handleSubmit}>
        <div className="flex justify-center items-center w-72 pt-4 font-bold text-lg">Sign Up</div>
          <div className="ui divider"></div>
          <div className="ui form w-[18rem] p-5 flex-col items-center justify-center">
            <div className="field mt-4">
              <input
                type="text"
                name="username"
                placeholder="Choose a username"
                value={formValues.username}
                onChange={handleChange}
                className=" indent-1 border-gray-400 border-2 p-2 w-[15.8rem] rounded-md"
              />
            </div>
            <p className=" text-red-700 ">{formErrors.username}</p>
            <div className="ui form w-[18rem] mt-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formValues.email}
                onChange={handleChange}
                className=" indent-1 border-gray-400 border-2 p-2 w-[15.8rem] rounded-md"
              />
            </div>
            <p className=" text-red-700 mb-6">{formErrors.email}</p>
            <div className="field mt-4 flex gap-1 justify-center items-center w-[17rem]">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formValues.password}
                onChange={handleChange}
                className=" indent-1 border-gray-400 border-2 p-2 w-[18rem] rounded-md"
              />
              <i
                className="password-icon"
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
              >
                {showPassword ? <FaLockOpen /> : <FaLock />}
              </i>
            </div>
            <p className=" text-red-700 mb-4">{formErrors.password}</p>
            <div className="field mt-4 flex gap-1 justify-center items-center w-[16.5rem]">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formValues.confirmPassword}
                onChange={handleChange}
                className=" indent-1 border-gray-400 border-2 p-2 w-[15.8rem] rounded-md"
              />
            </div>
            <p className=" text-red-700 mb-6">{formErrors.confirmPassword}</p>
            <div className=" flex justify-center items-center mt-4">
            <button className="fluid ui button blue bg-green-600 text-white p-2 w-[10rem] rounded-md hover:bg-green-700">Submit</button>
            </div>
          </div>
        </form>
        <div className="text flex justify-center items-center pb-4">
          Already have an account? <Link to="/auth/login" className=" text-green-600">Login</Link>
        </div>
      </div>
    </>
  );
}

export default Signup;
