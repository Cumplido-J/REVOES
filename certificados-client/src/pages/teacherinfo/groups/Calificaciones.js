import React, { useEffect, useState } from "react";

import { Table, Modal, Input, Form, InputNumber } from "antd";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { defaultColumn, columnProps } from "../../../shared/columns";
import Moment from "moment";
import { setUacGrades } from "../../../service/TeacherService";
import alerts from "../../../shared/alerts";

export default ({
  students,
  evaluaciones,
  visible,
  onOk,
  onCancel,
  uacRegistrationData,
}) => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const primaryColor = "#9d2449";
  
  const handleOnViewMore = (info) => {
    console.log(info);
  };

  // data.calificacion_uac.califi
  const evaluateInputDisabled = (parcial, studentData) => {
    if (evaluaciones[0].parcial === parcial) {
      return false;
    } else if (evaluaciones[0].parcial > parcial) {
      if (
        studentData.calificacion_uac &&
        Array.isArray(studentData.calificacion_uac)
      ) {
        const parcialGrades = studentData.calificacion_uac.filter(
          (calificacion) => calificacion.parcial === parcial && calificacion.calificacion != null
        );
        return !!parcialGrades.length;
      }
    }
    return true;
  };

  const columns = [
    defaultColumn("Matricula", "matricula"),
    defaultColumn("Alumno", "nombre_completo"),
    {
      ...columnProps,
      title: "Parcial 1",
      render: (data) => {
        const uac = data.calificacion_uac.filter((e) => e.parcial === "1");
        return (
          <>
            <InputNumber
              step={0.1}
              onChange={(inputValue) => handleStudentGrade(1, data, inputValue)}
              min={1}
              max={10}
              defaultValue={
                uac && uac.length && uac[0].calificacion !== null
                  ? uac[0].calificacion
                  : ""
              }
              disabled={evaluateInputDisabled("1", data)}
            />
          </>
        );
      },
    },
    {
      ...columnProps,
      title: "Parcial 2",
      render: (data) => {
        const uac = data.calificacion_uac.filter((e) => e.parcial === "2");
        return (
          <>
            <InputNumber
              step={0.1}
              precision={1}
              onChange={(inputValue) => handleStudentGrade(2, data, inputValue)}
              min={1}
              max={10}
              defaultValue={
                uac && uac.length && uac[0].calificacion !== null
                  ? uac[0].calificacion
                  : ""
              }
              disabled={evaluateInputDisabled("2", data)}
            />
          </>
        );
      },
    },
    {
      ...columnProps,
      title: "Parcial 3",
      render: (data) => {
        const uac = data.calificacion_uac.filter((e) => e.parcial === "3");
        return (
          <>
            <InputNumber
              step={0.1}
              onChange={(inputValue) => handleStudentGrade(3, data, inputValue)}
              min={1}
              max={10}
              defaultValue={
                uac && uac.length && uac[0].calificacion !== null
                  ? uac[0].calificacion
                  : ""
              }
              disabled={evaluateInputDisabled("3", data)}
            />
          </>
        );
      },
    },
  ];

  const handleStudentGrade = (parcial, student, inputValue) => {
    const gradeIndex = grades.findIndex(
      (g) => g.alumno_id === student.usuario_id && g.parcial === parcial
    );
    if (gradeIndex > -1) {
      setGrades(
        grades.map((g, index) =>
          index === gradeIndex ? { ...g, calificacion: inputValue } : g
        )
      );
    } else {
      setGrades([
        ...grades,
        { alumno_id: student.usuario_id, parcial, calificacion: inputValue },
      ]);
    }
  };

  useEffect(() => {
    console.log(students)
  }, [students]);

  useEffect(() => { }, [evaluaciones]);

  const handleSave = async () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    setLoading(true);
    const data = {
      ...uacRegistrationData,
      alumnos: grades,
    };
    const setGradesResponse = await setUacGrades(data);
    if (setGradesResponse && setGradesResponse.success) {
      const fileUrl = URL.createObjectURL(setGradesResponse.data);
      window.open(fileUrl);
      await onOk(data);
    }
    setLoading(false);
    setIsModalVisible(false);
  }

  const handleCancel = async () => {
    setIsModalVisible(false);
  }

  return (
    <Modal
      title="Evaluar calificaciones"
      visible={visible}
      okText="Enviar"
      onOk={handleSave}
      onCancel={onCancel}
      width={1250}
      style={{ top: 20 }}
      confirmLoading={loading}
    >
      <Table
        rowClassName={() => "editable-row"}
        rowKey="usuario_id"
        bordered
        pagination={false}
        columns={columns}
        scroll={{ x: columns.length * 200 }}
        dataSource={students}
      />
      <Modal title="Confimaci??n" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} okText='Aceptar' cancelText='Cancelar' okButtonProps={{ style: { backgroundColor: primaryColor, borderColor: primaryColor, } }}>
        <ExclamationCircleOutlined /> <span>Una vez enviada la evaluaci??n, no podr?? ser modificada despu??s del periodo de evaluaciones, ??est?? seguro del envio?</span>
      </Modal>
    </Modal>

  );
};
