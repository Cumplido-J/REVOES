import React, { useEffect } from "react";
import { defaultColumn, columnProps } from "../../../shared/columns";
import {
  EyeOutlined,
} from "@ant-design/icons";
import { ButtonIconLink } from "../../../shared/components";
import { Table } from "antd";
import PrintAttendanceList from "../../../components/PrintAttendanceList";
import PrintStudentGradesList from "../../../components/PrintStudentGradesList";

export default ({ asignaturas }) => {

  const columnsAsignaturas = [
    {
      ...columnProps,
      title: "Opciones",
      render: (data) => {
        return (
          <>
            <ButtonIconLink
              tooltip="Ver Más"
              icon={<EyeOutlined />}
              color="green"
              tooltipPlacement="top"
              link={`/Docente/Asignaciones/Grupo/${data.id}`}
            />
            <PrintAttendanceList
              groupPeriodId={data.grupo_periodo_id}
              teacherUacId={data.carrera_uac_id}
            />
            <PrintStudentGradesList
              groupPeriodId={data.grupo_periodo_id}
              teacherAssigmentId={data.plantilla_docente_id}
              plantelId={data.plantel_id}
              CareerUacId={data.carrera_uac_id}
            />
          </>
        );
      },
    },
    defaultColumn("Periodo", "periodo_name"),
    defaultColumn("Semestre", "semestre_grupo"),
    defaultColumn("Grupo", "nombre_grupo"),
    defaultColumn("Asignatura", "uac_description"),
    defaultColumn("Carrera", "carrera_description"),
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
  }, [asignaturas]);

  return (
    <>
      <Table
        rowKey="id"
        bordered
        pagination={{ position: ["topLeft", "bottomLeft"] }}
        columns={columnsAsignaturas}
        scroll={{ x: columnsAsignaturas.length * 200 }}
        dataSource={asignaturas}
        size="small"
      />
    </>
  );
};
