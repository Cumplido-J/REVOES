import React from 'react'
import { Link } from "react-router-dom";
import { Tabs,Row, Col, Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import {Title } from "../../shared/components";
import Scope from './Scope';
import CatalogScope from './CatalogScope';

const AdminScopeUser = () => {
    return (
        <>
        <Breadcrumb>
            <Breadcrumb.Item>
            <Link to="/" style={{ color: "black" }}>
                <HomeOutlined />
            </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
            <Link to="/Usuarios/AdministradorAlcance" style={{ color: "black" }}>
                <span>Administrador Alcance</span>
            </Link>
            </Breadcrumb.Item>
        </Breadcrumb>
        <Row style={{ marginTop: "1em" }}>
            <Col xs={{ span: 24 }}>
                <Title>Administrador Alcance</Title>
            </Col>
        </Row>
        <Tabs defaultActiveKey="1" type="card">
        <Tabs.TabPane tab="Alcance" key="1">
            <Scope/>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Catálogo de alcance" key="2">
            <CatalogScope/>
        </Tabs.TabPane>  
         
        </Tabs>
        </>
    )
}

export default AdminScopeUser
