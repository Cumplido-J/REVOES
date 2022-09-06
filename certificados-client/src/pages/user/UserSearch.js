import React, { useState } from "react";
import { Link } from "react-router-dom";

import { HomeOutlined } from "@ant-design/icons";
import { Row, Col, Breadcrumb } from "antd";

import { Title } from "../../shared/components";

import UserSearchFilter from "./UserSearchFilter";
import UserService from "../../service/UserService";
import UserSearchTable from "./UserSearchTable";
import UserSearchActions from "./UserSearchActions";

export default function UserSearch(props) {
  const [userList, setUserList] = useState([]);

  const searchUsers = async function (values) {
    const response = await UserService.userSearch(values);
    setUserList(response.userList);
  };

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/" style={{ color: "black" }}>
            <HomeOutlined />
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item style={{ color: "black" }}>
          <span>Lista de administradores</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Row style={{ marginTop: "1em" }}>
        <Col xs={{ span: 24 }}>
          <Title>Lista de administradores</Title>
        </Col>
      </Row>

      <UserSearchFilter {...props} onSubmit={searchUsers} />
      <UserSearchActions {...props} dataset={userList} />
      <UserSearchTable {...props} dataset={userList} />
    </>
  );
}
