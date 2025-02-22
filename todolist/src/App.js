import "./index.css";
import Calendar from "react-calendar";
import TodayDateTime from "./components/navbar/TodayDateTime";
// import "react-calendar/dist/Calendar.css";
import { useEffect } from "react";
import { Home, Navbar, TodoList, Agenda } from "./components";
import { useGlobalContext } from "./context";

function App() {
  const { menuItems } = useGlobalContext();
  useEffect(() => {
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    const setMainContainerHeight = () => {
      const mainElement = document.querySelector("main");
      if (mainElement) {
        mainElement.style.height = `calc(var(--vh) * 100)`;
      }
    };

    const handleResize = () => {
      setViewportHeight();
      setMainContainerHeight();
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <main>
      <div className="container">
        <Navbar />
        <section className="section-container">
          {menuItems[0].activeMenu && <Home />}
          {menuItems[1].activeMenu && <TodoList />}
          {menuItems[2].activeMenu && <Agenda />}
        </section>
      </div>
    </main>
  );
}

export default App;
