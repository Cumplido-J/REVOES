import React, { useEffect, useState } from "react";
import { ButtonCustom, PrimaryButton } from "../../../shared/components";
import { OrderedListOutlined } from "@ant-design/icons";
import { Modal, Table } from "antd";
import { columnProps, defaultColumn } from "../../../shared/columns";
import { getEvaluationCriteriaByTeacherSubjectId } from "../../../service/TeacherService";
import CreateEditEvaluationCriteria from "./CreateEditEvaluationCriteria";
import DeleteEvaluationCriteria from "./DeleteEvaluationCriteria";

const validations = {
  req: [{ required: true, message: "Este campo es requerido" }],
};

const colProps = {
  xs: { span: 24 },
};

const rowProps = {
  style: { marginBottom: "1em" },
};

// RefreshData va a a ser una función que actualice las rubricas de evaluación.
export default ({ teacherSubjectId, evaluations = [], refreshData, tipoCurso }) => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleOnOpen = () => {
    setShowModal(true);
  };
  const handleCancel = () => {
    setShowModal(false);
  };
  const columns = [
    defaultColumn("Parcial", "parcial"),
    /* defaultColumn("Total de asistencias", "total_asistencias"), */
    defaultColumn("Asistencia", "asistencia"),
    defaultColumn("Examen", "examen"),
    defaultColumn("Practicas", "practicas"),
    defaultColumn("Tareas", "tareas"),
    {
      ...columnProps,
      title: "Opciones",
      render: (evaluation) => (
        tipoCurso === "recursamiento" ? null : (<>
          {/* TODO: permiso crear rubricas y editar */}
          <CreateEditEvaluationCriteria
            evaluation={evaluation}
            teacherSubjectId={teacherSubjectId}
            onSaveReload={refreshData}
            availablePartials={[parseInt(evaluation.parcial)]}
          />
          {/* TODO: permiso eliminar rubricas */}
          <DeleteEvaluationCriteria
            evaluationData={evaluation}
            onDeleteReload={refreshData}
          />
        </>)
      ),
    },
  ];

  useEffect(() => { }, [evaluations]);

  return (
    <>
      <PrimaryButton
        size="large"
        icon={<OrderedListOutlined />}
        color="geekblue"
        onClick={handleOnOpen}
      >
        Rubricas de evaluación
      </PrimaryButton>
      <Modal
        visible={showModal}
        confirmLoading={loading}
        footer={false}
        onCancel={handleCancel}
        title="Rubrica de evaluación"
        width="80%"
      >
        {tipoCurso === "recursamiento" ? null : (
          <CreateEditEvaluationCriteria
            teacherSubjectId={teacherSubjectId}
            onSaveReload={refreshData}
            availablePartials={[1, 2, 3].filter(
              (partial) =>
                !evaluations.some(
                  (evaluation) => parseInt(evaluation.parcial) === partial
                )
            )}
          />)}
        <Table
          dataSource={evaluations}
          size="small"
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={false}
          scroll={{ x: columns.length * 200 }}
        ></Table>
      </Modal>
    </>
  );
};
