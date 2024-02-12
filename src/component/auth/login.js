import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { LoginUser } from "../../store/slice/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state?.auth?.token);
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (token) {
  //     setTimeout(() => {
  //       navigate("/");
  //     }, 400);
  //   }
  // }, [token]);

  const loginSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, "Too Short!")
      .max(50, "Too Long!")
      .required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    dispatch(LoginUser(values));
    setSubmitting(false);
    navigate("/");
  };

  return (
    <>
      <h1>Login</h1>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={loginSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => {
          return (
            <Form className="d-flex align-items-start flex-column">
              <label className="m-2">
                Email: <Field type="email" name="email" />
                <ErrorMessage name="email" component="div" />
              </label>
              <label className="m-2">
                Password:
                <Field type="password" name="password" />
                <ErrorMessage name="password" component="div" />
              </label>
              <button type="submit" className="m-2" disabled={isSubmitting}>
                Submit
              </button>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default Login;
