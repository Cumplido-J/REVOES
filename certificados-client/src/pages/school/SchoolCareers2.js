import React, { useEffect, useState } from "react";
import { CheckCircleOutlined,EditOutlined} from "@ant-design/icons";
import { Row,Col,Table ,Button, Space} from "antd";
import {ButtonCustom,ButtonIconLink } from "../../shared/components";
import Columns,{ columnProps } from "../../shared/columns";
import CatalogService from "../../service/CatalogService";
import SchoolAddCareer from "./SchoolAddCareer";
import SchoolService from "../../service/SchoolService";
import alerts from "../../shared/alerts";
import PermissionValidator from "../../components/PermissionValidator";
import { permissionList } from "../../shared/constants";

const  columns  = [
  {
  ...columnProps,
  title: "Desasociar",
  render: (row) => {
    return (
      <>
          <PermissionValidator permissions={[permissionList.AGREGAR_PLANTELES]}>
            <ButtonIconLink
              tooltip="Mover alumnos"
              icon={<EditOutlined />}
              color="green" 
              link={`/Planteles/MoverAlumnos/${row.schoolcareerId}/${row.cct}/${row.id}`}
            />
          </PermissionValidator>             
      </>
    );
  },
},  
  Columns.description2,
  Columns.description1, 
];

export default function SchoolCareers2({cct, titulo}) {
  const [careerData,setCareerData]= useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [modalFielVisible, setModalFielVisible] = useState(false);
  const [uploadResponse, setUploadResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    setCareerData([]);
  }, [cct]); 

  useEffect(() => {
    const getSchoolDataCareers = async () => {
      const response = await CatalogService.getCareerCatalogs2(cct);  
      setCareerData(response.careersList);
      setLoading(false);
    };
    getSchoolDataCareers();
  }, [cct]);

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => setSelectedRowKeys(newSelectedRowKeys),
    onSelectAll: (selected) => {
      let idcareers = [];
      if (selected) idcareers = careerData.map((row) => row.id);
      setSelectedRowKeys(idcareers);
    },
  };

  const toggleModalFiel = () => {
    setModalFielVisible(!modalFielVisible);
  };

  const addCareerSchool = async (values) => {
    setLoading(true);
    const response = await SchoolService.deleteCareerSchool({
      cct:cct, 
      careerTypeId: selectedRowKeys,
      
    });  
    setUploadResponse(response);
    setLoading(false);

    if (response.success) {
      setSelectedRowKeys([]);
      alerts.success(response.message);
    }
    return response;
  };
 
  const updateCareer = async (values) => {
    const response = await CatalogService.getCareerCatalogs2(cct);  
    setCareerData(response.careersList);
  };
  const updateCareer2 = () =>{
    updateCareer();
  };

  return (
<>
<Row align="center">
<Space>
        <Col >
        <Button
             onClick={ updateCareer2}
              tooltip="Lista de carreras"
              color="red"  
            >Actualizar</Button>
             </Col >
             <Col>
          <ButtonCustom
            tooltip="Descartar carreras"
            color="gold"
            fullWidth
            disabled={selectedRowKeys.length === 0}
            onClick={toggleModalFiel}
            loading={loading}
            icon={<CheckCircleOutlined />}
          >
            Descartar carreras
          </ButtonCustom>         
        </Col>
        </Space>
      </Row>

<Table
        rowKey="id"
        bordered
        pagination={{ position: ["topLeft", "bottomLeft"] }}
        columns={columns}
        scroll={{ x: columns.length * 200 }}
        dataSource={careerData}
        rowSelection={rowSelection}
        size="small"
      />
      <SchoolAddCareer        
       modalFielVisible={modalFielVisible}
       toggleModalFiel={toggleModalFiel}
       addCareerSchool={addCareerSchool} 
       setCareerData={setCareerData}
       cct={cct}
        />

</>
  );
}