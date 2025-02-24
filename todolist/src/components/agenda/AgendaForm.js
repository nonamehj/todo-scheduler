import React, { useEffect } from "react";
import "./AgendaFormStyle.css";
import { useGlobalContext } from "../../context2";
import { FaTimes } from "react-icons/fa";
import Alert from "../alert/Alert";
import AgendaList from "./AgendaList";
const AgendaForm = () => {
  const {
    handleAgendaSubmit,
    isModalClose,
    selectedDate,
    agendaItems,
    isEditing,
    setItems,
    items,
    editRef,
    deleteList,
    alert,
    showAlert,
  } = useGlobalContext();
  const selectedDateTitle = `${selectedDate.getFullYear()}년 ${
    selectedDate.getMonth() + 1
  }월 ${selectedDate.getDate()}일`;
  // console.log("tttttttttt", selectedDate);
  // console.log("sd", selectedDate.toISOString().split("T")[0]);

  return (
    <div className="calendar-form-container">
      <div className="calendar-form-center">
        <div className="form-title">
          <h3>{`${selectedDateTitle} 일정 관리`}</h3>
          <button onClick={isModalClose} className="agenda-modal-close">
            <FaTimes />
          </button>
        </div>
        {alert.show && <Alert showAlert={showAlert} {...alert} />}
        <form action="" onSubmit={handleAgendaSubmit} className="agenda-form">
          <div className="form-center">
            <input
              type="text"
              name="agenda-Items"
              id="agenda-Items"
              value={items}
              ref={editRef}
              className="agenda-input"
              placeholder={` ${
                selectedDate.getMonth() + 1
              }월 ${selectedDate.getDate()}일 일정을 입력하세요.`}
              onChange={(e) => setItems(e.target.value)}
            />
            <button className="submit-btn">
              {isEditing ? "수정" : "추가"}
            </button>
          </div>
        </form>
        {agendaItems.length > 0 ? (
          <>
            <AgendaList />
            <button
              className="delete-btn"
              onClick={() => deleteList(selectedDate)}
            >
              전체 삭제
            </button>
          </>
        ) : (
          <div className="agenda-empty-message">
            <p>{selectedDateTitle}</p>
            <p>선택한 날짜에 일정이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgendaForm;
