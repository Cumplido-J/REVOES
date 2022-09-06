import React, { useState } from "react";
import { InputNumber, Table } from "antd";
import { columnProps, defaultColumn } from "../../../shared/columns";
import { useEffect } from "react";

const BinnacleCaptureDataTable = ({
  students,
  evaluationCriteria,
  currentEvaluationCriteria,
  onDataUpdate,
  dataStudent,
}) => {
  const [studentsCopy, setStudentsCopy] = useState([]);
  const [studentsArray, setStudentsArray] = useState([]);
  useEffect(() => {
    setStudentsCopy(Object.assign([], students));
    setStudentsArray(Object.assign([],getStudentDataForTable(dataStudent, evaluationCriteria.parcial)))
  }, [dataStudent]);

  const handleInputChange = (newInputValue, inputKey, currentNodeData) => {
    if(newInputValue !== null) {
      const newStudentsCopy = studentsArray.map((student, index) => {
        if (student.alumno_id === currentNodeData.alumno_id) {
          return {
            ...student,
            [inputKey]: newInputValue,
            wasEdited: ["asistencia", "practicas", "tareas", "examen", "faltas"].some(
              (criteriaType) => {
                if (inputKey === criteriaType) {
                  return (
                    parseFloat(newInputValue) !==
                    parseFloat(studentsArray[index][criteriaType])
                  );
                }
                return (
                  parseFloat(student[criteriaType]) !==
                  parseFloat(studentsArray[index][criteriaType])
                );
              }
            ),
          };
        }
        return student;
      });
      setStudentsArray(newStudentsCopy);
      onDataUpdate(newStudentsCopy, evaluationCriteria);
    } else {
      console.log(newInputValue)
    }
  };

  const getStudentDataForTable = (students, partial) => {
    return students.map((student) => ({
      ...student.calificacion_uac.find(
        (falta) => falta.parcial === partial
      ),
      ...student.bitacora_evaluacion.find(
        (binacle) => binacle.parcial === partial
      ),
      matricula: student.matricula,
      nombre_completo: student.nombre_completo,
    }));
  };

  const nonOptionalsInputColumns = ["faltas"].map((inputKey) => ({
    ...columnProps,
    title: inputKey[0].toUpperCase() + inputKey.slice(1),
    k: inputKey,
    render: (data) => {
      const parcialActual = data.parcial;
      // const uac = data.bitacora_evaluacion.filter(
      //   (e) => e.parcial === parcialActual
      // );
      return (
        <>
          <InputNumber
            min={0}
            onChange={(input) => handleInputChange(input, inputKey, data)}
            value={data[inputKey]}
            disabled={setDisabled(
              currentEvaluationCriteria.parcial,
              data.parcial,
              data[inputKey],
              data.wasEdited,
              data.calificacion
            )}
            // value={
            //   checkIfRubricIsDisabledInPartial("examen", parcialActual)
            //     ? ""
            //     : uac[0]?.examen
            // }
            // disabled={handledInputDisabled("examen", parcialActual, data)}
          />
        </>
      );
    },
  }));

  const inputColumns = ["asistencia","practicas", "tareas", "examen"].map((inputKey) => ({
    ...columnProps,
    title: inputKey[0].toUpperCase() + inputKey.slice(1),
    k: inputKey,
    render: (data) => {
      // const uac = data.bitacora_evaluacion.filter(
      //   (e) => e.parcial === parcialActual
      // );
      return (
        <>
          <InputNumber
            min={0}
            max={10}
            onChange={(input) => handleInputChange(input, inputKey, data)}
            value={data[inputKey]}
            disabled={setDisabled(
              currentEvaluationCriteria.parcial,
              data.parcial,
              data[inputKey],
              data.wasEdited,
              data.calificacion
            )}
            // value={
            //   checkIfRubricIsDisabledInPartial("examen", parcialActual)
            //     ? ""
            //     : uac[0]?.examen
            // }
            // disabled={handledInputDisabled("examen", parcialActual, data)}
          />
        </>
      );
    },
  }));

  const setDisabled = (currentParcial, inputParcial, inputData, wasEdited, grade) => {
    currentParcial = parseInt(currentParcial);
    inputParcial = parseInt(inputParcial);
    if (currentParcial > inputParcial && grade) {
      return inputData && !wasEdited || grade;
    }
    return currentParcial < inputParcial;
  };

  const columns = () => {
    return [
      defaultColumn("Matricula", "matricula"),
      defaultColumn("Alumno", "nombre_completo"),
    ]
      .concat(inputColumns.filter((column) => !!evaluationCriteria[column.k])).
      concat(nonOptionalsInputColumns);
  };
  return (
    <Table
      rowClassName="editable-row"
      rowKey="alumno_id"
      bordered
      pagination={false}
      columns={columns()}
      scroll={{ x: columns.length * 200 }}
      dataSource={studentsArray}
    />
  );
};

export default BinnacleCaptureDataTable;
