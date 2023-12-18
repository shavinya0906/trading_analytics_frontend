import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage, FastField } from "formik";
import * as Yup from "yup";
import { addUser, updateUser, userListById } from "../../store/slice/userSlice";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const user = useSelector((state) => state?.users?.data);
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const userSchema = Yup.object().shape({
    first_name:  Yup.string().required("Enter your first name"),
    last_name:  Yup.string().required("Enter your last name"),
    email: Yup.string()
    .email("Please enter valid email")
    .required("Email is required"),
    mobile:  Yup.string().matches(phoneRegExp, "Phone number is not valid").required("Enter your phone number"),
    password: Yup.string().required("Enter your password"),
    role:Yup.string().required("Enter your role")
  });

  const handleSubmit = (values, { setSubmitting }) => {
    if (params?.id) {
      const payload = {
        data: values,
        id: params?.id,
      };
      dispatch(updateUser(payload));
    } else {
      dispatch(addUser(values));
    }

    setSubmitting(false);
    navigate("/");
  };

  useEffect(() => {
    if (params?.id) {
      dispatch(userListById(params.id));
    }
  }, [params]);

  let initialValues = {};

  useEffect(() => {
    if (user) {
      initialValues = user;
    } else {
      initialValues = {
        first_name: "",
        last_name: "",
        email: "",
        mobile: "",
        password: "",
        status: "active",
        role:""
      };
    }
  }, [user, params]);

  return (
    <>
      <h1>Add User</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={userSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values }) => {
          return (
            <Form className="d-flex align-items-start flex-column">
              <label className="m-2">
                First Name : <Field key="1" id="first_name" name="first_name" />
                <ErrorMessage name="first_name" component="div" />
              </label>
              <label className="m-2">
                Last Name : <Field key="1" id="last_name" name="last_name" />
                <ErrorMessage name="last_name" component="div" />
              </label>
              <label className="m-2">
                Email :
                <Field type="email" key="2" name="email" value={values.email} />
                <ErrorMessage name="email" component="div" />
              </label>
              <label className="m-2">
                Mobile : <Field type="mobile" key="4" name="mobile" />
                <ErrorMessage name="mobile" component="div" />
              </label>
              <label className="m-2">
                Role :
                <Field as="select" name="role" key="5">
                  <option key={1} value={"user"}>
                    User
                  </option>
                </Field>
                <ErrorMessage name="role" component="div" />
              </label>
              <label className="m-2">
                Password : <Field type="password" name="password" key="6" />
                <ErrorMessage name="password" component="div" />
              </label>
              <button type="submit" className="m-2" disabled={isSubmitting}>
                Add
              </button>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default Signup;
