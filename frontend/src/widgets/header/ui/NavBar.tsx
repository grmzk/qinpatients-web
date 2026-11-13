import { NavLink } from "react-router";

import { useAppSelector } from "../../../app/store/hooks";
import { authApi, useAuth } from "../../../features/auth";

import styles from "./NavBar.module.css";

function NavBar() {
  const { token, setToken } = useAuth();
  const tabsCount: number = useAppSelector((state) => state.editor.order.length);

  async function handleLogoutClick() {
    await authApi
      .logout()
      .then(() => {
        setToken(null);
      })
      .catch(console.error);
  }

  return (
    <div className={styles.navBar}>
      <NavLink to="">
        <button>Монитор</button>
      </NavLink>
      <NavLink to="search">
        <button>Поиск</button>
      </NavLink>
      <NavLink to="editor">
        <button>Редактор: {tabsCount}</button>
      </NavLink>
      <NavLink to="login">
        {token ? <button onClick={() => handleLogoutClick()}>Выход</button> : <button>Вход</button>}
      </NavLink>
    </div>
  );
}

export default NavBar;
