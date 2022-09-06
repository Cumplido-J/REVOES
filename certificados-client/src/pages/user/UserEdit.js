import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import { Tabs,Row, Col, Breadcrumb,Alert } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { PageLoading,Title } from "../../shared/components";
import alerts from "../../shared/alerts";
import UserForm from "./UserForm";
import UserEditPassword from './UserEditPassword'
import UserService from "../../service/UserService";
import UserFormNew from './UserFormNew';


export default function UserEdit(props) {

    const [userData, setUserData] = useState({});
    const  { username }  = props.match.params;
    const [loading, setLoading] = useState(true);
  

    useEffect(() => {
        const getUserData = async () => {
          const response = await UserService.getUserData(username);
          setUserData(response.userData);
          setLoading(false);
        };
        getUserData();
    }, [username]);    

      const editUser = async (form) => {
        const response = await UserService.editUser(username, form);
        if (!response.success) return;
        alerts.success("Usuario guardado", "Usuario actualizado correctamente");
        props.history.push(`/Usuarios/Editar/${username}`);
      };

      const editUserPassword = async (form) => {
        const response = await UserService.editUserPassword(username, form);
        if (!response.success) return;
        alerts.success(
          "Contraseña guardada",
          "Contraseña actualizada correctamente"
        );}
    return (
    <>
        <Breadcrumb>
            <Breadcrumb.Item>
            <Link to="/" style={{ color: "black" }}>
                <HomeOutlined />
            </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
            <Link to="/Usuarios" style={{ color: "black" }}>
                <span>Lista de usuarios</span>
            </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item style={{ color: "black" }}>
            <span>Editar usuarios</span>
            </Breadcrumb.Item>
        </Breadcrumb>
        <Row style={{ marginTop: "1em" }}>
            <Col xs={{ span: 24 }}>
                <Title>Editar usuario</Title>
            </Col>
      </Row>
      <PageLoading loading={loading}>
      {userData.username && (
        <Tabs defaultActiveKey="1" type="card">
          <Tabs.TabPane tab="Información del usuario" key="1">
            <UserFormNew  userData={userData} onSubmit={editUser}/>
            
          </Tabs.TabPane>  
          <Tabs.TabPane tab="Cambiar contraseña" key="2">
          <UserEditPassword
                    {...props}
                    onSubmit={editUserPassword}
                  />
          </Tabs.TabPane>
        </Tabs>
        )}
        {!userData.username && <UserNotFound />}
      </PageLoading>
    </>
    )
}

function UserNotFound() {
  return (
    <Alert
      message={<strong>Atención</strong>}
      description="No se ha encontrado ningún usuario con esta curp. Favor de verificarlo."
      type="warning"
      showIcon
    />
  );
}