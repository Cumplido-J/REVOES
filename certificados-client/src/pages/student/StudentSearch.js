import React, { useState, useEffect} from "react";
import { Link } from "react-router-dom";

import { HomeOutlined } from "@ant-design/icons";
import { Row, Col, Breadcrumb } from "antd";
import alerts from "../../shared/alerts";
import { Title } from "../../shared/components";

import StudentSearchFilter from "./StudentSearchFilter";
import StudentService from "../../service/StudentService";
import StudentSearchTable from "./StudentSearchTable";
import StudentSearchActions from "./StudentSearchActions";
import CatalogService from "../../service/CatalogService";
import { userHasRole } from "../../shared/functions";

export default function StudentSearch(props) {
  const [studentList, setStudentList] = useState([]);
  const { userProfile } = props;
  const [states, setStates] = useState([]);

  useEffect(() => {
    async function getStates() {
      if(!(userHasRole.student(userProfile.roles))){
        const response = await CatalogService.getStateCatalogs();
        if (!response) return;
        if(response.states.length > 1){
          setStates([]);
        }else{
          setStates(response.states[0]);
      }
    }
  }
    getStates();
  }, []);
  
  let idState;
  if(states.id){
    idState=states.id;
  }else{
    idState=0;
  }

  const searchStudents = async function (values) {
    localStorage.removeItem('values');
    localStorage.removeItem('local2');
    const response = await StudentService.studentSearch(values);
    setStudentList(response.studentList);
    const campo1=values.stateId!=null ? values.stateId:0;
    const campo2=values.schoolId!=null ? values.schoolId:0;
    const campo3=values.careerId!=null ? values.careerId:0;
    const campo4=values.studentStatusId!=null ? values.studentStatusId:0;
    const campo5=values.generation!=null ? values.generation:"";
    const campo6=values.searchText!=null ? values.searchText:"";
    const datosLo={'stateId':campo1,'schoolId':campo2,'careerId':campo3,
    'studentStatusId':campo4,'generation':campo5, 'searchText':campo6};
    localStorage.setItem('values', JSON.stringify(datosLo));
  };
  const editCheck = async (curp, estatus) => {
    const response = await StudentService.changeStatus(curp,estatus);
    if(!response.success)return;
    if(estatus==1){
      alerts.success("Activado","Estatus activo");
    }else{
      alerts.success("Inactivado","Estatus inactivo");
    }
    await reaload();
  }; 
  const searchStudentsOneFilter = async function (values) {
    localStorage.removeItem('values');
    localStorage.removeItem('local2');
    const response = await StudentService.studentSearch1Filter(values.searchText, idState);
    setStudentList(response.studentList);
    const campo6=values.searchText!=null ? values.searchText:"";
    const datosLo={'searchText':campo6};
    localStorage.setItem('local2', JSON.stringify(datosLo));    
  };

  const reaload= async () => {
    let stateId;
    let schoolId;
    let careerId;
    let studentStatusId;
    let generation;
    let searchText;
    let searchText2;
    const guardado= JSON.parse(localStorage.getItem('values'));
    const saved= JSON.parse(localStorage.getItem('local2'));
    if(guardado){
    stateId=guardado.stateId!=null ? guardado.stateId:0;
    schoolId=guardado.schoolId!=null ? guardado.schoolId:0;    
    careerId=guardado.careerId!=null ? guardado.careerId:0; 
    studentStatusId=guardado.studentStatusId!=null ? guardado.studentStatusId:0;
    generation=guardado.generation!=null ? guardado.generation:"";
    searchText=guardado.searchText!=null ? guardado.searchText:"";
    const response = await StudentService.studentSearch2(stateId, schoolId, careerId, studentStatusId, generation, searchText);
    setStudentList(response.studentList);   
    }else{
      searchText2=saved.searchText!=null ? saved.searchText:"";
      const response2 = await StudentService.studentSearch1Filter(searchText2, idState);
      setStudentList(response2.studentList);
    } 
  }; 

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/" style={{ color: "black" }}>
            <HomeOutlined />
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item style={{ color: "black" }}>
          <span>Lista de alumnos</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Row style={{ marginTop: "1em" }}>
        <Col xs={{ span: 24 }}>
          <Title>Lista de alumnos</Title>
        </Col>
      </Row>

      <StudentSearchFilter {...props} onSubmit={searchStudents} onSubmitOne={searchStudentsOneFilter}/>
      <StudentSearchActions {...props} dataset={studentList} />
      <StudentSearchTable {...props} dataset={studentList} editCheck={editCheck} userProfile={userProfile}/>
    </>
  );
}
