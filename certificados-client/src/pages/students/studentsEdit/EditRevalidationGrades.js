import { Modal } from "antd";
import React, { useEffect, useState } from "react";
import StudentService from "../../../service/StudentService";
import alerts from "../../../shared/alerts";
import { ButtonCustom } from "../../../shared/components";
import StudentsAddEditFormCaptureGrades from "../StudentsAddEditFormCaptureGrades";

const EditRevalidationGrades = ({ studentId }) => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [grades, setGrades] = useState([]);

  const handleOpen = async () => {
    setShowModal(true);
  };

  const handleOnGradesChange = (updatedGrades) => {
    setGrades(updatedGrades);
  };

  const handleSave = async () => {
    setLoading(true);
    const saveGradesResponse =
      await StudentService.editStudentRevalidationGrades(getParsedGrades(), studentId);
    if (saveGradesResponse && saveGradesResponse?.success) {
      alerts.success("Listo", saveGradesResponse.message);
    }
    setLoading(false);
		setShowModal(false);
  };

  const getParsedGrades = () =>
    grades.map((grade) => {
      const newGrade = {
        alumno_id: studentId,
        calificacion: grade.calificacion,
        cct: grade.cct,
        creditos: grade.creditos,
        horas: grade.horas,
        tipo_asignatura: grade.tipo_asignatura,
        periodo_id: grade.periodo_id,
      };
      if (typeof grade.id !== "string") {
        newGrade.id = grade.id;
      }
      return newGrade;
    });

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <>
      <ButtonCustom onClick={handleOpen} loading={loading}>
        Editar calificaciones de tránsito 
      </ButtonCustom>
      <Modal
        visible={showModal}
        onOk={handleSave}
        onCancel={handleClose}
        title="Editar calificaciones de tránsito"
        width={1250}
        okText="Guardar"
				confirmLoading={loading}
      >
        {showModal && (
          <StudentsAddEditFormCaptureGrades
            onGradesChange={handleOnGradesChange}
            studentId={studentId}
						disabled={loading}
          />
        )}
      </Modal>
    </>
  );
};

export default EditRevalidationGrades;
