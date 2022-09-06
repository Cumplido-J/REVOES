import { useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  getNotifications,
  readNotifications,
} from "../../service/NotificationsService";

const useNotificationsHack = () => {
  const userProfile = useSelector(
    (state) => state.permissionsReducer.userProfile
  );
  const isUserLoggedIn = useMemo(
    () => !!Object.keys(userProfile).length,
    [userProfile]
  );
  const [notifications, setNotifications] = useState([]);
  const [unreadedCount, setUnreadedCount] = useState(0);
  const setUp = async () => {
    const apiCall = await getNotifications(1);
    if (apiCall.success) {
      setNotifications(apiCall?.data?.data?.data);
      setUnreadedCount(apiCall.data.unread_count);
    }
  };
  useEffect(() => {
    if (Object.keys(userProfile).length) {
      setUp();
    }
  }, [userProfile]);
  const history = useHistory();
  const handleOnClickNotification = () => {
    history.push("/Grupos/Aprobaciones");
  };
  const handleOnClickBell = () => {
    setUnreadedCount(0);
    readNotifications();
  };
  return [
    isUserLoggedIn,
    notifications,
    unreadedCount,
    handleOnClickNotification,
    handleOnClickBell,
  ];
};

export default useNotificationsHack;
