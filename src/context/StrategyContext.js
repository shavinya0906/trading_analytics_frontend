import { useState } from "react";
import { useContext } from "react";
import { createContext } from "react";

const StrategyContext = createContext();

export const useStrategy = () => useContext(StrategyContext);

export const StrategyProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    strategies_name: "",
    strategies_desc: "",
  });
  const [formToggle, setFormToggle] = useState(false);
  const [formStatus, setFormStatus] = useState("none");
  const value = {
    formData,
    setFormData,
    formToggle,
    setFormToggle,
    formStatus,
    setFormStatus
  };
  return (
    <StrategyContext.Provider value={value}>
      {children}
    </StrategyContext.Provider>
  );
};
