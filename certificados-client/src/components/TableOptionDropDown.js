import { Button, Dropdown, Menu } from "antd";
import React, { useEffect } from "react";
import { MoreOutlined } from "@ant-design/icons";
const TableOptionDropDown = ({ children, size = "small" }) => {
  return (
    <>
      <Dropdown
        placement="bottomCenter"
        overlay={() => <>{React.Children.toArray(children)}</>}
      >
        <Button size={size} type="ghost" shape="circle">
          <MoreOutlined />
        </Button>
      </Dropdown>
    </>
  );
};

export default TableOptionDropDown;
