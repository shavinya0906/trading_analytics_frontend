import React, { useEffect, useState } from "react";
import "./mantra.css";
import { useDispatch, useSelector } from "react-redux";
import { mantraList } from "../../store/slice/mantraSlice";
import InvertedComma from "./../../assets/images/invertedCommas.svg";
import MantrasBox from "./MantrasBox";
import MantraForm from "./MantraForm";

const Mantra = () => {
  const token = useSelector((state) => state.auth.token);
  const reduxData = useSelector((state) => state.mantras?.data);
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);

  const closeForm = () => {
    setShowForm(false);
  };

  const showwForm = () => {
    setShowForm(true);
  };

  useEffect(() => {
    dispatch(mantraList(token));
  }, []);

  const mantraData = [
    "The trick is not to learn to trust your gut feelings, but rather to discipline yourself to ignore them. Stand by your stocks as long as the fundamental story of the company hasn’t changed.",
    "This is my trick ",
    "New ever trick",
    "All new trick",
    "Yo-yo trick",
  ];

  // State to store the selected mantra
  const [selectedMantra, setSelectedMantra] = useState("");

  // Set a random mantra when the component mounts
  useEffect(() => {
    const randomMantra =
      mantraData[Math.floor(Math.random() * mantraData.length)];
    setSelectedMantra(randomMantra);
  }, []);

  return (
    <div>
      <div>
        <p className="heading-mantra">Mantra</p>
        <div className="mantra-description">
          <p class="mantra-text">{selectedMantra}</p>
          <div style={{ textAlign: "right" }}>
            <img src={InvertedComma} alt="inverted-comma" />
          </div>
        </div>
      </div>
      <div>{showForm && <MantraForm closeForm={closeForm} />}</div>
      <div>
        <MantrasBox mantras={reduxData} showForm={showwForm} />
      </div>
    </div>
  );
};

export default Mantra;
