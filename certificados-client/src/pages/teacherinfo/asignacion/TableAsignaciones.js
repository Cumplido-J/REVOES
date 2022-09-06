import React, { useState, useEffect } from "react";
import moment from "moment";
import { Table} from "antd";
import { ButtonIcon } from "../../../shared/components";
import { EyeOutlined } from "@ant-design/icons";
import { defaultColumn, columnProps } from "../../../shared/columns";
import {
  getAssignmentsFromLoggedInTeacher,
  getAssignmentsTeacherById,
} from "../../../service/TeacherService";

import Asignacion from "./Asignacion";

export default () => {
  const [loading, setLoading] = useState(true);

  const [subjects, setSubjects] = useState({});

  const [assignments, setAssignments] = useState([]);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const columns = [
    {
      ...columnProps,
      title: "Opciones",
      render: (data) => {
        return (
          <>
            <ButtonIcon
              tooltip="Ver Más"
              icon={<EyeOutlined />}
              color="green"
              onClick={() => handleOnViewMore(data)}
              tooltipPlacement="top"
            />
          </>
        );
      },
    },
    defaultColumn("Tipo de Plaza", "tipo_plaza_nombre"),
    defaultColumn("Tipo plantel", "tipo_plantel"),
    defaultColumn("Plantel", "plantel_nombre"),
    defaultColumn("Horas", "horas"),
    defaultColumn("Inicio de Asignación", "fecha_inicio_contrato"),
    defaultColumn("Fin de Asignación", "fin_contrato"),
    defaultColumn("Estatus", "estatus_asignación"),
  ];

  const handleOnViewMore = async (info) => {
    setLoading(true);
    const response = await getAssignmentsTeacherById(info.id);
    if (response && response.success) {
      setSubjects({
        ...response.data[0],
        municipio_plantel: response.data[0].plantel.municipio.nombre,
        estado_plantel: response.data[0].plantel.municipio.estado.nombre,
        nombre_plantel: response.data[0].plantel.nombre_final,
        tipo_plaza_nombre: response.data[0].tipo_plaza.nombre,
        docente_asignatura: response.data[0].docente_asignatura.map((grupo) => {
          return {
            ...grupo,
            semestre_grupo: grupo.carrera_uac.semestre,
            nombre_grupo: grupo.grupo_periodo.grupo.grupo,
            nombre_carrera: grupo.carrera_uac.carrera.nombre,
            nombre_asignatura: grupo.carrera_uac.uac.nombre,
            clave_uac: grupo.carrera_uac.uac.clave_uac,
            clave_carrera: grupo.carrera_uac.carrera.clave_carrera,
            nombre_plantel: grupo.plantel.nombre_final,
            status_asignatura: grupo.estatus === "1" ? "Activo" : "Terminado",
          };
        }),
      });
    }
    setLoading(false);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    setIsModalVisible(false);
  };

  const handleCancel = async () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    const setUp = async () => {
      setLoading(true);
      const response = await getAssignmentsFromLoggedInTeacher();
      if (response && response.success) {
        setAssignments(
          response.data.map((assignment) => {
            return {
              ...assignment,
              tipo_plaza_nombre: assignment.tipo_plaza.nombre,
              plantel_nombre: assignment.plantel.nombre,
              tipo_plantel: assignment.plantel.tipo_plantel.siglas,
              fin_contrato: assignment.fecha_fin_contrato
                ? moment(assignment.fecha_fin_contrato).format("YYYY-MM-DD")
                : "En curso",
              estatus_asignación:
                assignment.plantilla_estatus == "1" ? "Activo" : "Terminado",
            };
          })
        );
      }
      setLoading(false);
    };
    setUp();
  }, []);

  return (
    <>
      <Table
        rowKey="id"
        bordered
        pagination={{ position: ["topLeft", "bottomLeft"] }}
        columns={columns}
        scroll={{ x: columns.length * 200 }}
        dataSource={assignments}
        size="small"
        loading={loading}
      />
      <Asignacion
        subjects={subjects}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      />
    </>
  );
};
