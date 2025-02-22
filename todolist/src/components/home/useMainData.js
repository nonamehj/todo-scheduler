import React, { useEffect, useState } from "react";
import { useGlobalContext as todoContext } from "../../context";
import { useGlobalContext as agendaContext } from "../../context2";

const useMainData = (today) => {
  const { list } = todoContext();
  const { agendaList } = agendaContext();
  const [trueListItems, setTrueListItems] = useState([]);
  const [falseListItems, setFalseListItems] = useState([]);
  const [trueAgendaItems, setTrueAgendaItems] = useState([]);
  const [falseAgendaItems, setFalseAgendaItems] = useState([]);

  const filterListItems = list.filter((item) => !item.isCompleted);
  const filterAgendaItems = agendaList
    .filter((item) => item.date >= today.toLocaleDateString() && item)
    .map((item) => {
      return {
        ...item,
        items: item.items.filter((agenda) => agenda.isCompleted === false),
      };
    });
  let count = 6;
  let newAgendaList = [];
  agendaList
    .filter((item) => item.date >= today.toLocaleDateString())
    .some((item) => {
      if (count > 0 && item.items.length > 0) {
        const selecteditems = item.items.slice(0, count).map((agenda) => {
          return { date: item.date, id: agenda.id, title: agenda.title };
        });
        newAgendaList.push(...selecteditems);
        count -= item.items.length;
      }
      return count === 0;
    });

  useEffect(() => {
    let { trueList, falseList } = list.reduce(
      (acc, cur) => {
        if (cur.isCompleted) {
          acc.trueList.push(cur);
        } else {
          acc.falseList.push(cur);
        }
        return acc;
      },
      { trueList: [], falseList: [] }
    );
    setTrueListItems(trueList);
    setFalseListItems(falseList);
  }, [list]);
  useEffect(() => {
    let { trueAgenda, falseAgenda } = agendaList.reduce(
      (acc, cur) => {
        cur.items.forEach((item) => {
          if (item.isCompleted) {
            acc.trueAgenda.push(item);
          } else {
            acc.falseAgenda.push(item);
          }
        });
        return acc;
      },
      { trueAgenda: [], falseAgenda: [] }
    );
    setTrueAgendaItems(trueAgenda);
    setFalseAgendaItems(falseAgenda);
  }, [agendaList]);
  return {
    filterListItems,
    agendaList,
    filterAgendaItems,
    newAgendaList,
    trueAgendaItems,
    falseAgendaItems,
    trueListItems,
    falseListItems,
  };
};

export default useMainData;
