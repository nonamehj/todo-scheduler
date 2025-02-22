import React from "react";
import "./TodoListStyle.css";
import TodoListItems from "./TodoListItems";
import Alert from "../alert/Alert";
import { useGlobalContext } from "../../context";
const TodoList = () => {
  const {
    handleSubmit,
    isEditing,
    list,
    setItems,
    items,
    editRef,
    alert,
    showAlert,
    clearList,
  } = useGlobalContext();

  return (
    <section className="todo-section">
      <div className="todo-container">
        <div className="todo-title">
          <h3>오늘 할일</h3>
        </div>
        {alert.show && <Alert {...alert} showAlert={showAlert} />}
        <form action="" className="todo-form" onSubmit={handleSubmit}>
          <div className="form-control">
            <input
              type="text"
              name="items"
              id="items"
              className="todo-input"
              value={items}
              ref={editRef}
              placeholder="오늘의 목표를 입력하세요"
              onChange={(e) => setItems(e.target.value)}
            />
            <button className="submit-btn">
              {isEditing ? "수정" : "추가"}
            </button>
          </div>
        </form>
        {list.length > 0 ? (
          <>
            <TodoListItems />
            <button className="clear-btn" onClick={clearList}>
              전체 삭제
            </button>
          </>
        ) : (
          <div className="todo-empty-message">
            <p>오늘 할일 일정이 없습니다.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TodoList;
