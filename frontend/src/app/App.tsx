import { AuthContextProvider } from "../features/auth";

import AuthRoutes from "./router";

import styles from "./App.module.css";

function App() {
  return (
    <div className={styles.App}>
      <AuthContextProvider>
        <AuthRoutes />
      </AuthContextProvider>
    </div>
  );
}

export default App;
