import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
const Todolist = () => {
  return (
    <main>
      <section className="section-center">
        <form action="" className="form">
          <h3>할일 목록</h3>
        </form>
        <Calendar />
      </section>
    </main>
  );
};

export default Todolist;
