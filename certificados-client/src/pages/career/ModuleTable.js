import React, {useEffect, useState } from "react";
import { EditOutlined} from "@ant-design/icons";
import { Table, Modal, Alert } from "antd";
import alerts from "../../shared/alerts";
import {ButtonIcon,Loading } from "../../shared/components";
import Columns, { columnProps } from "../../shared/columns";


import CompetenceService from "../../service/CompetenceService";
import CompetenciaForm from "./CompetenciaForm";
const columns  =(toggleModal) =>[
  {
    ...columnProps,
    title: "Opciones",
    render: (row) => {
      return (
        <>
        <ButtonIcon onClick={() => toggleModal(row.id)} 
        tooltip="Editar" 
        icon={<EditOutlined />} 
        color="green" />
        </>
      );
    },
  },
  Columns.moduleC,
  Columns.competenceE,
]; 

export default function ModuleTable({ dataset ,reload }) {
  const [id, setId] = useState(null);
  return (
    <>
      <p style={{ marginTop: "2em" }}>
        <strong>Registros encontrados: </strong> {dataset.length}
      </p>
      <Table
        rowKey="id"
        bordered
        pagination={{ position: ["topLeft", "bottomLeft"] }}
        columns={columns(setId)}
        scroll={{ x: columns.length * 200 }}
        dataSource={dataset}
        size="small"
      />
      <p>
        <strong>Registros encontrados: </strong> {dataset.length}
      </p>
      <ModuleEditModal id={id} setId={setId} reload={reload}/>
    </>
  );
}

function ModuleEditModal({props,id,setId,reload}){
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [competenceData, setCompetenceData] = useState({});

  useEffect(() => {
      const getCompetenceData  = async () => {
        setLoading(true);
        const response = await CompetenceService.getCompetenceData(id);
        setLoading(false); 
        if (!response.success) return; 
        setCompetenceData(response.competenceData);        
        setShowModal(true);
      };
      if (id === null) {
        setCompetenceData([]);
        setShowModal(false);
      } else {
          getCompetenceData ();
      }
  }, [id]); 

  const editModule= async (form) => {
    const response = await CompetenceService.editCompetence(id,form);  
    if (!response.success) return;
    await reloadModuleData();
    await reload();
    //setShowModal(false);
    alerts.success("Competencia modificado", "Competencia actualizado correctamente");
  };  
  const reloadModuleData=async()=>{
    setLoading(true);
    const response = await CompetenceService.getCompetenceData(id);
    setLoading(false); 
    if (!response.success) return;
    setCompetenceData(response.competenceData);     
  }

  return(
  <Modal
      onCancel={() => {
        setId(null);
      }}
      visible={showModal}
      width="50%"
      zIndex={1040}
      centered
      title={"Editar"}
      footer={null}
      >
        <Loading loading={loading}>
          {competenceData.module && (
            <>
            <CompetenciaForm {...props} competenceData={competenceData} onSubmit={editModule} />
            </>
          )}
        </Loading>
  </Modal>        
  );    
}
