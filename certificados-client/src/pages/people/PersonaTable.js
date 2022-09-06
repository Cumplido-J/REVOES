import React, { useState, useEffect } from "react";
import { EditOutlined, DeleteOutlined} from "@ant-design/icons";
import { Table,Input, Modal, Space } from "antd";
import { ButtonIcon,Loading } from "../../shared/components";
import Columns, { columnProps } from "../../shared/columns";
import PersonaModal from "./PersonaModal";
import PersonaService from "../../service/PersonaService";
import alerts from "../../shared/alerts";

const columnsEnding =(toggleModal,modalDelete) =>[
  {
    ...columnProps,
    title: "Opciones",
    render: (row) => {
      return (
        <>
            <Space size="middle">
              <ButtonIcon
                onClick={() => toggleModal(row.curp)}
                size="large"
                transparent={true}
                tooltip="Editar registro"
                icon={<EditOutlined />}
              />
              <ButtonIcon 
                onClick={() => modalDelete(row.curp)} 
                tooltip="Eliminar" 
                icon={<DeleteOutlined/>} 
                color="red" /> 
            </Space>
        </>
      );
    },
  },
  //Columns.idpersona,
  Columns.rfc,
  Columns.curp,
  Columns.name,
  Columns.firstLastName,
  Columns.secondLastName,
  Columns.state,
];

export default function PersonaTable({ dataset,modalDelete,reload }) {
  //codigo nuevo
  const [curp, setCurp] = useState(null);
  const [columns, setColumns] = useState([]);
  useEffect(() => {
    setColumns(columnsEnding(setCurp,modalDelete));
  }, []); 

  const [q, setQ] = useState("");
  function search(rows){
    //constantes para busqueda de todas las columnas
    const columns=rows[0] && Object.keys(rows[0]);
    return rows.filter((row)=>
    columns.some(
      (column)=>
      row[column].toString().toLowerCase().indexOf(q.toLowerCase())>-1))
  } 
  return (
    <>
    <div>
      <Input type="text" style={{ width: "50%" }} placeholder="Buscar RFC/CURP/Nombre" value={q} onChange={(e)=>setQ(e.target.value)}/>
    </div>
      <Table
        rowKey="curp"
        bordered
        pagination={{ position: ["topLeft", "bottomLeft"] }}
        columns={columns} 
        scroll={{ x: columns.length * 200 }}
        dataSource={search(dataset)}
        size="small"
      />
      <p>
        <strong>Registros encontrados: </strong> {dataset.length}
      </p>
      <EditModal curp={curp} setCurp={setCurp}  reload={reload}/>
    </>
  );
}

function EditModal({ props, curp, setCurp, reload}) {
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [personaData, setPersonaData] = useState({});

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const response = await PersonaService.getPersonaData(curp);
      setLoading(false);
      if (!response.success) return;
      setPersonaData(response.personaData);
      setShowModal(true);
    };
    if (curp === null) {
      setPersonaData([]);
      setShowModal(false);
    } else {
      getData();
    }
  }, [curp]);

  const reloadData = async () => {
    setLoading(true);
    const response = await PersonaService.getPersonaData(curp);
    setLoading(false);
    if (!response.success) return;
    setPersonaData(response.personaData);
  }
  const editPersona = async (form) => {
    const response = await PersonaService.editPersona(curp, form);
    if (!response.success) return;
    await reload();
    await reloadData();
    alerts.success("Guardado", "Datos actualizado correctamente");
  };
  return (
    <Modal
      onCancel={() => {
        setCurp(null);
      }}
      visible={showModal}
      width="80%"
      zIndex={1040}
      centered
      title={"Editar información"}
      footer={null}
    >
      <Loading loading={loading}>
        {personaData.curp && (
          <>
                <PersonaModal {...props} personaData={personaData} onSubmit={editPersona} />
          </>
        )}
      </Loading>
    </Modal>
  );
}
