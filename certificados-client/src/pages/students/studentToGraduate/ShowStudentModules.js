import React, { useState } from "react";
import { ButtonIcon } from "../../../shared/components";
import { ApartmentOutlined } from "@ant-design/icons";
import Modal from "antd/lib/modal/Modal";
import { Table } from "antd";
import { defaultColumn } from "../../../shared/columns";

const ShowStudentModules = ({ modules }) => {
  const [showModal, setShowModal] = useState(false);
  const handleOpen = () => {
    setShowModal(true);
  };
  const handleClose = () => {
    setShowModal(false);
  };
  const columns = [
    defaultColumn("Clave", "key"),
    defaultColumn("Nombre", "name"),
    defaultColumn("Semestre", "semester"),
    defaultColumn("Calificación", "grade"),
    defaultColumn("Tipo", "type"),
  ];
  return (
    <>
      <ButtonIcon
        tooltip="Módulos del alumno"
        icon={<ApartmentOutlined />}
        color="green"
        onClick={handleOpen}
        tooltipPlacement="top"
      />
      <Modal
        onCancel={handleClose}
        footer={null}
        visible={showModal}
        width="100%"
        title="Módulos del alumno"
      >
        <Table
          rowKey="id"
          bordered
          pagination={{ position: ["topLeft", "bottomLeft"] }}
          columns={columns}
          scroll={{ x: columns.length * 200 }}
          dataSource={modules}
          size="small"
        />
      </Modal>
    </>
  );
};

export default ShowStudentModules;
