import React from "react";
import "./HomeStyle.css";
import useMainData from "./useMainData";
const Home = () => {
  const today = new Date();
  const {
    filterListItems,
    filterAgendaItems,
    newAgendaList,
    trueAgendaItems,
    falseAgendaItems,
    trueListItems,
    falseListItems,
  } = useMainData(today);

  const sortAgendaList = filterAgendaItems
    ?.filter((item) => item.date >= today.toLocaleDateString())
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  // console.log("newAgendaList", newAgendaList);
  // const sortAgendaList2 = newAgendaList
  // .filter((item) => item.date >= today.toLocaleDateString())
  // .sort((a, b) => new Date(a.date) - new Date(b.date));
  // console.log("sort", sortAgendaList2);
  // console.log("this", newAgendaList);

  return (
    <section className="home-section">
      <div className="home-container">
        <div className="home-title">
          <h3>오늘의 리스트를 작성해보세요.</h3>
        </div>
        <div className="preview-wrapper">
          <div className="preview-content ">
            <div className="preview-title">
              <h4>오늘 할일</h4>
              <div className="preview-summary">
                {"("}
                <p>진행 : {falseListItems.length}</p> <span>/</span>{" "}
                <p>완료 : {trueListItems.length}</p>
                {")"}
              </div>
            </div>
            {filterListItems.length > 0 ? (
              <>
                <div className="preview-center">
                  <ul className="preview-todo">
                    {filterListItems.slice(0, 5).map((item) => {
                      const { id, title } = item;
                      return (
                        <li key={id}>
                          <p>
                            {title.length > 25
                              ? `${title.slice(0, 25)} ...`
                              : title}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                {filterListItems.length > 5 ? (
                  <div className="preview-more">
                    <p> 많은 일정을 확인하세요.</p>
                  </div>
                ) : (
                  <div className="preview-add">
                    <p>일정을 추가해보세요</p>
                  </div>
                )}
              </>
            ) : (
              <div className="empty-preview">
                <p>오늘의 일정이 없습니다.</p>
              </div>
            )}
          </div>
          <div className="preview-content">
            <span className="agenda-date-standard">{`*${today.getFullYear()}년 ${
              today.getMonth() + 1
            }월 ${today.getDate()}일 기준`}</span>
            <div className="preview-title">
              <h4>일정 관리</h4>
              <div className="preview-summary">
                {"("}
                <p>진행 : {falseAgendaItems.length}</p> <span>/</span>{" "}
                <p>완료 : {trueAgendaItems.length}</p>
                {")"}
              </div>
              {/* <p className="agenda-date-standard">{`*${today.getFullYear()}년 ${
                today.getMonth() + 1
              }월 ${today.getDate()}일 기준`}</p> */}
            </div>
            {filterAgendaItems.length > 0 ? (
              <>
                <div className="preview-center">
                  <ul className="preview-agenda">
                    {newAgendaList.slice(0, 5).map((item) => {
                      // console.log("home-item",item);
                      const { id, date, title } = item;
                      return (
                        <li key={id}>
                          <p className="agenda-mini-date">{date}</p>
                          <span>-</span>
                          <p className="agenda-mini-title">
                            {title.length > 20
                              ? `${title.slice(0, 20)} ...`
                              : title}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                {newAgendaList.length > 5 ? (
                  <div className="preview-more">
                    <p> 많은 일정을 확인하세요.</p>
                  </div>
                ) : (
                  <div className="preview-add">
                    <p>일정을 추가해보세요.</p>
                  </div>
                )}
              </>
            ) : (
              <div className="empty-preview">
                <p>{`${today.getFullYear()}년 ${
                  today.getMonth() + 1
                }월 ${today.getDate()}일 이후 일정이 없습니다.`}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
