import React, { useEffect, useState } from "react";

import { Table, Modal, InputNumber } from "antd";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { defaultColumn, columnProps } from "../../../shared/columns";
import { setUacGradesInterSemester, setUacGradesSemester } from "../../../service/TeacherService";
import { setExtraGrades } from "../../../service/ExtraordinaryExamService";
import alerts from "../../../shared/alerts";

export default ({
  students,
  evaluaciones,
  visible,
  onOk,
  onCancel,
  uacRegistrationData,
  tipoRecursamiento
}) => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const primaryColor = "#9d2449";

  /* const handleOnViewMore = (info) => {
  }; */

  const columns = [
    defaultColumn("Matricula", "matricula"),
    defaultColumn("Alumno", "nombre_completo"),
    {
      ...columnProps,
      title: "Calificación",
      render: (data) => {
        const carrera_uac_id = uacRegistrationData.carrera_uac_id;
        const uac = data.calificacionesEXT.filter((e) => e.parcial === "5");
        return (
          <>
            <InputNumber
              step={0.1}
              precision={1}
              onChange={(inputValue) => handleStudentGrade(data.alumno, inputValue, carrera_uac_id)}
              min={0}
              max={10}
              defaultValue={
                uac && uac.length && uac[0].calificacion !== null
                  ? uac[0].calificacion
                  : ""
              }
            />
          </>
        );
      },
    },
  ];

  const handleStudentGrade = (student, inputValue, carrera_uac_id) => {
    if (inputValue !== null) {
      const gradeIndex = grades.findIndex(
        (g) => g.alumno_id === student.usuario_id
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
          { alumno_id: student.usuario_id, calificacion: inputValue, carrera_uac_id },
        ]);
      }
    }
  };


  useEffect(() => {
  }, [students]);

  useEffect(() => { }, [evaluaciones]);

  const handleSave = async () => {
    if (grades.length > 0) {
      setIsModalVisible(true);
    } else {
      alerts.warning("No hay cambios para guardar", "Ingrese o modifique alguna calificación");
    }
  };

  const handleOk = async () => {
    if (grades.length > 0) {
      setLoading(true);
      const data = {
        ...uacRegistrationData,
        alumnos: grades
      };
      const setGradesResponse = await setExtraGrades(data);

      /* if (tipoRecursamiento === 1) {
        setGradesResponse = await setUacGradesSemester(data);
      } else if (tipoRecursamiento === 2) {
        setGradesResponse = await setUacGradesInterSemester(data);
      } */
      if (setGradesResponse && setGradesResponse.success) {
        alerts.success(setGradesResponse.data.message);
        onOk();
        setGrades([]);
      }
      setLoading(false);
      setIsModalVisible(false);
    }
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
      okButtonProps={{ style: { backgroundColor: primaryColor, borderColor: primaryColor, } }}
    >
      <Table
        rowClassName={() => "editable-row"}
        rowKey="alumno_id"
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
