import React, {useEffect, useState } from "react";
import { EditOutlined,CheckCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import { Table,Col,Row, Space} from "antd";
import { ButtonIconLink,ButtonCustom,ButtonIcon } from "../../shared/components";
import Columns, { columnProps } from "../../shared/columns";
import LectureUpdateModal from "./LectureUpdateModal";
import LectureInsertModal from "./LectureInsertModal";
import { userHasRole } from "../../shared/functions";



export default function LectureModuleTable({ dataset, deleteLecture, insertLecture, updateLecture, getLectureById,getLecturesByCareer,catalogs}) {

  const columns  =[
    {
      ...columnProps,
      title: "Opcion",
      render: (row) => {
        return (
          <>
              <ButtonIcon
                tooltip="Editar"
                icon={<EditOutlined />}
                color="green"
                onClick={()=>togglemodalUpdatetVisible(row.uac_id)}
              />&nbsp;&nbsp;&nbsp;
              <ButtonIcon
                tooltip="Eliminar"
                icon={<DeleteOutlined />}
                color="red"
                onClick={()=>deleteLecture(row.id)}
              />
          </>
        ); 
      },
    },
    {...columnProps, title: "Nombre materia", render: (row) => { return <label >{row.nombre}</label>; },sorter: (a, b) => a.nombre > b.nombre, },
    {...columnProps, title: "clave materia", render: (row) => { return <label >{row.clave_uac}</label>; }, sorter: (a, b) => a.clave_uac > b.clave_uac, },
    {...columnProps, title: "horas", render: (row) => { return <label >{row.horas}</label>; }, sorter: (a, b) => a.horas > b.horas,},
    {...columnProps, title: "creditos", render: (row) => { return <label >{row.credits}</label>; }, sorter: (a, b) => a.credits > b.credits,},
    {...columnProps, title: "campo disciplinar", render: (row) => { return <label >{row.campo_disciplinar_id}</label>; }, sorter: (a, b) => a.campo_disciplinar_id > b.campo_disciplinar_id,},
  ]; 


  


  const [modalInsertVisible, setModalInsertVisible] = useState(false);
  const [modalUpdateVisible, setModalUpdateVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  //guarda el id de uac a actualizar
  const [uacUpdate, setUacUpdate]=useState(0);
  //guarda los resultados de la consulta por id
  const  [resultLectureById, setResultLectureById]=useState([]);
  
  const togglemodalInsertVisible = () => {
    setModalInsertVisible(!modalInsertVisible);
  };

  const togglemodalUpdatetVisible = async (uacid) => {
    console.log("uacid:"+uacid);
    const response = await getLectureById(uacid);
    console.log(response);
    setResultLectureById(response);
    setUacUpdate(uacid);
    setModalUpdateVisible(!modalUpdateVisible);
  };

  const togglemodalUpdatetcancel = () => {
    setModalUpdateVisible(false);
  };

  const togglemodalInsertCancel = () => {
    setModalInsertVisible(false);
  };

  return (
    <>
    <Row align="center">
      <Space>
        <Col>
        {
          <ButtonCustom
            tooltip="agregar materia"
            color="gold"
            fullWidth
            disabled={false}
            onClick={()=>togglemodalInsertVisible()}
            loading={loading}
            icon={<CheckCircleOutlined />}
          >
            Agregar materia
          </ButtonCustom>   
          }      
        </Col>
      </Space>
    </Row>    
      <p style={{ marginTop: "2em" }}> 
        <strong>Registros encontrados1: </strong> {dataset.length}
      </p>
      <Table
        rowKey="id"
        bordered
        pagination={{ position: ["topLeft", "bottomLeft"] }}
        columns={columns}
        scroll={{ x: columns.length * 200 }}
        dataSource={dataset}
        size="small"
      />
      <p>
        <strong>Registros encontrados2: </strong> {dataset.length}
      </p>    
      <LectureUpdateModal        
       uacUpdate={uacUpdate}
       updateLecture={updateLecture}
       togglemodalUpdatetVisible={togglemodalUpdatetVisible}
       modalUpdateVisible={modalUpdateVisible}
       getLectureById={getLectureById} 
       getLecturesByCareer={getLecturesByCareer}
       resultLectureById={resultLectureById}
       togglemodalUpdatetcancel={togglemodalUpdatetcancel}
       catalogs={catalogs}
      />  
      <LectureInsertModal        
        insertLecture={insertLecture}
        togglemodalInsertVisible={togglemodalInsertVisible}
        modalInsertVisible={modalInsertVisible}
        getLecturesByCareer={getLecturesByCareer}
        togglemodalInsertCancel={togglemodalInsertCancel}
        catalogs={catalogs}
      /> 
    </>
  );
}
