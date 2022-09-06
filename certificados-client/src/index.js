import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Link } from "react-router-dom";
import { ConfigProvider } from "antd";
import esES from "antd/es/locale/es_ES";

//Redux
import { Provider as ReduxProvider } from "react-redux";
import store from "./reducers/reducers";
import { PersistGate } from "redux-persist/es/integration/react";
import { persistStore } from "redux-persist";

import App from "./app/App";
import logo from "./images/Cecyte.png";

import Notifications from "./components/Notifications";

import "./index.css";
import Mantenimiento from "./pages/Mantenimiento";
import MenuBarOptionContainer from "./components/MenuBarOptionContainer";
import ConfigsLink from "./components/ConfigsLink";
import NotificationsHack from "./components/NotificationsHack";
const mantenimiento = false;
const persistedStore = persistStore(store);

ReactDOM.render(
  <ReduxProvider store={store}>
    <PersistGate persistor={persistedStore} loading={null}>
      <BrowserRouter>
        <div className="top-buffer">
          <nav className="navbar navbar-inverse sub-navbar navbar-fixed-top">
            <div className="container" style={{ position: "relative" }}>
              <div className="navbar-header">
                <Link className="navbar-brand" to="/">
                  <img
                    src={logo}
                    className="img-logo-cecyte"
                    alt="Colegios de Estudios Científicos y Tecnológicos"
                  />
                  SISEC - CECyTEs
                </Link>
              </div>
              <MenuBarOptionContainer>
                {/*<Notifications />*/}
                <NotificationsHack />
                <ConfigsLink />
              </MenuBarOptionContainer>
            </div>
          </nav>
          {mantenimiento && <Mantenimiento />}
          {!mantenimiento && (
            <ConfigProvider locale={esES}>
              <App />
            </ConfigProvider>
          )}
        </div>
      </BrowserRouter>
    </PersistGate>
  </ReduxProvider>,
  document.getElementById("root")
);
