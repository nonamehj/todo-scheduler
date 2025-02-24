import React, { useEffect } from "react";
import "./AgendaStyle.css";
import "react-calendar/dist/Calendar.css";
import AgendaForm from "./AgendaForm";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

import { useGlobalContext } from "../../context2";
import CalendarDays from "./CalendarDays";

const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
const Agenda = () => {
  const {
    modalOpen,
    previousMonth,
    nextMonth,
    currentDate,
    setCurrentDate,
    setAgendaList,
  } = useGlobalContext();

  useEffect(() => {
    setCurrentDate(new Date());
  }, [setCurrentDate]);
  return (
    <section className="agenda-section">
      <div className="agenda-container">
        <div className="agenda-title">
          <button className="prev-month" onClick={previousMonth}>
            <FaArrowLeft />
          </button>
          <h3>
            {`${currentDate.getFullYear()}년 ${currentDate?.getMonth() + 1}월`}{" "}
            일정 관리
          </h3>
          <button className="next-month" onClick={nextMonth}>
            <FaArrowRight />
          </button>
        </div>
        <div className="agenda-calendar">
          <div className="agenda-calendar-color">
            <p>* color : so what?</p>
            <button onClick={() => setAgendaList([])}>삭제</button>
          </div>
          <div className="calendar-container">
            <div className="calendar-week-center">
              {daysOfWeek.map((week) => {
                return (
                  <div key={week} className="calendar-week">
                    <p>{week}</p>
                  </div>
                );
              })}
            </div>

            <CalendarDays />
            {modalOpen && <AgendaForm />}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Agenda;
