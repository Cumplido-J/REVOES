import React, { useEffect } from "react";
import { defaultColumn, columnProps } from "../../../shared/columns";
import { Table } from "antd";
import PrintStudentGradesList from "../../../components/PrintStudentGradesList";
import ReportsModal from "./ReportsModal";


export default ({ asignaturas_recursamiento, tipoRecursamiento }) => {

  const columnsAsignaturas = [
    {
      ...columnProps,
      title: "Opciones",
      render: (data) => {
        return (
          <>
            {
              tipoRecursamiento === 1 ?
              <ReportsModal grupo={data} /> :
              <PrintStudentGradesList
              groupSemestralId={!data.grupo_recursamiento_intersemestral_id ? data.id : null }
              groupIntersemestralId={data.grupo_recursamiento_intersemestral_id}
              teacherAssigmentId={data.plantilla_docente_id}
              plantelId={data.plantel_id}
              CareerUacId={data.carrera_uac_id}
            />
            }
          </>
        );
      },
    },
    defaultColumn("Periodo", "periodo_name"),
    defaultColumn("Semestre", "semestre"),
    defaultColumn("Grupo", "grupo"),
    defaultColumn("Clave Carrera", "carrera_clave"),
    defaultColumn("Carrera", "carrera_name"),
    defaultColumn("Clave Asignatura", "uac_clave"),
    defaultColumn("Asignatura", "uac_name"),
  ];

  const styles = {
    colProps: {
      xs: { span: 24 },
      md: { span: 12 },
    },
    rowProps: {
      style: { marginBottom: "1em" },
    },
  };

  useEffect(() => {
  }, [asignaturas_recursamiento]);

  return (
    <>
      <Table
        rowKey="id"
        bordered
        pagination={{ position: ["topLeft", "bottomLeft"] }}
        columns={columnsAsignaturas}
        scroll={{ x: columnsAsignaturas.length * 200 }}
        dataSource={asignaturas_recursamiento}
        size="small"
      />
    </>
  );
};
