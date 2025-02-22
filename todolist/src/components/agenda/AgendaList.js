import React from "react";
import { useGlobalContext } from "../../context2";
import "./AgendaListStyle.css";
const AgendaList = () => {
  const { agendaItems, handleCheckBox, handleAction, editItem } =
    useGlobalContext();

  return (
    <div className="agenda-list-container">
      <div className="agenda-list-center">
        {agendaItems.map((item) => {
          const { id, title, isChecked, isCompleted } = item;
          return (
            <article
              key={id}
              className={`agenda-item ${isCompleted ? "completed" : ""}`}
            >
              <label htmlFor={`checked-${id}`} />
              <input
                id={`checked-${id}`}
                type="checkbox"
                disabled={isCompleted}
                checked={isChecked || false}
                onChange={() => handleCheckBox(id)}
                className="input-checkbox"
              />
              <p className="agenda-content">{title}</p>
              <div className="btn-container">
                <button
                  className="edit-btn"
                  disabled={isCompleted}
                  onClick={() => !isCompleted && editItem(id)}
                >
                  수정
                </button>
                <button
                  className={isChecked ? "remove-btn" : "complete-btn"}
                  onClick={() => handleAction(isChecked, isCompleted, id)}
                >
                  {isCompleted ? "완료" : isChecked ? "삭제" : "완료"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default AgendaList;
