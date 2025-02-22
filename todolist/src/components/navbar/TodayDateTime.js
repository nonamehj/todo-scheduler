import React, { useEffect, useState } from "react";

import "./TodayDateTimeStyle.css";
const TodayDateTime = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);
  return (
    <div className="today-date-time-center">
      <h2>{currentDateTime.toLocaleString()}</h2>
    </div>
  );
};

export default TodayDateTime;
