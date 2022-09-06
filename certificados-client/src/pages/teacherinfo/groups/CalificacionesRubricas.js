import React, { useEffect, useState } from "react";

import { Table, Modal, Input, Form, InputNumber, Tabs } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { defaultColumn, columnProps } from "../../../shared/columns";
import Moment from "moment";
import { setUacGradesByRubrics } from "../../../service/TeacherService";
import alerts from "../../../shared/alerts";

export default ({
  setStudents,
  students,
  evaluaciones,
  visible,
  onOk,
  onCancel,
  uacRegistrationData,
  rubricsSetting,
}) => {
  const { TabPane } = Tabs;
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    defaultColumn("Matricula", "matricula"),
    defaultColumn("Alumno", "nombre_completo"),
    {
      ...columnProps,
      title: "Examen",
      render: (data) => {
        const parcialActual = data.parcial;
        const uac = data.bitacora_evaluacion.filter(
          (e) => e.parcial === parcialActual
        );
        return (
          <>
            <InputNumber
              min={0}
              max={10}
              onChange={(inputValue) =>
                handleStudentGrade("examen", parcialActual, data, inputValue)
              }
              defaultValue=""
              value={
                checkIfRubricIsDisabledInPartial("examen", parcialActual)
                  ? ""
                  : uac[0]?.examen
              }
              disabled={handledInputDisabled("examen", parcialActual, data)}
            />
          </>
        );
      },
    },
    {
      ...columnProps,
      title: "Practicas",
      render: (data) => {
        const parcialActual = data.parcial;
        const uac = data.bitacora_evaluacion.filter(
          (e) => e.parcial === parcialActual
        );
        return (
          <>
            <InputNumber
              min={0}
              max={10}
              onChange={(inputValue) =>
                handleStudentGrade("practicas", parcialActual, data, inputValue)
              }
              defaultValue=""
              value={
                checkIfRubricIsDisabledInPartial("practicas", parcialActual)
                  ? ""
                  : uac[0]?.practicas
              }
              disabled={handledInputDisabled("practicas", parcialActual, data)}
            />
          </>
        );
      },
    },
    {
      ...columnProps,
      title: "Tareas",
      render: (data) => {
        const parcialActual = data.parcial;
        const uac = data.bitacora_evaluacion.filter(
          (e) => e.parcial === parcialActual
        );
        return (
          <>
            <InputNumber
              min={0}
              max={10}
              onChange={(inputValue) =>
                handleStudentGrade("tareas", parcialActual, data, inputValue)
              }
              defaultValue=""
              value={
                checkIfRubricIsDisabledInPartial("tareas", parcialActual)
                  ? ""
                  : uac[0]?.tareas
              }
              disabled={handledInputDisabled("tareas", parcialActual, data)}
            />
          </>
        );
      },
    },
    {
      ...columnProps,
      title: "Asistencia",
      render: (data) => {
        const parcialActual = data.parcial;
        const uac = data.bitacora_evaluacion.filter(
          (e) => e.parcial === parcialActual
        );
        return (
          <>
            <InputNumber
              min={0}
              max={10}
              onChange={(inputValue) =>
                handleStudentGrade(
                  "asistencia",
                  parcialActual,
                  data,
                  inputValue
                )
              }
              defaultValue=""
              value={
                checkIfRubricIsDisabledInPartial("asistencia", parcialActual)
                  ? ""
                  : uac[0]?.asistencia
              }
              disabled={handledInputDisabled("asistencia", parcialActual, data)}
            />
          </>
        );
      },
    },
  ];

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleOnViewMore = (info) => {};

  const callback = (key) => {
    //console.log(key);
  };

  useEffect(() => {}, [students]);

  useEffect(() => {}, [evaluaciones]);

  useEffect(() => {}, [rubricsSetting]);

  const handledInputDisabled = (rubric, partial, student) => {
    if (checkIfRubricIsDisabledInPartial(rubric, partial)) {
      return true;
    } else {
      if (evaluaciones && Array.isArray(evaluaciones) && evaluaciones.length) {
        if (evaluaciones[0].parcial === partial) return false;
        else if (evaluaciones[0].parcial > partial) {
          const rubricByPartial = student.bitacora_evaluacion.find(
            (b) => b.parcial === partial
          );
          return !!rubricByPartial[rubric] && !!rubricByPartial.id;
        }
      }
      return true;
    }
  };

  const checkIfRubricIsDisabledInPartial = (rubric, parcial) => {
    if (rubricsSetting.find((e) => e.parcial === parcial)) {
      return !rubricsSetting.find((e) => e.parcial === parcial)[rubric];
    } else {
      return false;
    }
  };

  const handleSave = async () => {
    setLoading(true);
    var setGradesResponse;
    var dataAux;
    for (let i = 0; i < rubricsSetting.length; i++) {
      const data = {
        ...uacRegistrationData,
        rubricas_evaluacion_id: rubricsSetting[i].id,
        alumnos: grades
          .filter((grade) => grade.parcial === rubricsSetting[i].parcial)
          .map((e) => {
            const emptyRubrics = [];
            if (checkIfRubricIsDisabledInPartial("asistencia", e.parcial))
              e.asistencia = 0;
            if (checkIfRubricIsDisabledInPartial("examen", e.parcial))
              e.examen = 0;
            if (checkIfRubricIsDisabledInPartial("tareas", e.parcial))
              e.tareas = 0;
            if (checkIfRubricIsDisabledInPartial("practicas", e.parcial))
              e.practicas = 0;
            if (!e.asistencia) emptyRubrics.push("asistencia");
            if (!e.examen) emptyRubrics.push("examen");
            if (!e.tareas) emptyRubrics.push("tareas");
            if (!e.practicas) emptyRubrics.push("practicas");
            if (emptyRubrics.length) {
              const student_grades = students
                .find((s) => s.usuario_id === e.alumno_id)
                .bitacora_evaluacion.find((b) => b.parcial === e.parcial);
              emptyRubrics.forEach((r) => {
                if (!e[r])
                  e[r] = student_grades[r] === "" ? 0 : student_grades[r];
              });
            }
            return e;
          }),
      };
      if (data.alumnos.length) {
        setGradesResponse = await setUacGradesByRubrics(data);
        if (setGradesResponse && setGradesResponse.success) {
          dataAux = data;
        }
      }
    }
    if (setGradesResponse && setGradesResponse.success) {
      const fileUrl = URL.createObjectURL(setGradesResponse.data);
      window.open(fileUrl);
      await onOk(dataAux);
    }
    setLoading(false);
    setGrades([]);
  };

  const handleStudentGrade = (rubrica, parcial, student, inputValue) => {
    if (inputValue) {
      const x = students.map((s) => {
        if (s.usuario_id === student.usuario_id) {
          return {
            ...s,
            bitacora_evaluacion: student.bitacora_evaluacion.map((sg) =>
              sg.parcial === parcial ? { ...sg, [rubrica]: inputValue } : sg
            ),
          };
        } else {
          return s;
        }
      });
      setStudents(x);
      const gradeIndex = grades.findIndex(
        (g) => g.alumno_id === student.usuario_id && g.parcial === parcial
      );
      if (gradeIndex > -1) {
        setGrades(
          grades.map((g, index) =>
            index === gradeIndex ? { ...g, [rubrica]: inputValue } : g
          )
        );
      } else {
        if (inputValue) {
          setGrades([
            ...grades,
            { alumno_id: student.usuario_id, parcial, [rubrica]: inputValue },
          ]);
        }
      }
    }
  };

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
      <Tabs defaultActiveKey="1" onChange={callback}>
        <TabPane tab="Parcial 1" key="1">
          <Table
            rowClassName={() => "editable-row"}
            rowKey="usuario_id"
            bordered
            pagination={false}
            columns={columns}
            scroll={{ x: columns.length * 200 }}
            dataSource={students.map((student) => {
              return {
                ...student,
                parcial: "1",
              };
            })}
          />
        </TabPane>
        <TabPane tab="Parcial 2" key="2">
          <Table
            rowClassName={() => "editable-row"}
            rowKey="usuario_id"
            bordered
            pagination={false}
            columns={columns}
            scroll={{ x: columns.length * 200 }}
            dataSource={students.map((student) => {
              return {
                ...student,
                parcial: "2",
              };
            })}
          />
        </TabPane>
        <TabPane tab="Parcial 3" key="3">
          <Table
            rowClassName={() => "editable-row"}
            rowKey="usuario_id"
            bordered
            pagination={false}
            columns={columns}
            scroll={{ x: columns.length * 200 }}
            dataSource={students.map((student) => {
              return {
                ...student,
                parcial: "3",
              };
            })}
          />
        </TabPane>
      </Tabs>
    </Modal>
  );
};
