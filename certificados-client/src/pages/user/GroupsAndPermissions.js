import React from 'react'
import { Link } from "react-router-dom";
import { Tabs,Row, Col, Breadcrumb,Alert } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import {Title } from "../../shared/components";

import Groups from './Groups';
import Permissions from './Permissions';

const GroupsAndPermissions = () => {
    return (
        <>
        <Breadcrumb>
            <Breadcrumb.Item>
            <Link to="/" style={{ color: "black" }}>
                <HomeOutlined />
            </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
            <Link to="/Usuarios/GruposYPermisos" style={{ color: "black" }}>
                <span>Grupos y Permisos</span>
            </Link>
            </Breadcrumb.Item>
        </Breadcrumb>
        <Row style={{ marginTop: "1em" }}>
            <Col xs={{ span: 24 }}>
                <Title>Grupos y Permisos</Title>
            </Col>
        </Row>

        <Row style={{ marginBottom: "1em" }}>
            <Col xs={{ span: 24 }}>
                <Alert
                    message={<strong>Grupos y permisos</strong>}
                    description={
                    <>
                        <p>Descripción de los grupos y permisos:</p>
                    <ul>
                        <li>Un GRUPO es el encapsulamiento de uno o mucho permisos que se le otorgan al usuario para el renderizado de 
                            patalla, los PERMISOS hacen referencia de la pantalla o sección que se asocian.
                        </li>
                        <li>
                            Para crear un nuevo grupo se deberá elegir los permisos que se visualizaran en el renderizado.
                        </li>
                        <li>
                            Unicamente se deberá registrar un nuevo permiso cuando una sección se cree.
                        </li>
                    </ul>
                    </>
                    }
                    type="warning"
                    showIcon
                />
            </Col>
        </Row>  

        <Tabs defaultActiveKey="1" type="card">
          <Tabs.TabPane tab="Grupos" key="1">
            <Groups/>
          </Tabs.TabPane>  
          <Tabs.TabPane tab="Permisos" key="2">
            <Permissions/>
          </Tabs.TabPane>
        </Tabs>
        </>
    )
}

export default GroupsAndPermissions