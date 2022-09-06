import React, { useEffect, useState } from "react";

import { Table, Modal, InputNumber } from "antd";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { defaultColumn, columnProps } from "../../../shared/columns";
import { setUacGrades } from "../../../service/TeacherService";

export default ({
  students,
  evaluaciones,
  recuperacion,
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
  };

  // data.calificacion_uac.califi
  const evaluateInputDisabled = (parcial, studentData) => {
    if (evaluaciones.length && evaluaciones[0].parcial == parcial ||
      recuperacion.length && recuperacion.find((r) => r.parcial == parcial) &&
      recuperacion.find((r) => r.parcial == parcial).parcial) {
      return false;
    } else if (evaluaciones.length && evaluaciones[0].parcial > parcial) {
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
              style={{ width: '100%' }}
              step={0.1}
              onChange={(inputValue) => handleStudentGrade(1, data, inputValue, "calificacion", uac[0])}
              min={0}
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
      width: '10%',
    },
    {
      ...columnProps,
      title: "Faltas",
      render: (data) => {
        const uac = data.calificacion_uac.filter((e) => e.parcial === "1");

        return (
          <>
            <InputNumber
              style={{ width: '100%' }}
              step={1}
              onChange={(inputValue) => handleStudentGrade(1, data, inputValue, "faltas", uac[0])}
              defaultValue={
                uac && uac.length && uac[0].faltas !== null
                  ? uac[0].faltas
                  : ""
              }
              disabled={evaluateInputDisabled("1", data)}
            />
          </>
        );
      },
      width: '10%',
    },
    {
      ...columnProps,
      title: "Parcial 2",
      render: (data) => {
        const uac = data.calificacion_uac.filter((e) => e.parcial === "2");

        return (
          <>
            <InputNumber
              style={{ width: '100%' }}
              step={0.1}
              precision={1}
              onChange={(inputValue) => handleStudentGrade(2, data, inputValue, "calificacion", uac[0])}
              min={0}
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
      width: '10%',
    },
    {
      ...columnProps,
      title: "Faltas",
      render: (data) => {
        const uac = data.calificacion_uac.filter((e) => e.parcial === "2");

        return (
          <>
            <InputNumber
              style={{ width: '100%' }}
              step={1}
              defaultValue={
                uac && uac.length && uac[0].faltas !== null
                  ? uac[0].faltas
                  : ""
              }
              disabled={evaluateInputDisabled("2", data)}
              onChange={(inputValue) => handleStudentGrade(2, data, inputValue, "faltas", uac[0])}
            />
          </>
        );
      },
      width: '10%',
    },
    {
      ...columnProps,
      title: "Parcial 3",
      render: (data) => {
        const uac = data.calificacion_uac.filter((e) => e.parcial === "3");

        return (
          <>
            <InputNumber
              style={{ width: '100%' }}
              step={0.1}
              onChange={(inputValue) => handleStudentGrade(3, data, inputValue, "calificacion", uac[0])}
              min={0}
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
      width: '10%',
    },
    {
      ...columnProps,
      title: "Faltas",
      render: (data) => {
        const uac = data.calificacion_uac.filter((e) => e.parcial === "3");

        return (
          <>
            <InputNumber
              style={{ width: '100%' }}
              step={1}
              defaultValue={
                uac && uac.length && uac[0].faltas !== null
                  ? uac[0].faltas
                  : ""
              }
              disabled={evaluateInputDisabled("3", data)}
              onChange={(inputValue) => handleStudentGrade(3, data, inputValue, "faltas", uac[0])}
            />
          </>
        );
      },
      width: '10%',
    },
  ];

  const handleStudentGrade = (parcial, student, inputValue, typeInput, grade) => {
    const gradeIndex = grades.findIndex(
      (g) => g.alumno_id === student.usuario_id && g.parcial === parcial
    );
    if (inputValue !== null) {
      if (typeInput === "calificacion") {
        if (gradeIndex > -1) {
          setGrades(
            grades.map((g, index) =>
              index === gradeIndex ? { ...g, calificacion: inputValue } : g
            )
          );
        } else {
          if (grade) {
            setGrades([
              ...grades,
              { alumno_id: student.usuario_id, parcial, calificacion: inputValue, faltas: grade.faltas },
            ]);
          } else {
            setGrades([
              ...grades,
              { alumno_id: student.usuario_id, parcial, calificacion: inputValue },
            ]);
          }
        }
      } else
        if (typeInput === "faltas") {
          if (gradeIndex > -1) {
            setGrades(
              grades.map((g, index) =>
                index === gradeIndex ? { ...g, faltas: inputValue } : g
              )
            );
          } else {
            if (grade) {
              setGrades([
                ...grades,
                { alumno_id: student.usuario_id, parcial, faltas: inputValue, calificacion: grade.calificacion },
              ]);
            } else {
              setGrades([
                ...grades,
                { alumno_id: student.usuario_id, parcial, faltas: inputValue },
              ]);
            }
          }
        }
    }
  };


  useEffect(() => {
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
      onOk();
      setGrades([]);
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
      okButtonProps={{ style: {backgroundColor: primaryColor, borderColor: primaryColor,} }}
    >
      <Table
        rowClassName={() => "editable-row"}
        rowKey="usuario_id"
        bordered
        pagination={false}
        columns={columns}
        scroll={{ x: columns.length * 100 }}
        dataSource={students}

      />
      <Modal title="Confimación" visible={isModalVisible} confirmLoading={loading} onOk={handleOk} onCancel={handleCancel} okText='Aceptar' cancelText='Cancelar' okButtonProps={{ style: { backgroundColor: primaryColor, borderColor: primaryColor, } }}>
        <ExclamationCircleOutlined /> <span>Una vez enviada la evaluación, no podrá ser modificada después del periodo de evaluaciones, ¿está seguro del envio?</span>
      </Modal>
    </Modal>

  );
};
