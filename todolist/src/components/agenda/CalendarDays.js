import { useGlobalContext } from "../../context2";
import "./CalendarDaysStyle.css";

const CalendarDays = () => {
  const { getCalendarDays, isModalOpen, agendaDateList } = useGlobalContext();
  const today = new Date();
  return (
    <div className="calendar-days-center">
      {getCalendarDays().map((day, index) => {
        // const isCurrentDay = day?.getDate() === today.getDate();
        // const isEmptyDay = day === null;
        // const agendaDate = new Date(day).toISOString().split("T")[0];
        const agendaDate = new Date(day).toLocaleDateString();
        /* */
        // const agendaLength = agendaList.find((item) => {
        //   const selectedDateString = new Date(item.date)
        //     .toISOString()
        //     .split("T")[0];
        //   return selectedDateString === agendaDate && item.items.length > 0;
        // });
        const agendaLength = agendaDateList[agendaDate];
        return (
          <button
            key={`${day}-${index}`}
            className={`calendar-day ${
              day?.getDate() === today.getDate() ? "activeDay" : ""
            } ${
              agendaLength
                ? agendaLength.items.every((item) => item.isCompleted === true)
                  ? "completedDay"
                  : "incompleteDay"
                : ""
            }`}
            disabled={day === null ? true : false}
            onClick={() => isModalOpen(new Date(day))}
          >
            <p>{day ? day.getDate() : ""}</p>
            {agendaLength && <p className="agenda-underline"></p>}
          </button>
        );
      })}
    </div>
  );
};

export default CalendarDays;
