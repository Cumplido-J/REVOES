import React from "react";
import { Divider, List, Table, Typography } from "antd";
import useStudentDetails from "./useStudentDetails";
import { Loading } from "../../../shared/components";
import { defaultColumn } from "../../../shared/columns";

const { Text } = Typography;

const StudentDetails = ({ curp }) => {
  const [loading, data] = useStudentDetails(curp);
  return (
    <Loading loading={loading}>
      <Divider orientation="left">Datos del alumno</Divider>
      <List
        size="large"
        bordered
        dataSource={data.studentData}
        renderItem={(item) => (
          <List.Item>
            <Text strong>{item.title}: </Text> {item.value}
          </List.Item>
        )}
      />
      <Divider orientation="left">Datos médicos</Divider>
      <List
        size="large"
        bordered
        dataSource={data.medicalData}
        renderItem={(item) => (
          <List.Item>
            <Text strong>{item.title}: </Text> {item.value}
          </List.Item>
        )}
      />
      <Divider orientation="left">Datos de contacto de tutores</Divider>
      <Table
        rowKey="id"
        bordered
        pagination={{ position: ["topLeft", "bottomLeft"] }}
        columns={[
          defaultColumn("Nombre", "nombre"),
          defaultColumn("Primer Apellido", "primer_apellido"),
          defaultColumn("Segundo Apellido", "segundo_apellido"),
          defaultColumn("Número de teléfono", "numero_telefono"),
        ]}
        scroll={{ x: 4 * 200 }}
        dataSource={data.tutorsContactData}
        size="small"
      />
      <Divider orientation="left">Datos administrativos</Divider>
      <List
        size="large"
        bordered
        dataSource={data.administrativeData}
        renderItem={(item) => (
          <List.Item>
            <Text strong>{item.title}: </Text> {item.value}
          </List.Item>
        )}
      />
      <Divider orientation="left">Datos de la institución</Divider>
      <List
        size="large"
        bordered
        dataSource={data.schoolData}
        renderItem={(item) => (
          <List.Item>
            <Text strong>{item.title}: </Text> {item.value}
          </List.Item>
        )}
      />
    </Loading>
  );
};
export default StudentDetails;
