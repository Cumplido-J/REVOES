import React, { useEffect, useState } from "react";
import { EditOutlined, EyeOutlined, } from "@ant-design/icons";
import { Tabs, Table, Modal} from "antd";
import alerts from "../../shared/alerts";
import {ButtonIcon, Loading } from "../../shared/components";
import Columns, { columnProps } from "../../shared/columns";
import CareerForm from "./CareerForm";
import CareerService from "../../service/CareerService";
import CareerModuleForm from "./CareerModuleForm";
import CareerModuleTable from "./CareerModuleTable";
import CatalogService from "../../service/CatalogService";
import { userHasRole } from "../../shared/functions";
import LectureModuleForm from "./LectureModuleForm";
import LectureModuleTable from "./LectureModuleTable";

const columns = (toggleModal, userProfile) => [
  {
    ...columnProps,
    title: "Opciones",
    render: (row) => {
      return (
        <>
          {(userHasRole.dev(userProfile.roles)) && (
            <ButtonIcon onClick={() => toggleModal(row.careerKey)}
              tooltip="Editar"
              icon={<EditOutlined />}
              color="green" />
          )}
          {(!userHasRole.dev(userProfile.roles)) && (
            <ButtonIcon onClick={() => toggleModal(row.careerKey)}
              tooltip="Vista"
              icon={<EyeOutlined />}
              color="gray" />
          )}
        </>
      );
    },
  },
  Columns.name,
  Columns.careerKey,
  Columns.totalCredits,
  Columns.perfilType,
];

export default function CareerTable({ dataset, reload, userProfile }) {
  const [careerKey, setCareerKey] = useState(null);
  return (
    <>
      <p style={{ marginTop: "2em" }}>
        <strong>Registros encontrados: </strong> {dataset.length}
      </p>
      <Table
        rowKey="careerKey"
        bordered
        pagination={{ position: ["topLeft", "bottomLeft"] }}
        columns={columns(setCareerKey, userProfile)}
        scroll={{ x: columns.length * 200 }}
        dataSource={dataset}
        size="small"
      />
      <p>
        <strong>Registros encontrados: </strong> {dataset.length}
      </p>
      <CareerEditModal careerKey={careerKey} career={dataset.id} setCareerKey={setCareerKey} reload={reload} userProfile={userProfile} />
    </>
  );
}


