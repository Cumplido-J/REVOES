import React, { useEffect, useState } from "react";
import { Modal, Table, Tabs } from "antd";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import BinnacleCaptureDataTable from "./BinnacleCaptureDataTable";
import Alerts from "../../../shared/alerts";
import {
  setSemestralGradesByRubrics,
  setUacGradesByRubrics
} from "../../../service/TeacherService";

var partialsData = {};

const BinnacleCaptureData = ({
  showModal,
  setShowModal,
  evaluationCriteria,
  students,
  setStudents,
  binnacleRegistrationData,
  currentEvaluationCriteria,
  onSave,
  tipoCurso
}) => {
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const primaryColor = "#9d2449";
  // const [partialsData, setPartialsData] = useState({
  //   1: [],
  //   2: [],
  //   3: [],
  // });

  useEffect(() => {
    partialsData = {
      1: [],
      2: [],
      3: [],
    };
  }, []);

  const getStudentDataForTable = (students, partial) => {
    console.log("simons", isModalVisible, students, partialsData);
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

  const prepareDataFromPartial = (data, partial) => {
    const partialsDataCopy = Object.assign({}, partialsData);
    partialsDataCopy[partial.parcial] = data.filter(
      ({ wasEdited }) => wasEdited
    );
    partialsData = partialsDataCopy;
    // setPartialsData(partialsDataCopy);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleModalCancel = () => {
    setShowModal(false);
  };

  const handleSave = async () => {
    if(partialsData["1"].length === 0 && partialsData["2"].length === 0 && partialsData["3"].length === 0) {
      Alerts.warning(
        "Favor de llenar correctamente",
        "Evalúe a un alumno por lo menos."
      );
    } else {
      setIsModalVisible(true);
    }
  };

  const handleOk = async () => {
    setLoading(true);
    var setGradesResponse;
    for (var i in partialsData) {
      var currentParcial;
      if (partialsData[i].length) {
        const aux = partialsData[i].map((pd) => {
          currentParcial = pd.parcial;
          return {
            alumno_id: pd.alumno_id,
            parcial: pd.parcial,
            asistencia: pd.asistencia,
            examen: pd.examen,
            practicas: pd.practicas,
            tareas: pd.tareas,
            faltas: pd.faltas
          };
        });

        const data = {
          ...binnacleRegistrationData,
          rubricas_evaluacion_id: evaluationCriteria.find(
            (ec) => ec.parcial === currentParcial
          ).id,
          alumnos: aux,
        };
        if (tipoCurso === "recursamiento") {
          setGradesResponse = await setSemestralGradesByRubrics(data);
        } else {
          setGradesResponse = await setUacGradesByRubrics(data);
          if (setGradesResponse && setGradesResponse.success) {
          }
        }
      }
    }
    if (setGradesResponse && setGradesResponse.success) {
      var fileUrl = fileUrl = URL.createObjectURL(setGradesResponse.data);
      window.open(fileUrl);
      onSave();
    }
    setLoading(false);
    setIsModalVisible(false);
  };

  return (
    <Modal
      title="Evaluar calificaciones"
      visible={showModal}
      confirmLoading={loading}
      okText="Enviar"
      onOk={handleSave}
      onCancel={handleModalCancel}
      width={1250}
      style={{ top: 20 }}
      okButtonProps={{ style: { backgroundColor: primaryColor, borderColor: primaryColor }}}
    >
      <Tabs defaultActiveKey="1">
        {evaluationCriteria.map((ec) => (
          <Tabs.TabPane tab={`Parcial ${ec.parcial}`} key={ec.parcial}>
            <BinnacleCaptureDataTable
              dataStudent={students}
              /* students={getStudentDataForTable(students, ec.parcial)} */
              evaluationCriteria={ec}
              currentEvaluationCriteria={currentEvaluationCriteria[0]}
              onDataUpdate={prepareDataFromPartial}
            />
          </Tabs.TabPane>
        ))}
      </Tabs>
      <Modal title="Confimación" visible={isModalVisible} confirmLoading={loading} onOk={handleOk} onCancel={handleCancel} okText='Aceptar' cancelText='Cancelar' okButtonProps={{ style: { backgroundColor: primaryColor, borderColor: primaryColor, } }}>
        <ExclamationCircleOutlined /> <span>Una vez enviada la evaluación, no podrá ser modificada después del periodo de evaluaciones, ¿está seguro del envio?</span>
      </Modal>
    </Modal>
  );
};

export default BinnacleCaptureData;
