import React, { useEffect, useState } from "react";
import { BellOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Badge } from "antd";
import {
  getNotifications,
  readNotifications,
} from "../service/NotificationsService";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

const NotificationsList = ({ notifications, onClick }) => {
  return (
    <Menu>
      {notifications.length ? (
        notifications.map((notification, index) => {
          let { created_at, read_at, data } = notification;
          data = JSON.parse(data);
          const style = {
            height: "auto",
            backgroundColor: read_at ? "white!important" : "#f0f7f7!important",
            color: "black",
          };
          return (
            <Menu.Item key={index} style={style} onClick={onClick}>
              {/* <Card hoverable style={style} onClick={onClick}>
                <Card.Meta
                  style={{ color: "black" }}
                  title={""}
                  description={data.mensaje}
                />
              </Card> */}
              <div>
                <div style={{ fontSize: "12px" }}>{data.mensaje}</div>
                <div style={{ fontSize: "10px" }}>{created_at}</div>
              </div>
            </Menu.Item>
          );
        })
      ) : (
        <Menu.Item>¡No hay notificaciones!</Menu.Item>
      )}
    </Menu>
  );
};

export default () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadedCount, setUnreadedCount] = useState(0);
  const userProfile = useSelector(
    (state) => state.permissionsReducer.userProfile
  );
  const history = useHistory();
  useEffect(() => {
    async function setUp() {
      const apiCall = await getNotifications(1);
      if (apiCall.success) {
        setNotifications(apiCall.data.data.data);
        setUnreadedCount(apiCall.data.unread_count);
      }
    }
    if (Object.keys(userProfile).length) {
      setUp();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile]);
  const handleOnClickNotification = () => {
    history.push("/Grupos/Aprobaciones");
    setNotifications(notifications.map((n) => ({ ...n, read_at: true })));
    setUnreadedCount(0);
    readNotifications();
  };
  return !Object.keys(userProfile).length ? (
    <></>
  ) : (
    <Dropdown
      overlay={
        <NotificationsList
          notifications={notifications}
          onClick={handleOnClickNotification}
        />
      }
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
