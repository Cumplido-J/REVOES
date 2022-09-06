import { Button, Form, Input, Table } from "antd";
import React, { useEffect, useState } from "react";
import { columnProps, defaultColumn } from "../../shared/columns";
import {
  UsergroupAddOutlined,
  EditOutlined,
  DeleteFilled,
} from "@ant-design/icons";
import Modal from "antd/lib/modal/Modal";
import { ButtonIcon } from "../../shared/components";

const validations = {
  required: [
    {
      required: true,
      message: "este campo es requerido",
    },
  ],
};

const StudentTutors = ({
  tutors = [],
  loading = false,
  onTutorsChange = function () {},
}) => {
  const [tableData, setTableData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [type, setType] = useState("Añadir"); // o Editar
  const [currentTutor, setCurrentTutor] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    defaultColumn("Nombre", "nombre"),
    defaultColumn("Primer Apellido", "primer_apellido"),
    defaultColumn("Segundo Apellido", "segundo_apellido"),
    defaultColumn("Número de teléfono", "numero_telefono"),
    {
      ...columnProps,
      title: "Opciones",
      render: (t) => {
        return (
          <>
            <ButtonIcon
              tooltip="Editar"
              icon={<EditOutlined />}
              color="blue"
              onClick={() => handleEdit(t)}
              tooltipPlacement="top"
            />
            <ButtonIcon
              tooltip="Eliminar"
              icon={<DeleteFilled />}
              color="volcano"
              onClick={() => handleDeleteConfirm(t)}
              tooltipPlacement="top"
            />
          </>
        );
      },
    },
  ];

  const handleOpenModal = () => {
    setType("Añadir");
    form.setFieldsValue({
      nombre: null,
      primer_apellido: null,
      segundo_apellido: null,
      numero_telefono: null,
    });
    setShowModal(true);
  };

  const handleEdit = (tutor) => {
    setType("Editar");
    setCurrentTutor(tutor);
    form.setFieldsValue({ ...tutor });
    setShowModal(true);
  };

  const handleOk = () => {
    form.submit();
  };

  const handleDeleteConfirm = (t) => {
    setCurrentTutor(t);
    setShowConfirmation(true);
  };

  const handleDelete = () => {
    const newTableData = tableData.filter(({ id }) => id !== currentTutor.id);
    setTableData(newTableData);
    onTutorsChange(newTableData);
    setShowConfirmation(false);
  };

  const handleAddEditTutor = (data) => {
    let newTableData = [];
    switch (type) {
      case "Añadir":
        newTableData = [
          ...tableData,
          {
            ...data,
            id: `t${new Date()}`,
          },
        ];
        break;
      case "Editar":
        newTableData = tableData.map((t) =>
          t.id === currentTutor.id
            ? {
                ...data,
                id: currentTutor.id,
              }
            : t
        );
        break;
    }
    setTableData(newTableData);
    onTutorsChange(newTableData);
    setShowModal(false);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  useEffect(() => {
    if (tutors.length) setTableData(tutors);
  }, [tutors]);

  return (
    <>
      <Button
        icon={<UsergroupAddOutlined />}
        color={"blue"}
        onClick={handleOpenModal}
      >
        Capturar un tutor
      </Button>
      <br />
      <br />
      <Modal
        visible={showConfirmation}
        title="Eliminar tutor"
        onOk={handleDelete}
        onCancel={() => setShowConfirmation(false)}
        okText="Si, eliminar"
      >
        <p>
          ¿Está seguro de eliminar al tutor {currentTutor.nombre}{" "}
          {currentTutor.primer_apellido}?
        </p>
      </Modal>
      <Modal
        visible={showModal}
        title={`${type} tutor`}
        onOk={handleOk}
        onCancel={handleClose}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical" onFinish={handleAddEditTutor}>
          <Form.Item name="nombre" label="Nombre" rules={validations.required}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Primer apellido"
            name="primer_apellido"
            rules={validations.required}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Segundo apellido" name="segundo_apellido">
            <Input />
          </Form.Item>
          <Form.Item
            name="numero_telefono"
            label="Número de teléfono"
            rules={validations.required}
          >
            <Input type="tel" />
          </Form.Item>
        </Form>
      </Modal>
      <Table
        rowKey="id"
        bordered
        pagination={{ position: ["topLeft", "bottomLeft"] }}
        columns={columns}
        scroll={{ x: columns.length * 200 }}
        dataSource={tableData}
        loading={loading}
        size="small"
      />
    </>
  );
};

export default StudentTutors;
