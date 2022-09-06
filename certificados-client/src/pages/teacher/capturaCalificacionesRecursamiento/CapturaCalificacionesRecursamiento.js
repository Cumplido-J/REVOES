import React, { useEffect, useState } from "react";

import { Table, Modal, InputNumber } from "antd";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { defaultColumn, columnProps } from "../../../shared/columns";
import { setUacGradesInterSemester, setUacGradesSemester } from "../../../service/TeacherService";
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

  const columns = [
    defaultColumn("Matricula", "matricula"),
    defaultColumn("Alumno", "nombre_completo"),
    {
      ...columnProps,
      title: "Parcial 1",
      render: (data) => {
        let gradesPartials = data.calificacionesCI ? data.calificacionesCI.filter((x) => (x.parcial !== "1" && x.parcial !== "6")) : null
        const carrera_uac_id = uacRegistrationData.carrera_uac_id;
        let uac = [];
        if (data.calificacionesCI) {
          uac = data.calificacionesCI.filter((e) => e.parcial === "1");
        } else {
          uac = data.calificacionesRS.filter((e) => e.parcial === "1");
        }
        return (
          <>
            <InputNumber
              step={0.1}
              precision={1}
              onChange={(inputValue) => handleStudentGrade("1", data.alumno, inputValue, carrera_uac_id, gradesPartials/* , aproovedGrades */)}
              min={0}
              max={10}
              defaultValue={
                uac !== null && uac.length && uac[0].calificacion !== null
                  ? uac[0].calificacion
                  : ""
              }
            />
          </>
        );
      },
    },
    {
      ...columnProps,
      title: "Parcial 2",
      render: (data) => {
        let gradesPartials = data.calificacionesCI ? data.calificacionesCI.filter((x) => (x.parcial !== "2" && x.parcial !== "6")) : null
        const carrera_uac_id = uacRegistrationData.carrera_uac_id;
        let uac = [];
        if (data.calificacionesCI) {
          uac = data.calificacionesCI.filter((e) => e.parcial === "2");
        } else {
          uac = data.calificacionesRS.filter((e) => e.parcial === "2");
        }
        return (
          <>
            <InputNumber
              step={0.1}
              precision={1}
              onChange={(inputValue) => handleStudentGrade("2", data.alumno, inputValue, carrera_uac_id, gradesPartials/* , aproovedGrades */)}
              min={0}
              max={10}
              defaultValue={
                uac !== null && uac.length && uac[0].calificacion !== null
                  ? uac[0].calificacion
                  : ""
              }
            />
          </>
        );
      },
    },
    {
      ...columnProps,
      title: "Parcial 3",
      render: (data) => {
        let gradesPartials = data.calificacionesCI ? data.calificacionesCI.filter((x) => (x.parcial !== "3" && x.parcial !== "6")) : null
        const carrera_uac_id = uacRegistrationData.carrera_uac_id;
        let uac = [];
        if (data.calificacionesCI) {
          uac = data.calificacionesCI.filter((e) => e.parcial === "3");
        } else {
          uac = data.calificacionesRS.filter((e) => e.parcial === "3");
        }
        return (
          <>
            <InputNumber
              step={0.1}
              precision={1}
              onChange={(inputValue) => handleStudentGrade("3", data.alumno, inputValue, carrera_uac_id, gradesPartials/* , aproovedGrades */)}
              min={0}
              max={10}
              defaultValue={
                uac !== null && uac.length && uac[0].calificacion !== null
                  ? uac[0].calificacion
                  : ""
              }
            />
          </>
        );
      },
    },
  ];

  const handleStudentGrade = (parcial, student, inputValue, carrera_uac_id, gradesPartials /* aproovedGrades */) => {
    if (inputValue !== null) {
      var data = grades;
      const gradeIndex = data.findIndex(
        (g) => g.alumno_id === student.usuario_id && g.parcial === parcial
      );
      if (gradeIndex > -1) {
        data[gradeIndex].calificacion = inputValue;
      } else {
        data = [...data, { alumno_id: student.usuario_id, parcial, calificacion: inputValue, carrera_uac_id }]
      }
      if (gradesPartials !== null) {
        gradesPartials.forEach((e) => {
          const gradesIndex = data.findIndex(
            (g) => g.alumno_id === e.alumno_id && g.parcial === e.parcial
          );
          if (gradesIndex > -1) {
            data[gradesIndex].calificacion = e.calificacion;
          } else {
            data = [
              ...data,
              { alumno_id: e.alumno_id, parcial: e.parcial, calificacion: e.calificacion, carrera_uac_id: e.carrera_uac_id }
            ]
          }
        })
      }
      setGrades(data)
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
      var setGradesResponse = {};
      if (tipoRecursamiento === 1) {
        setGradesResponse = await setUacGradesSemester(data);
      } else if (tipoRecursamiento === 2) {
        setGradesResponse = await setUacGradesInterSemester(data);
      }
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
