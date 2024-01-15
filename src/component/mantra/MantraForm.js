import { useFormik } from "formik";
import React, { useEffect } from "react";
import { mantraAdd } from "../../store/slice/mantraSlice";
import { useDispatch, useSelector } from "react-redux";

const MantraForm = ({ closeForm }) => {
  const token = useSelector((state) => state?.auth?.token);
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      mantras_desc: "",
    },
    onSubmit: (values) => {
      if (!values.mantras_desc.trim()) {
        formik.handleReset();
        closeForm();
        return;
      }

      let payload = {
        token: token,
        values: values,
      };
      dispatch(mantraAdd(payload));
      closeForm();
    },
  });
  const handleReset = () => {
    formik.handleReset();
    closeForm();
  };
  return (
    <div className="mantra-box">
      <form>
        <textarea
          id="mantras_desc"
          name="mantras_desc"
          value={formik.values.mantras_desc}
          onChange={formik.handleChange}
          placeholder="Write your New Mantra details..."
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

export default MantraForm;
