import React from "react";
import MenuBtns from "./MenuBtns";
import TodayDateTime from "./TodayDateTime";
import "./NavbarStyle.css";
const Navbar = () => {
  return (
    <nav>
      <div className="nav-container">
        <TodayDateTime />
        <MenuBtns />
      </div>
    </nav>
  );
};

export default Navbar;
