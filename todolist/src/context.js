import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const AppContext = createContext();

const getLocalStorage = () => {
  let todoItem = localStorage.getItem("todoItem");
  if (todoItem) {
    return (todoItem = JSON.parse(localStorage.getItem("todoItem")));
  } else {
    return [];
  }
};

const AppProvider = ({ children }) => {
  /*네비메뉴*/
  const [menuItems, setMenuItems] = useState([
    { id: 1, name: "메인화면", activeMenu: true },
    { id: 2, name: "오늘 할일", activeMenu: false },
    { id: 3, name: "일정 관리", activeMenu: false },
  ]);

  const [items, setItems] = useState("");
  const [list, setList] = useState(getLocalStorage);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [alert, setAlert] = useState({ show: false, msg: "", type: "" });
  const editRef = useRef();

  // console.log("local", Object.keys(list));
  /*메뉴 버튼 */
  const handleBtnsClick = useCallback(
    (name) => {
      const tempMenu = menuItems.map((item) => {
        if (item.name === name) {
          return { ...item, activeMenu: true };
        } else {
          return { ...item, activeMenu: false };
        }
      });
      return setMenuItems(tempMenu);
    },
    [menuItems]
  );
  /*todolist form */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!items) {
      console.log("준비중");
      showAlert(true, "danger", "항목을 입력하세요");
    } else if (items && isEditing) {
      setList(
        list.map((item) => {
          if (item.id === editId) {
            return { ...item, title: items };
          }
          return item;
        })
      );
      setItems("");
      setEditId(null);
      setIsEditing(false);
      showAlert(true, "success", "항목이 변경되었습니다.");
    } else {
      const newItem = {
        id: Date.now(),
        title: items,
        isChecked: false,
        isCompleted: false,
      };
      setList([...list, newItem]);
      showAlert(true, "success", "목록에 항목이 추가되었습니다.");
      setItems("");
    }
  };
  /*체크박스 */
  const handleCheckBox = (id) => {
    setList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isChecked: !item.isChecked } : item
      )
    );
  };
  const handleAction = (isChecked, isCompleted, id) => {
    if (!isCompleted && isChecked) {
      removeItem(id);
    } else {
      completeItem(id);
    }
  };
  const completeItem = (id) => {
    const tempItem = list.map((item) =>
      item.id === id ? { ...item, isChecked: true, isCompleted: true } : item
    );
    setList(tempItem);
    showAlert(true, "success", "항목이 완료되었습니다.");
  };
  const removeItem = (id) => {
    const tempItem = list.filter((item) => item.id !== id);
    setList(tempItem);
    showAlert(true, "danger", "항목이 삭제되었습니다.");
  };
  const editItem = (id) => {
    const tempItem = list.find((item) => item.id === id);
    setItems(tempItem.title);
    setIsEditing(true);
    setEditId(id);
    editRef.current.focus();
  };
  const clearList = useCallback(() => {
    setList([]);
  }, []);

  /*알람 */
  const showAlert = (show = false, type = "", msg = "") => {
    setAlert({ show, msg, type });
  };
  useEffect(() => {
    localStorage.setItem("todoItem", JSON.stringify(list));
  }, [list]);

  return (
    <AppContext.Provider
      value={{
        menuItems,
        handleBtnsClick,
        handleSubmit,
        isEditing,
        list,
        setItems,
        items,
        handleAction,
        editItem,
        clearList,
        editRef,
        handleCheckBox,
        showAlert,
        alert,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => useContext(AppContext);

export { AppContext, AppProvider };