function CareerEditModal({ props, careerKey, career, setCareerKey, reload, userProfile }) {
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [careerData, setCareerData] = useState({});
  const [competList, setCompetList] = useState([]);
  const [moduleData, setModuleData]= useState([]);
  ///////////////////////////////////////////////////////////
  ///////////////para materias
  ////////////////////////////////////////////////////////////
  const [lectureList, setLectureList] = useState([]);
  const [catalogs, setCatalogs] = useState({ diciplinar: [], modules: [], semestre:[], decision:[], tipo_uac:[] });
  
  //nuevo
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [uploadResponse, setUploadResponse] = useState(null);

  useEffect(() => {
    const getCareerData = async () => {
      setLoading(true);
      const response = await CareerService.getCareerData(careerKey);
      const response2 = await CatalogService.getCompetencias(careerKey);

      ////////////////////////////////////////////////////////////
      ///////////////para materias
      ////////////////////////////////////////////////////////////
      const response3= await CareerService.getLecturesByCareer(careerKey);
      const response6 = await CatalogService.getSubjectType();
  


      setLoading(false);
      if (!response.success) return;
      setCareerData(response.careerData);
      setCompetList(response2.competList);


      ////////////////////////////////////////////////////////////
      ///////////////para materias
      ////////////////////////////////////////////////////////////
      setLectureList(response3.data);
      const response4= await CatalogService.getModulesByCareer(response.careerData.idcareer);
      const response5= await CatalogService.getDiciplinarCatalogs();
      if (!response4.success) return;
      const modules = response4.modules.map((module) => ({id: module.id,description: `${module.description1}`,}));
      if (!response5.success) return;
      //mapa para semestre
      const semestres = [{ id:1, description:1 },{ id:2, description:2 },{ id:3, description:3 },{ id:4, description:4 },{ id:5, description:5 },{ id:6, description:6 }];
      const decisions = [{ id:"true", description:'verdadero' },{ id:"false", description:'falso' }];
      const diciplinar=response5.diciplinas.map((diciplina) => ({ id: diciplina.id, description: diciplina.description1}));
      const tipo_uac=response6.subjects.map((subject) => ({ id: subject.id, description: subject.description1 }));
      const semestre=semestres.map((a) => ({ id: a.id, description: a.description}));
      const decision=decisions.map((a) => ({ id: a.id, description: a.description}));
      setCatalogs({ ...catalogs, modules, diciplinar, semestre, decision,tipo_uac });
      

      setShowModal(true);
    };
    if (careerKey === null) {
      setCareerData([]);

      ///para materias
      setLectureList([]);
      setCompetList({});
      setShowModal(false);
    } else {
      getCareerData();
    }
  }, [careerKey]);

  const reloadData = async () => {
    setLoading(true);
    const response = await CareerService.getCareerData(careerKey);
    setLoading(false);
    if (!response.success) return;
    setCareerData(response.careerData);
  }
  
 ////button editar---codigo nuevo
  const editButtonData = async (id) => {
    setLoading(true);
    const response = await CareerService.getCareerModuleData(id);
    setLoading(false); 
    if (!response.success) return; 
    setModuleData(response.moduleData); 
  };     
  const editCareerModule = async (form) => {
    const response = await CareerService.editCareerModule(moduleData.id, careerData.idcareer, form);
    if (!response.success) return;
    await reloadModule();
    alerts.success("Competencia guardado", "Competencia actualizado correctamente");
  };
///termina codigo nuevo

  const editCareer = async (form) => {
    const response = await CareerService.editCareer(careerKey, form);
    if (!response.success) return;
    //setShowModal(false);
    await reloadData();
    await reload();
    alerts.success("Competencia modificado", "Competencia actualizado correctamente");
  };

  const addModule = async (form) => {
    const response = await CareerService.addModule(careerData.idcareer, form);
    if (!response.success) return;
    await reloadModule();
    alerts.success("Competencias", "Competencias agregado correctamente");
  }
  const reloadModule = async () => {
    const response = await CatalogService.getCompetencias(careerKey);
    setCompetList(response.competList);
  };

/////////////////////////////////////////////////////para materia
const getLecturesByCareer = async () => {
  const response = await CareerService.getLecturesByCareer(careerData.careerKey);
  if (!response.success) return;
  setLectureList(response.data)
};
const getLecturesByCareer_UAC = async (form) => {
  const response = await CareerService.getLecturesByCareer_UAC(form.busqueda, careerData.careerKey);
  if (!response.success) return;
  setLectureList(response.data) 
}
const deleteLecture = async (id_cuac) => {
  setLoading(true);
  const response = await CareerService.deleteLectureAssociationByCU_Id(id_cuac);
  await getLecturesByCareer();
  setLoading(false);
  if (response.success) {
    alerts.success(response.data);
  }else
  {
    alerts.error(response.data);
  }
  return response;
};

const insertLecture = async (form) => {
  setLoading(true);
  const response = await CareerService.insertLecture(careerData.idcareer,form);
  await getLecturesByCareer();
  setLoading(false);
  if (response.success) {
    alerts.success(response.data);
  }else
  {
    alerts.error(response.data);
  }
  return response;
};

const updateLecture = async (id,form) => {
  setLoading(true);
  const response = await CareerService.updateLectureById(id,form);
  //await getLecturesByCareer();
  setLoading(false);
  if (response.success) {
    alerts.success(response.data);
  }else
  {
    alerts.error(response.data);
  }
  return response;
};


const getLectureById = async (id) => {
  setLoading(true);
  const response = await CareerService.getLectureById(id);
  setLoading(false);
  if (response.success) {
    //alerts.success(response.data);
  }else
  {
    alerts.error(response.data);
  }
  return response.data;
};

///////////////////////////////////////////////////// FIN para materia


  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => setSelectedRowKeys(newSelectedRowKeys),
    onSelectAll: (selected) => {
      let idmod = [];
      if (selected) idmod = competList.map((row) => row.id);
      setSelectedRowKeys(idmod);
    },
  };

  const deleteModule = async (values) => {
    setLoading(true);
    const response = await CareerService.deleteCompetences({
      careerModuleId: selectedRowKeys,
    });
    await reloadModule();
    setUploadResponse(response);
    setLoading(false);

    if (response.success) {
      setSelectedRowKeys([]);
      alerts.success(response.message);
    }
    return response;
  };

  return (
    <Modal
      onCancel={() => {
        setCareerKey(null);
      }}
      visible={showModal}
      width="80%"
      zIndex={1040}
      centered
      title={"Editar Carrera"}
      footer={null}
    >
      <Loading loading={loading}>
        {careerData.careerKey && (
          <>
            <Tabs defaultActiveKey="1" type="card">
              <Tabs.TabPane tab="Información de la carrera" key="1">
                <CareerForm {...props} careerData={careerData} onSubmit={editCareer} userProfile={userProfile} />
              </Tabs.TabPane>
              {userHasRole.dev(userProfile.roles) && (
                <Tabs.TabPane tab="Agregar Competencia" key="2">
                  <CareerModuleForm {...props} onSubmit={addModule} moduleData={moduleData} onEdit={editCareerModule}/>
                  <CareerModuleTable dataset={competList} rowSelection={rowSelection} deleteModule={deleteModule}
                    selectedRowKeys={selectedRowKeys} userProfile={userProfile}  editButton={editButtonData}/>
                </Tabs.TabPane>
              )}
              {!userHasRole.dev(userProfile.roles) && (
                <Tabs.TabPane tab="Ver Competencia" key="3">
                  <CareerModuleTable dataset={competList} rowSelection={rowSelection} deleteModule={deleteModule}
                    selectedRowKeys={selectedRowKeys} userProfile={userProfile} />
                </Tabs.TabPane>
              )}
                {userHasRole.dev(userProfile.roles) && (
                <Tabs.TabPane tab="Materias" key="4">
                  <LectureModuleForm {...props} onSubmit={getLecturesByCareer_UAC} />
                  <LectureModuleTable dataset={lectureList} deleteLecture={deleteLecture}
                    updateLecture={updateLecture}  insertLecture={insertLecture} getLectureById={getLectureById}
                    getLecturesByCareer={getLecturesByCareer} catalogs={catalogs}/>
                </Tabs.TabPane>
              )}
            </Tabs>
          </>
        )}
      </Loading>
    </Modal>
  );
}