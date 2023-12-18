import { useEffect } from "react";

const OutsideClickDetect = (ref, needToDo) => {
  const handelClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      needToDo();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handelClickOutside, true);
    return () => {
      document.addEventListener("click", handelClickOutside, true);
    };
  }, [ref]);
};

export default OutsideClickDetect;
