import React, { useEffect, useState } from "react";
import { ButtonIcon } from "../../../shared/components";
import { FileTextOutlined } from "@ant-design/icons";
import Modal from "antd/lib/modal/Modal";
import PrintStudentGradesList from "../../../components/PrintStudentGradesList";
const ReportsModal = ({ grupo }) => {
  const [showModal, setShowModal] = useState(false);
  const [periods, setPeriods] = useState([]);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const buttonDividerStyle = {
    marginBottom: "10px",
    display: "flex",
    justifyContent: "center",
  };

  const setUp = () => {
    var periodsNames = [];
    if(grupo.alumno_grupo_recursamiento_semestral) {
      grupo.alumno_grupo_recursamiento_semestral.map(e => {
        if(periodsNames.length>0) {
          const index = periodsNames.findIndex(x => x.id === e.periodo_curso.id);
          if( index === -1) {
            periodsNames.push({nombre: e.periodo_curso.nombre_con_mes, id: e.periodo_curso.id})  
          }
        } else {
          periodsNames.push({nombre: e.periodo_curso.nombre_con_mes, id: e.periodo_curso.id})
        }
      })
    }
    setPeriods(periodsNames);
  }

  useEffect(() => {
    setUp();
  }, [grupo]);


  return (
    <>
      <ButtonIcon
        tooltip=""
        icon={<FileTextOutlined />}
        color="gold"
        onClick={toggleModal}
        tooltipPlacement="top"
      >
        Reportes
      </ButtonIcon>
      <Modal
        visible={showModal}
        title="Actas de calificaciones por periodo donde cursó"
        onCancel={toggleModal}
        footer={false}
      >
        {
          periods.length > 0 ?
          periods.map((e, value) => {
            return (
              <div style={buttonDividerStyle} key={value}>
                <PrintStudentGradesList
                  groupSemestralId={!grupo.grupo_recursamiento_intersemestral_id ? grupo.id : null}
                  groupIntersemestralId={grupo.grupo_recursamiento_intersemestral_id}
                  teacherAssigmentId={grupo.plantilla_docente_id}
                  plantelId={grupo.plantel_id}
                  CareerUacId={grupo.carrera_uac_id}
                  periodoCursoId={e.id}
                  textBtn={e.nombre}
                  iconMode={false}
                />
              </div>
            )
          }) : "Sin actas para imprimir"
        }
      </Modal>
    </>
  );
};

export default ReportsModal;




