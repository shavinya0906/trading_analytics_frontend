import "./App.scss";
import { Provider } from "react-redux";
import AppRoutes from "./routes/AppRoutes";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/index";
import { StrategyProvider } from "./context/StrategyContext";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <StrategyProvider>
          <AppRoutes />
        </StrategyProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
