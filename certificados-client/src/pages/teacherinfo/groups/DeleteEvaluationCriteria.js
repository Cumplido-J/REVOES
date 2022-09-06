import React, { useState } from "react";
import { Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { deleteEvaluationCriteriaByTeacherSubjectId } from "../../../service/TeacherService";
import { ButtonIcon } from "../../../shared/components";

export default ({ evaluationData, onDeleteReload }) => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const primaryColor = "#9d2449";

  const handleOnOpen = () => {
    setShowModal(true);
  };
  const handleCancel = () => {
    setShowModal(false);
  };
  const handleDelete = async () => {
    setLoading(true);
    const deleteResponse = await deleteEvaluationCriteriaByTeacherSubjectId(
      evaluationData.id
    );
    if (deleteResponse && deleteResponse.success) {
      await onDeleteReload();
      setLoading(false);
    }else {
      setLoading(false);
    }
    setShowModal(false);
  };
  return (
    <>
      <ButtonIcon
        tooltip="Editar"
        icon={<DeleteOutlined />}
        color="volcano"
        onClick={handleOnOpen}
        tooltipPlacement="top"
      />
      <Modal
        confirmLoading={loading}
        visible={showModal}
        onCancel={handleCancel}
        onOk={handleDelete}
        title="Eliminar rubrica de evaluación"
        okButtonProps={{ style: {backgroundColor: primaryColor, borderColor: primaryColor,} }}
      >
        <p>
          ¿Desea eliminar la rubrica de evaluación del parcial{" "}
          {evaluationData.parcial}?
        </p>
      </Modal>
    </>
  );
};
