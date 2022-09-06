import React, { useState } from "react";
import { useEffect } from "react";
import { Modal } from 'antd';
import { ButtonCustom, PrimaryButton } from "../../../shared/components";
import { EditOutlined } from "@ant-design/icons";
import BinnacleCaptureData from "./BinnacleCaptureData";

const Binnacle = ({
  evaluationCriteria,
  students,
  setStudents,
  binnacleRegistrationData,
  currentEvaluationCriteria,
  onSave,
  tipoCurso
}) => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleShowModal = () => {
    if(evaluationCriteria.length){
      setShow(true);
    } else {
      modalInfo();
    }
  };

  const refreshInfo = async () => {
    setLoading(true);
    setShow(false);
    await onSave();
    setLoading(false);
  };

  const modalInfo = () => {
    Modal.info({
      title: 'No hay rubricas de evaluación',
      content: (
        <div>
          <p>Es necesario añadir como mínimo una rúbrica para poder evaluar.</p>
        </div>
      ),
      onOk() {},
    });
  }

  return (
    <>
      {currentEvaluationCriteria?.length ? (
        <PrimaryButton
          size="large"
          icon={<EditOutlined />}
          color="blue"
          onClick={handleShowModal}
          loading={loading}
        >
          Evaluar
        </PrimaryButton>
      ) : (
        false
      )}
      {/* TODO: permiso ver rubricas */}
      <BinnacleCaptureData
        evaluationCriteria={evaluationCriteria}
        showModal={show}
        setShowModal={setShow}
        students={students}
        setStudents={setStudents}
        binnacleRegistrationData={binnacleRegistrationData}
        currentEvaluationCriteria={currentEvaluationCriteria}
        onSave={refreshInfo}
        tipoCurso={tipoCurso}
      />
    </>
  );
};

export default Binnacle;
