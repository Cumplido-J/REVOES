import React, { useState } from "react";

import { Layout, Menu } from "antd";
import { LogoutOutlined } from "@ant-design/icons";

import { PageLoading } from "../shared/components";

const { Content, Sider } = Layout;

export default function Navigation({ children, loading, availableMenus, userProfile, history, logout }) {
  return (
    <>
      <Layout>
        {userProfile.userProfile && (
          <NavigationSidebar availableMenus={availableMenus} history={history} logout={logout} />
        )}
        <Layout style={{ backgroundColor: "white" }}>
          <PageLoading loading={loading}>
            <Content style={{ minHeight: 280, padding: "2em" }}>{children}</Content>
          </PageLoading>
        </Layout>
      </Layout>
    </>
  );
}

function NavigationSidebar({ availableMenus, logout, history }) {
  const [collapsed, setCollapsed] = useState(false);
  const handleCollapse = () => {
    setCollapsed(!collapsed);
  };
  return (
    <Sider width="250px" collapsible collapsed={collapsed} onCollapse={handleCollapse}>
      <Menu mode="inline" theme="dark" style={{ height: "100%", borderRight: 0 }}>
        {availableMenus.map((menu) => (
          <NavigationMenu key={menu.name} menu={menu} history={history} />
        ))}
        <Menu.Item key={"Cerrar sesión"} icon={<LogoutOutlined />} onClick={logout}>
          Cerrar sesión
        </Menu.Item>
      </Menu>
    </Sider>
  );
}

function NavigationMenu(props) {
  const { name, Icon, submenus } = props.menu;
  return (
    <Menu.SubMenu title={name} icon={<Icon />} {...props}>
      {submenus.map((submenu) => {
        const redirect = () => props.history.push(submenu.path);
        return (
          <Menu.Item key={submenu.name} onClick={redirect} icon={<submenu.Icon />}>
            {submenu.name}
          </Menu.Item>
        );
      })}
    </Menu.SubMenu>
  );
}
