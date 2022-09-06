import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {Row, Col, Breadcrumb} from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { PageLoading, Title } from "../../shared/components";
import SchoolFormupdate from "./SchoolFormupdate";
import SchoolService from "../../service/SchoolService";
import alerts from "../../shared/alerts";

export default function SchoolUpdate(props) {
    //idschoolcareer=idplantel-carrera
  const {schoolcareerId } = props.match.params;
  ///cct=idplantel
  const {cct} = props.match.params;
  ///id=id carrera;
  //const {id} = props.match.params;
  const [resultado, setResultado] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCareer = async () => {
        setLoading(true);
        //const response = await StudentService.getStudentByCareer(schoolcareerId);
        const response = await SchoolService.getTotal(schoolcareerId);
        setLoading(false);
        if (!response.success) return;
        //setStudentList(response.studentList);
        setResultado(response.resultado);
    };
    getCareer();
  }, [schoolcareerId]);

  const updateCareer  = async (form) => { 
    //const response = await SchoolService.deleteCareerUpdateStudent(idschoolcareer,form);
    const response = await SchoolService.deleteCareerUpdateStudent(schoolcareerId,form);
    //const response2 = await StudentService.getStudentByCareer(schoolcareerId);
    //const response2 = await SchoolService.getTotal(schoolcareerId);
    //setStudentList(response2.studentList);
    setResultado(response.resultado);
    if (!response.success) return;
    alerts.success("Registro modificados", "Actualizado correctamente");
  }; 
  
  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/" style={{ color: "black" }}>
            <HomeOutlined />
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/Planteles/" style={{ color: "black" }}>
            <span>Lista de planteles</span>
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item style={{ color: "black" }}>
          <span>Editar plantel</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      <Row style={{ marginTop: "1em" }}>
        <Col xs={{ span: 24 }}>
          <Title>Mover alumnos</Title>
        </Col>
      </Row>
      <PageLoading loading={loading}> 
            <SchoolFormupdate {...props} schoolcareerId={schoolcareerId} cct={cct} dataset={resultado} onSubmit={updateCareer}/>
      </PageLoading>
      
    </>
  );
}
