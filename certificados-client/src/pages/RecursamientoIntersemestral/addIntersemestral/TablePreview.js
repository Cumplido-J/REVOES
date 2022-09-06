import React, { useState, useEffect, useRef } from "react";
import { Input, Form, Table, Modal, } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { ButtonIcon } from "../../../shared/components";
import { CloseOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { defaultColumn, columnProps } from "../../../shared/columns";
import { setStudentsSelected } from "../../../reducers/intersemestralReducer/actions/setStudentsSelected";
import StudentService from "../../../service/StudentService";

/* import Modal from "antd/lib/modal/Modal"; */


const { getStudentsBySchoolCareerSemester } = StudentService;

export default () => {
  const _isMounted = useRef(true); // Initial value _isMounted = true
  const studentsSelected = useSelector((store) => store.intersemestralReducer.studentSelect)
  const curseType = useSelector((store) => store.intersemestralReducer.curseTypeSelected);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [studenRemove, setStudentRemove] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      _isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    setLoading(false)
  }, []);

  useEffect(() => {
  }, [studentsSelected]);

  if (_isMounted.current) {
    // Check always mounted component
    // continue treatment of AJAX response... ;
  }

  const handleCancelNotify = () => {
    setIsModalVisible(false);
  };

  const handleRemoveRow = async (data) => {
    setStudentRemove(data);
    setIsModalVisible(true);
  }

  const handleRemoveStudentConfirmation = async () => {
    const arrayStudents = studentsSelected;
    const index = arrayStudents.findIndex(
      (e) => e.usuario_id === studenRemove.usuario_id
    )
    arrayStudents.splice(index, 1);
    dispatch(setStudentsSelected(arrayStudents));
    setIsModalVisible(false);
  }

  const columns = [
    {
      ...columnProps,
      title: "Opciones",
      render: (data) => {
        return (
          <>
            <ButtonIcon
              tooltip="Remover alumno"
              icon={<CloseOutlined />}
              color="red"
              onClick={() => handleRemoveRow(data)}
              tooltipPlacement="top"
            />
          </>
        );
      },
    },
    defaultColumn("Periodo", "periodo"),
    defaultColumn("Matricula", "matricula"),
    defaultColumn("Nombre", "nombre"),
    defaultColumn("Primer Apellido", "primer_apellido"),
    defaultColumn("Segundo Apellido", "segundo_apellido"),
    defaultColumn("Carrera", "carrera"),
  ];

  const columnsIntersemestral = [
    {
      ...columnProps,
      title: "Opciones",
      render: (data) => {
        return (
          <>
            <ButtonIcon
              tooltip="Remover alumno"
              icon={<CloseOutlined />}
              color="red"
              onClick={() => handleRemoveRow(data)}
              tooltipPlacement="top"
            />
          </>
        );
      },
    },
    defaultColumn("Matricula", "matricula"),
    defaultColumn("Nombre", "nombre"),
    defaultColumn("Primer Apellido", "primer_apellido"),
    defaultColumn("Segundo Apellido", "segundo_apellido"),
    defaultColumn("Carrera", "carrera"),
  ];
  return (
    <>
      <p style={{ marginTop: "2em" }}>
        <strong>Vista previa de alumnos que tomarán el recursamiento</strong>
      </p>
      <Table
        rowKey="usuario_id"
        bordered
        pagination={{ position: ["topLeft", "bottomLeft"] }}
        columns={curseType === 1 ? columns : columnsIntersemestral}
        scroll={{ x: columns.length * 200 }}
        dataSource={studentsSelected}
        size="small"
      />
      <Modal title="Confimación" visible={isModalVisible} confirmLoading={loading} onOk={handleRemoveStudentConfirmation} onCancel={handleCancelNotify} okText='Si' cancelText='No'>
        <ExclamationCircleOutlined /> <span>¿Está seguro de remover a este estudiante de la lista?</span>
      </Modal>
    </>
  );
};