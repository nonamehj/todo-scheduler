import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const getAgendaLocalStorage = () => {
  let agendaItem = localStorage.getItem("agendaItem");
  if (agendaItem) {
    return (agendaItem = JSON.parse(localStorage.getItem("agendaItem")));
  } else {
    return [];
  }
};

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [agendaList, setAgendaList] = useState(getAgendaLocalStorage());
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [alert, setAlert] = useState({ show: false, msg: "", type: "" });
  /*form */
  const [items, setItems] = useState(""); /*폼 입력값 */

  const [agendaItems, setAgendaItems] = useState(""); /*각 선택한 리스트 */
  const [editId, setEditId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const editRef = useRef();
  // const formattedDate = selectedDate.toISOString().split("T")[0];
  // const formattedDate = selectedDate.toLocaleDateString("ko-KR");
  // const formattedDate = selectedDate.toLocaleDateString("ko-KR").replace(/\./g, "-");
  // console.log("agendaitem", agendaItems);
  // console.log("context locals agendaList", agendaList);
  console.log("context agnedaItems", agendaItems);
  // console.log("selec", selectedDate?.toISOString().split("T")[0]);
  // console.log("local", selectedDate?.toLocaleDateString());
  // localStorage.clear();
  const agendaDateList = useMemo(() => {
    return agendaList.reduce((acc, item) => {
      // const selectedDateString = new Date(item.date)
      //   .toISOString()
      //   .split("T")[0];
      const selectedDateString = new Date(item.date).toLocaleDateString();
      if (item.items.length > 0) acc[selectedDateString] = item;
      return acc;
    }, {});
  }, [agendaList]);

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };
  const getLastDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  };
  const getDayOfWeek = (date) => {
    return date.getDay();
  };
  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };
  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };
  const getCalendarDays = () => {
    const firstDay = getFirstDayOfMonth(currentDate);
    const lastDay = getLastDayOfMonth(currentDate);
    const days = [];

    for (let i = 0; i < getDayOfWeek(firstDay); i++) {
      days.push(null);
    }
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
    }
    return days;
  };

  /*form 제출 */
  const handleAgendaSubmit = (e) => {
    e.preventDefault();
    if (!items) {
      // console.log("준비중");
      showAlert(true, "danger", "항목을 입력하세요");
    } else if (items && isEditing) {
      // setAgendaList((agenda) => {
      //   if (agenda.id === editId) {
      //     return { ...agenda, title: items };
      //   }
      //   return agenda;
      // });
      setAgendaList((prev) => {
        return prev.map((agenda) => {
          // const agendaDate = new Date(agenda.date).toISOString().split("T")[0];
          // const selectedDateString = selectedDate.toISOString().split("T")[0];
          const agendaDate = new Date(agenda.date).toLocaleDateString();
          const selectedDateString = selectedDate.toLocaleDateString();
          if (agendaDate === selectedDateString) {
            return {
              ...agenda,
              items: agenda.items.map((item) =>
                item.id === editId ? { ...item, title: items } : item
              ),
            };
          }
          return agenda;
        });
      });
      setItems("");
      setEditId(null);
      setIsEditing(false);
      showAlert(true, "success", "항목이 변경되었습니다.");
    } else {
      showAlert(true, "success", "목록에 항목이 추가되었습니다.");
      console.log("form click");
      const newItem = {
        id: Date.now(),
        title: items,
        isChecked: false,
        isCompleted: false,
      };

      /*로컬이 객체일때 */
      // setAgendaList((prev) => {
      //   return {
      //     ...prev,
      //     [selectedDate]: [...(prev[selectedDate] || []), newItem],
      //   };
      // });

      setAgendaList((prev) => {
        let updatedAgendaList = prev.map((agenda) => {
          /**/
          // const agendaDate = new Date(agenda.date).toISOString().split("T")[0];
          // const selectedDateString = selectedDate.toISOString().split("T")[0];
          const agendaDate = new Date(agenda.date).toLocaleDateString();
          const selectedDateString = selectedDate.toLocaleDateString();
          // agenda.date === selectedDate
          if (agendaDate === selectedDateString) {
            return { ...agenda, items: [...agenda.items, newItem] };
          }
          return agenda;
        });
        /* */
        // const selectedDateString = selectedDate.toISOString().split("T")[0];
        const selectedDateString = selectedDate.toLocaleDateString();
        // if (!updatedAgendaList.find((agenda) => agenda.date === selectedDate)) {
        if (
          !updatedAgendaList.find(
            (agenda) =>
              // new Date(agenda.date).toISOString().split("T")[0] ===
              new Date(agenda.date).toLocaleDateString() === selectedDateString
          )
        ) {
          updatedAgendaList = [
            ...updatedAgendaList,
            {
              // date: selectedDate,
              date: selectedDateString,
              items: [newItem],
            },
          ];
        }
        return updatedAgendaList;
      });

      setItems("");
    }
  };
  const showAlert = (show = false, type = "", msg = "") => {
    setAlert({ show, type, msg });
  };
  const handleCheckBox = (id) => {
    setAgendaItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isChecked: !item.isChecked } : item
      )
    );
  };
  /*모달오픈 */
  const isModalOpen = (date) => {
    setModalOpen(true);
    setSelectedDate(date);
    // setSelectedDate(date.toLocaleDateString());
  };
  /*모달닫기 */
  const isModalClose = () => {
    setModalOpen(false);
    setSelectedDate(null);
    setAgendaItems("");
  };
  const handleAction = (isChecked, isCompleted, id) => {
    if (!isCompleted && isChecked) {
      removeItem(id);
    } else {
      completeItem(id);
    }
  };

  const completeItem = (id) => {
    const updateItems = agendaItems.map((item) =>
      item.id === id ? { ...item, isChecked: true, isCompleted: true } : item
    );
    setAgendaItems(updateItems);
    setAgendaList((prev) =>
      prev.map((agenda) => {
        return {
          ...agenda,
          items: agenda.items.map((item) =>
            item.id === id
              ? { ...item, isChecked: true, isCompleted: true }
              : item
          ),
        };
      })
    );
    showAlert(true, "success", "항목이 완료되었습니다.");
  };
  const removeItem = (id) => {
    // const selectedDateString = selectedDate.toISOString().split("T")[0];
    const selectedDateString = selectedDate.toLocaleDateString();
    // setAgendaItems((prev) => prev.filter((item) => item.id !== id));
    // setAgendaList((prev) =>
    //   prev.map((agenda) => {
    //     return {
    //       ...agenda,
    //       items: agenda.items.filter((item) => item.id !== id),
    //     };
    //   })
    // );
    setAgendaList((prev) =>
      prev
        .map((item) =>
          // new Date(item.date).toISOString().split("T")[0] === selectedDateString
          new Date(item.date).toLocaleDateString() === selectedDateString
            ? { ...item, items: item.items.filter((item) => item.id !== id) }
            : item
        )
        .filter((item) => item.items.length > 0 && item)
    );
    showAlert(true, "danger", "항목이 삭제되었습니다.");
  };

  const editItem = (id) => {
    const tempItem = agendaItems.find((item) => item.id === id);
    setItems(tempItem.title);
    setIsEditing(true);
    setEditId(id);
    editRef.current.focus();
  };

  /*달에 요일 리스트 전체삭제 */
  const deleteList = (date) => {
    // const selectedDateString = date.toISOString().split("T")[0];
    const selectedDateString = date.toLocaleDateString();
    setAgendaItems([]);

    setAgendaList((prev) =>
      prev
        .map((item) =>
          // new Date(item.date).toISOString().split("T")[0] === selectedDateString
          new Date(item.date).toLocaleDateString() === selectedDateString
            ? { ...item, items: [] }
            : item
        )
        .filter((item) => item.items.length > 0 && item)
    );
    showAlert(true, "danger", "전체 삭제되었습니다.");
  };

  useEffect(() => {
    localStorage.setItem("agendaItem", JSON.stringify(agendaList));
  }, [agendaList]);
  useEffect(() => {
    /*로컬 객체일때 */
    // if (selectedDate) {
    //   const formItems = agendaList[selectedDate] || [];
    //   setAgendaItems(formItems);
    // }

    if (selectedDate) {
      // console.log("context useeffect selectedDate", selectedDate);
      // const selectedDateString = selectedDate.toISOString().split("T")[0];
      const selectedDateString = selectedDate.toLocaleDateString();
      const agenda = agendaList.find(
        (agenda) =>
          // new Date(agenda.date).toISOString().split("T")[0] ===
          new Date(agenda.date).toLocaleDateString() === selectedDateString
      );
      const formItems = agenda ? agenda.items : [];
      // const formItems = agenda ? agenda.items : null;
      setAgendaItems(formItems);
    }
  }, [selectedDate, agendaList, setAgendaItems]);
  useEffect(() => {
    setCurrentDate(new Date());
  }, []);
  useEffect(() => {}, []);
  return (
    <AppContext.Provider
      value={{
        agendaList,
        handleAgendaSubmit,
        getCalendarDays,
        isModalOpen,
        modalOpen,
        isModalClose,
        selectedDate,
        agendaItems,
        setItems,
        editRef,
        isEditing,
        items,
        nextMonth,
        previousMonth,
        currentDate,
        setCurrentDate,
        handleCheckBox,
        handleAction,
        editItem,
        deleteList,
        alert,
        showAlert,

        agendaDateList,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
