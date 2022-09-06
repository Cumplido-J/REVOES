import { notification } from "antd";

export default {
  success: (title, message) => {
    notification.success({
      message: title,
      description: message,
      placement: "bottomRight",
    });
  },
  info: (title, message) => {
    notification.info({
      message: title,
      description: message,
      placement: "bottomRight",
    });
  },
  error: (title, message) => {
    notification.error({
      message: title,
      description: message,
      placement: "bottomRight",
    });
  },
  warning: (title, message) => {
    notification.warning({
      message: title,
      description: message,
      placement: "bottomRight",
    });
  },
  info_no_time: (title, message) => {
    notification.info({
      message: title,
      description: message,
      placement: "bottomRight",
      duration:0,
    });
  },
};
