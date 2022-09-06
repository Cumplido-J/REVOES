import React, { useState, useEffect, useRef } from "react";
import { Input, Form, Table, Row, Col, Modal, } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { UsergroupAddOutlined, SearchOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { defaultColumn, columnProps } from "../../../shared/columns";
import { Loading, SearchSelect, PrimaryButton, ButtonIcon } from "../../../shared/components";
import { setStudentsSelected } from "../../../reducers/intersemestralReducer/actions/setStudentsSelected";
import StudentService from "../../../service/StudentService";
import Alerts from "../../../shared/alerts";
import CatalogService from "../../../service/CatalogService";


const { getStudentsToExtraExam, getStudentsBySchoolGroup } = StudentService;
const {getCareerCatalogsBySchool} = CatalogService

const validations = {
  career_id: [{ required: true, message: "¡El campo es requerido!" }],
};

export default ({ schoolIdSelected, setShowModalAdd, showModalAdd }) => {
  const _isMounted = useRef(true); // Initial value _isMounted = true
  const intersemestralInfo = useSelector((store) => store.intersemestralReducer.interInfoData);
  const studentsSelected = useSelector((store) => store.intersemestralReducer.studentSelect)
  const curseType = useSelector((store) => store.intersemestralReducer.curseTypeSelected);
  const [selectedStudent, setSelectedStudent] = useState([]);
  const [specialCase, setSpecialCase] = useState([]);
  const [loading, setLoading] = useState(true);
  const [careers, setCareers] = useState([]);
  const [form] = Form.useForm();
  const [studentsFound, setstudentsFound] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const dispatch = useDispatch();

  const styles = {
    colProps: {
      xs: { span: 8 },
      md: { span: 8 },
    },
    buttonProps: {
      xs: { span: 6 },
      md: { span: 6 },
      style: { textAlign: "right" },
    },
    buttonStyle: {
      style: { width: "100%", "margin-top": "6px" },
    },
    rowProps: {
      style: { justifyContent: "center", alignItems: "center", width: "100%" },
    },
  };


  useEffect(() => {
    return () => {
      _isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    setLoading(false)
  }, []);

  useEffect(() => {
    let arrayStudentSelected = [];
    studentsSelected.forEach(element => {
      arrayStudentSelected.push(element)
    });
    setSelectedStudent(arrayStudentSelected);
    setUp();
  }, [studentsSelected]);

  if (_isMounted.current) {
    // Check always mounted component
    // continue treatment of AJAX response... ;
  }

  const showModal = () => {
    setShowModalAdd(true);
  };

  const setUp = async () => {
    const responseCareers = await getCareerCatalogsBySchool(schoolIdSelected);
    if (responseCareers.success) {
      setCareers(
        responseCareers.carreras.map(({ id, clave_carrera, nombre }) => ({
          id,
          description: clave_carrera + " - " + nombre
        }))
      );
    }
  };

  const handleCancel = () => {
    setShowModalAdd(false);
  };

  const handleCancelNotify = () => {
    setIsModalVisible(false);
  };

  const handleAddStudentConfirmation = () => {
    const index = selectedStudent.findIndex(
      (e) => e === specialCase.usuario_id
    )
    let arrayStudents = selectedStudent;
    if (selectedStudent.find(e => e.usuario_id == specialCase.usuario_id)) {
      /* arrayStudents.splice(index, 1);
      setSelectedStudent(arrayStudents);
      dispatch(setStudentsSelected(arrayStudents)); */
      Alerts.warning("El alumno ya se encuentra en la lista");
    } else {
      arrayStudents.push(specialCase);
      setSelectedStudent(arrayStudents);
      dispatch(setStudentsSelected(arrayStudents));
      setShowModalAdd(false);
      form.setFieldsValue({ alumno_name: null });
      setstudentsFound([]);
      Alerts.success("Alumno agregado agregado a la lista");
    }
    setIsModalVisible(false);
  }

  const handleAddStudent = (student) => {
    const studentMaped = {
      ...student,
      periodo: student.calificacion_uac[0]?.periodo?.nombre_con_mes
    }
    setSpecialCase(studentMaped);
    setIsModalVisible(true);
  }

  const handleFinishFailed = () => {

  };

  const handleOnCareerChange = () => {

  }

  const handleFinish = async (values) => {
    setLoading(true);
    var data = {};
    if(curseType === 3) {
      data = {
        carrera_id: values.career_id,
        carrera_uac_id: intersemestralInfo.carrera_uac_id,
        input: values.alumno_name,
        plantel_id: intersemestralInfo.plantel,
      }
    } else if(curseType === 1 || curseType === 2) {
      data = {
        carrera_id: values.career_id,
        carrera_uac_id: intersemestralInfo.carrera_uac_id,
        input: values.alumno_name,
        plantel_id: intersemestralInfo.plantel,
        tipo_recursamiento: curseType === 1 ? "semestral" : "intersemestral"
      }
    }
    const respondeStudents = curseType === 3 ? await getStudentsToExtraExam(data) : await getStudentsBySchoolGroup(data);
    if (respondeStudents && respondeStudents.success) {
      if (respondeStudents.data.length) {
        setstudentsFound(respondeStudents.data.map((s) => {
          return {
            ...s,
            nombre: s.usuario.nombre,
            primer_apellido: s.usuario.primer_apellido,
            segundo_apellido: s.usuario.segundo_apellido,
            carrera: s.carrera.nombre + "-" + s.carrera.clave_carrera
          }
        }))
      } else {
        Alerts.warning(
          "No se encontraron registros",
          "No se logro encontrar ningún registro con esos criterios de busqueda."
        );
      }
    }
    setLoading(false);
  };

  const columns = [
    {
      ...columnProps,
      title: "Opciones",
      render: (student) => {
        /*TODO: Set margins*/
        return (
          <>
            <ButtonIcon
              tooltip="Añadir a la lista"
              icon={<UsergroupAddOutlined />}
              color="blue"
              onClick={() => handleAddStudent(student)}
              tooltipPlacement="top"
            />
          </>
        );
      },
    },
    defaultColumn("Matricula", "matricula"),
    defaultColumn("Nombre", "nombre"),
    defaultColumn("Primer Apellido", "primer_apellido"),
    defaultColumn("Segundo Apellido", "segundo_apellido"),
    defaultColumn("Carrera", "carrera"),

  ];
  return (
    <>
      <Modal width={1250} title="Agregar alumno" visible={showModalAdd} footer={null} onCancel={handleCancel} >
        <Form
          form={form}
          onFinish={handleFinish}
          onFinishFailed={handleFinishFailed}
          layout="vertical"
        >
          <Row {...styles.rowProps}>
            <Col {...styles.colProps}>
              <Form.Item
                label="Carrera"
                name="career_id"
                rules={validations.career_id}
                style={{marginTop: "-6px"}}
              >
                <SearchSelect
                  dataset={careers}
                  disabled={!careers.length}
                  onChange={handleOnCareerChange}
                />
              </Form.Item>
            </Col>
            <Col {...styles.colProps}>
              <Form.Item
                label="Nombre/CURP/Matricula"
                name="alumno_name"
                style={{marginTop: "-6px"}}
              >
                <Input placeholder="Nombre/CURP/Matricula" />
              </Form.Item>
            </Col>
            <Col {...styles.buttonProps}>
              <PrimaryButton {...styles.buttonStyle} loading={loading} icon={<SearchOutlined />}>
                Buscar
              </PrimaryButton>
            </Col>
          </Row>
        </Form>
        <p style={{ marginTop: "2em" }}>
          <strong>Seleccione alumno para añadir </strong>
        </p>
        <Loading loading={loading}>
          <Table
            rowKey="usuario_id"
            bordered
            pagination={{ position: ["topLeft", "bottomLeft"] }}
            columns={columns}
            scroll={{ x: columns.length * 200 }}
            dataSource={studentsFound}
            size="small"
          />
        </Loading>
        <p style={{ marginTop: "2em" }}>
          <strong>Registros encontrados: </strong> {studentsFound.length}
        </p>
        <Modal title="Confimación" visible={isModalVisible} confirmLoading={loading} onOk={handleAddStudentConfirmation} onCancel={handleCancelNotify} okText='Si' cancelText='No'>
          <ExclamationCircleOutlined /> <span>Está opción es unicamente para casos especiales, ¿está seguro que desea continuar?</span>
        </Modal>
      </Modal>
    </>
  );
};