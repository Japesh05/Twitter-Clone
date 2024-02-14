import { useEffect, useState } from "react";
import { FaLock, FaLockOpen } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../Loader/Spinner";
import { useDispatch } from "react-redux";
import { setId, updateEmail, updateLogin } from "../features/auth/authSlice";


function Login() {
  const initialValues = {
    email: "",
    password: "",
  };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [userid, setUserid] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleLogin = async () => {
      if (Object.keys(formErrors).length === 0 && isSubmit && !success) {
        formValues.email = formValues.email.trim();
        try {
          const resp = await axios.post(
            "http://localhost:3000/auth/login",
            formValues
          );
          if (resp.data.code === 200) {
            dispatch(updateEmail(formValues.email));
            localStorage.setItem("token", resp.data.token);
            dispatch(setId(resp.data.message[0].id));
            setUserid(resp.data.message[0].id)
            setSuccess(true);
          } else {
            alert(`${resp.data.message}`);
            setIsSubmit(false);
            return;
          }
        } catch (err) {
          console.log(err);
        }
      }
      else if(success){
        setTimeout(() => {
          dispatch(updateLogin(true));
          localStorage.setItem("isLoggedin", true);
          navigate(`/home/${userid}`);
        }, 2000);
      }
    };

    handleLogin();
  }, [isSubmit, formErrors, success]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors(validate(formValues));
    setIsSubmit(true);
  };

  const validate = (values) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

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

    return errors;
  };

  return (
    <>
      <div className="container w-[18rem] flex-col items-center translate-x-[200%] translate-y-1/4 border-2 border-gray-400 rounded-md ">
        {/* {success && <Spinner />} */}

        <form onSubmit={handleSubmit} className=" w-16">
          <div className="flex justify-center items-center w-72 p-2 pt-4 font-bold text-lg">Login</div>
          <div className="ui divider"></div>
          <div className="ui form w-[18rem] p-5 flex-col items-center justify-center">
            <div className="field mt-4">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formValues.email}
                onChange={handleChange}
                className=" indent-1 border-gray-400 border-2 p-2 w-[15rem] rounded-md"
              />
            </div>
            <p className=" text-red-700 mb-6">{formErrors.email}</p>
            <div className="field mt-4 flex gap-1 justify-center items-center w-[16.5rem]">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
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
                {showPassword ? <FaLockOpen className=" hover:cursor-pointer" /> : <FaLock className=" hover:cursor-pointer"/>}
              </i>
            </div>
            <p className=" text-red-700 mb-6">{formErrors.password}</p>
            <div className=" flex justify-center items-center mt-4">
            <button className="fluid ui button blue bg-green-600 text-white p-2 w-[10rem] rounded-md hover:bg-green-700">Submit</button>
            </div>
          </div>
        </form>
        <div className="text flex justify-center items-center pb-4">
          New Here? <Link to="/auth/signup" className=" text-green-600"> Create an Account</Link>
        </div>
      </div>
    </>
  );
}

export default Login;
