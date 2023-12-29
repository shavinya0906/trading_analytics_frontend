import { useFormik } from "formik";
import React, { useEffect } from "react";
import { useStrategy } from "../../context/StrategyContext";
import { strategyAdd, strategyEdit } from "../../store/slice/strategySlice";
import { useDispatch, useSelector } from "react-redux";

const StrategyForm = () => {
  const { formData, formToggle, setFormStatus, setFormData, formStatus } = useStrategy();
  const token = useSelector((state) => state?.auth?.token);
  const dispatch = useDispatch()
  const formik = useFormik({
    initialValues: {
      strategies_name: "",
      strategies_desc: "",
    },
    onSubmit: (values) => {
      let payload = {
        token: token,
        values: values,
        // values: {...values, user_id: "aksujbdllk"},
      };
      if (formStatus === "add") {
        dispatch(strategyAdd(payload));
      } else if (formStatus === "edit") {
        payload = {
          ...payload,
          values: {
            ...payload.values,
            strategies_Id: formData.strategies_Id
          }
        }
        dispatch(strategyEdit(payload));
      }
      setFormStatus("none")

    },
  });
  useEffect(() => {
    formik.setValues({ ...formData });
  }, [formToggle]);
  const handleReset = () => {
    formik.handleReset();
    setFormStatus("none");
    setFormData({
      strategies_name: "",
      strategies_desc: "",
    });
  };
  return (
    <div className="strategy-box">
      <form>
        <input
          id="strategies_name"
          name="strategies_name"
          value={formik.values.strategies_name}
          onChange={formik.handleChange}
          placeholder="Strategy Name"
        />
        <textarea
          id="strategies_desc"
          name="strategies_desc"
          value={formik.values.strategies_desc}
          onChange={formik.handleChange}
          placeholder="Write your New Strategy details..."
        />
        <div className="btn-box">
          <button className="cancel" type="submit" onClick={handleReset}>
            Cancel
          </button>
          <button className="save" type="submit" onClick={formik.handleSubmit}>
            {" "}
            Save{" "}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StrategyForm;
