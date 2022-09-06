import React from "react";
import { SettingOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import PermissionValidator from "./PermissionValidator";
import { UserConfigsRoutes } from "../routes/UserConfigRoutes";
const ConfigsLink = () => {
  return (
    <PermissionValidator
      permissions={UserConfigsRoutes.userConfig.Permissions}
      allPermissions={false}
    >
      <Tooltip title="Configuraciones" placement="bottom">
        <Button
          type="link"
          icon={<SettingOutlined />}
          size="middle"
          href="/configuraciones"
          style={{ color: "white" }}
        />
      </Tooltip>
    </PermissionValidator>
  );
};
export default ConfigsLink;
