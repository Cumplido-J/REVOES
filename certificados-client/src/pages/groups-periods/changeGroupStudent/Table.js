import { Button, Table } from "antd";
import { CheckOutlined, SaveOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import {
  availableGroupPeriodsFromAGroupPeriod,
  changeMultipleStudentsToAnotherGroup,
  getGroupPeriodById,
} from "../../../service/GroupsPeriodService";
import { columnProps, defaultColumn } from "../../../shared/columns";
import { PrimaryButton, SearchSelect } from "../../../shared/components";
import alerts from "../../../shared/alerts";

export default ({ groupPeriodId }) => {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [availableGroupPeriods, setAvailableGroupPeriods] = useState([]);
  const [groupPeriodSelect, setGroupPeriodSelect] = useState(null);

  const columns = [
    defaultColumn("Matricula", "matricula"),
    defaultColumn("Nombre", "nombre"),
    defaultColumn("Primer apellido", "primer_apellido"),
    defaultColumn("Segundo apellido", "segundo_apellido"),
    defaultColumn("Correo electrónico", "email"),
    {
      ...columnProps,
      title: "Nuevo grupo",
      render: (student) => (
        <>
          <SearchSelect
            value={student.newGroupPeriod}
            dataset={availableGroupPeriods}
            onChange={(newGroupPeriod) =>
              onStudentSelectChange(student, newGroupPeriod)
            }
          />
        </>
      ),
    },
  ];

  const onStudentSelectChange = (student, newGroupPeriod) => {
    student.newGroupPeriod = newGroupPeriod;
    setStudents(students.map((s) => (s.id === student.id ? student : s)));
  };

  const handleApplyToWholeGroup = () => {
    setStudents(
      students.map((s) => ({ ...s, newGroupPeriod: groupPeriodSelect }))
    );
  };

  const handleSave = async () => {
    const cambios = students
      .filter((s) => !!s.newGroupPeriod)
      .map((s) => ({
        alumno_id: s.id,
        grupo_periodo_id: s.newGroupPeriod,
      }));
    if (cambios && cambios.length) {
      const response = await changeMultipleStudentsToAnotherGroup({ cambios });
      console.log(response);
      if (response.success) {
        alerts.success("Listo", response.message);
      } else if (response.data && Array.isArray(response.data)) {
        response.data.forEach((s) => {
          alerts.error(
            `Error al registrar al alumno con matrícula ${s.alumno.matricula} `,
            s.error
          );
        });
      }
      await setUp();
    }
  };

  const setUp = async () => {
    setLoading(true);
    const groupPeriodDataResponse = await getGroupPeriodById(groupPeriodId);
    const availableGroupPeriodsResponse = await availableGroupPeriodsFromAGroupPeriod(
      groupPeriodId
    );
    if (
      groupPeriodDataResponse.success &&
      availableGroupPeriodsResponse.success
    ) {
      setStudents(
        groupPeriodDataResponse.data.alumnos.map((s) => ({
          ...s,
          ...s.usuario,
          newGroupPeriod: null,
        }))
      );
      setAvailableGroupPeriods(
        availableGroupPeriodsResponse.data.map((gp) => ({
          id: gp.id,
          description: gp.grupo,
        }))
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    setUp();
  }, []);
  return (
    <>
      <p>Seleccione un grupo para aplicarlo a todos los alumnos</p>
      <SearchSelect
        value={groupPeriodSelect}
        dataset={availableGroupPeriods}
        onChange={(newGroupPeriod) => setGroupPeriodSelect(newGroupPeriod)}
      />
      <Button
        loading={loading}
        icon={<CheckOutlined />}
        onClick={handleApplyToWholeGroup}
        style={{ width: "90%" }}
      >
        Aplicar este grupo a todos los alumnos
      </Button>
      <p style={{ marginTop: "2em" }}>
        <strong>Registros encontrados: </strong> {students.length}
      </p>
      <Table
        loading={loading}
        rowKey={(row) => `${row.id}-${row.accion}-${row.url}`}
        bordered
        pagination={{ position: ["topLeft", "bottomLeft"] }}
        columns={columns}
        scroll={{ x: columns.length * 200 }}
        dataSource={students}
        size="small"
      />
      <p style={{ marginTop: "2em" }}>
        <strong>Registros encontrados: </strong> {students.length}
      </p>
      <PrimaryButton
        loading={loading}
        icon={<SaveOutlined />}
        onClick={handleSave}
      >
        Guardar cambios
      </PrimaryButton>
    </>
  );
};
