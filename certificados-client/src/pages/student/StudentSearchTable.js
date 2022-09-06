import React, { useEffect, useState } from "react";
import { EditOutlined } from "@ant-design/icons";
import { Table,Switch, Space} from "antd";
import { ButtonIconLink } from "../../shared/components";
import Columns, { columnProps } from "../../shared/columns";
import { userHasRole } from "../../shared/functions";
const columnsEnding = (editCheck,userProfile)=>[
  {
    ...columnProps,
    title: "Opciones",
    render: (row) => {
      return ( 
        <>
        <Space size="middle" style={{ marginBottom: "1em" }}>
        <ButtonIconLink tooltip="Editar" icon={<EditOutlined />} color="green" link={`/Alumnos/Editar/${row.curp}`} />
        {(userHasRole.dev(userProfile.roles)) && (  
          <Switch
              checkedChildren="Activo"
              unCheckedChildren="Inactivo"
              onChange={() => editCheck(row.curp,row.estatus==1 ? 0:1)} 
              checked={row.estatus ==1 ? true:false}
            />
        )}
          </Space>      
        </>
        );
    },
  },
  Columns.curp,
  Columns.name,
  Columns.firstLastName,
  Columns.secondLastName,
  Columns.enrollmentKey,
  Columns.generation,
  Columns.cct,
  Columns.schoolName,
  Columns.careerName,
  Columns.carrerKey,
];

export default function StudentSearchTable({ dataset,editCheck,userProfile }) {
  const [columns, setColumns] = useState([]);
  useEffect(() => {
    setColumns(columnsEnding(editCheck,userProfile));
  }, []);   
  return (
    <>
      <p style={{ marginTop: "2em" }}>
        <strong>Registros encontrados: </strong> {dataset.length}
      </p>
      <Table
        rowKey="curp"
        bordered
        pagination={{ position: ["topLeft", "bottomLeft"] }}
        columns={columns}
        scroll={{ x: columns.length * 200 }}
        dataSource={dataset}
        size="small"
      />
      <p>
        <strong>Registros encontrados: </strong> {dataset.length}
      </p>
    </>
  );
}
