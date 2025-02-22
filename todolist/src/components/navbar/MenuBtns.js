import "./MenuBtnsStyle.css";
import { useGlobalContext } from "../../context";
const MenuBtns = () => {
  const { menuItems, handleBtnsClick } = useGlobalContext();

  return (
    <div className="links-btn">
      <ul className="links">
        {menuItems.map((item) => {
          return (
            <li key={item.id}>
              <button
                className="list-btn"
                name={item.name}
                onClick={(e) => handleBtnsClick(e.target.name)}
              >
                {item.name}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MenuBtns;
