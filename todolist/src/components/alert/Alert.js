import React, { useEffect } from "react";
import "./AlertStyle.css";
const Alert = ({ msg, type, showAlert }) => {
  useEffect(() => {
    const timeout = setInterval(() => {
      showAlert();
    }, 3000);
    return () => clearInterval(timeout);
  });

  return (
    <div className={`alert alert-${type}`}>
      <p>{msg}</p>
    </div>
  );
};

export default Alert;
