import React from 'react'
import { Link } from "react-router-dom";
import { Row, Col, Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { Title } from "../../shared/components";
import alerts from "../../shared/alerts";

import UserService from "../../service/UserService";
import UserFormNew from './UserFormNew';

export default function UserAdd(props) {

    const addUser = async (form) => {
        const response = await UserService.addUser(form);
        if (!response.success) return;
        alerts.success("Usuario guardado", "Usuario insertado correctamente");
        props.history.push(`/Usuarios/Editar/${response.userData.username}`);
        
      };
    return (
        <div>
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
                <span>Ingresar usuarios</span>
                </Breadcrumb.Item>
        </Breadcrumb>
        <Row style={{ marginTop: "1em" }}>
            <Col xs={{ span: 24 }}>
                <Title>Ingresar usuario</Title>
            </Col>
      </Row>
      <UserFormNew onSubmit={ addUser }/>
        </div>
    )
}