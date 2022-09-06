import React from "react";
import { Badge, Dropdown, Menu } from "antd";
import { BellOutlined } from "@ant-design/icons";
import useNotificationsHack from "../hooks/notifications/useNotificationsHack";
const NotificationsList = ({ notifications, onClick, unreadedCount }) => {
  const style = {
    height: "auto",
    backgroundColor: unreadedCount ? "white!important" : "#f0f7f7!important",
    color: "black",
  };
  return (
    <Menu>
      {notifications.length ? (
        <Menu.Item style={style} onClick={onClick}>
          <div>
            <div style={{ fontSize: "12px" }}>
              Usted tiene aprobaciones de grupos pendientes.
            </div>
            <div style={{ fontSize: "10px" }}>
              {notifications[0]?.created_at}
            </div>
          </div>
        </Menu.Item>
      ) : (
        <Menu.Item>¡No hay notificaciones!</Menu.Item>
      )}
    </Menu>
  );
};

const NotificationsHack = () => {
  const [
    isUserLoggedIn,
    notifications,
    unreadedCount,
    handleOnClickNotification,
    handleOnClickBell,
  ] = useNotificationsHack();
  return !isUserLoggedIn ? (
    <></>
  ) : (
    <Dropdown
      trigger="click"
      overlay={
        <NotificationsList
          notifications={notifications}
          onClick={handleOnClickNotification}
          unreadedCount={unreadedCount}
        />
      }
      onClick={handleOnClickBell}
    >
      <Badge dot count={unreadedCount}>
        <BellOutlined
          style={{
            color: "white",
            fontSize: 20,
            cursor: "pointer",
          }}
        />
      </Badge>
    </Dropdown>
  );
};

export default NotificationsHack;
