import React, { useState, useEffect, useRef } from "react";
import { Table, Checkbox, Input, Form, Row, Col, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { defaultColumn, columnProps } from "../../../shared/columns";
import { setStudentsSelected } from "../../../reducers/intersemestralReducer/actions/setStudentsSelected";
import AddStudentModal from "../addIntersemestral/AddStudentToIntersemestral"
import { UserAddOutlined } from "@ant-design/icons";
import { SearchSelect, Loading, ButtonCustom, PrimaryButton, ButtonIcon } from "../../../shared/components";
import { setStudentsList } from "../../../reducers/intersemestralReducer/actions/setStudentsList";
import CatalogService from "../../../service/CatalogService";
import StudentService from "../../../service/StudentService";

const { getPeriodsCatalog } = CatalogService;
const { getStudentsBySchoolGroup } = StudentService;

export default ({ tipoRecursamiento, isEditing }) => {
  const _isMounted = useRef(true); // Initial value _isMounted = true
  const [form] = Form.useForm();
  const students = useSelector((store) => store.intersemestralReducer.studentsList);
  const studentsSelected = useSelector((store) => store.intersemestralReducer.studentSelect)
  const intersemestralInfo = useSelector((store) => store.intersemestralReducer.interInfoData);
  const curseType = useSelector((store) => store.intersemestralReducer.curseTypeSelected);
  const [selectedStudent, setSelectedStudent] = useState([]);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [periods, setPeriods] = useState([]);
  const dispatch = useDispatch();

  const styles = {
    colProps: {
      xs: { span: 24 },
      md: { span: 12 },
    },
    buttonProps: {
      xs: { span: 12 },
      md: { span: 6 },
      style: { textAlign: "right" },
    },
    rowProps: {
      style: { justifyContent: curseType === 1 ? "space-between" : "flex-end", alignItems: "center" },
    },
  };

  useEffect(() => {
    return () => {
      _isMounted.current = false;
    };
  }, []);
  useEffect(() => {
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
    setSelectedStudent(studentsSelected);
    if (curseType === 1) {
      const periodsCatalog = await getPeriodsCatalog();
      if (periodsCatalog && periodsCatalog.success) {
        setPeriods(
          periodsCatalog.periods.map(({ id, nombre_con_mes, nombre }) => ({
            id,
            description: nombre_con_mes,
            name: nombre,
          }))
        );
      }
    }
    if (form.getFieldValue().period_id || curseType === 2) {
      handleOnPeriodsChange(form.getFieldValue().period_id);
    }
  }

  const handleOnPeriodsChange = async (value) => {
    setLoading(true);
    if (curseType === 1) {
      const dataStudent = {
        grupo_periodo_id: intersemestralInfo.grupo,
        carrera_uac_id: intersemestralInfo.carrera_uac_id,
        tipo_recursamiento: "semestral",
        plantel_id: intersemestralInfo.plantel,
        periodo_id: value
      }
      const responseStudentsBygroup = await getStudentsBySchoolGroup(dataStudent);
      if (responseStudentsBygroup.success) {
        dispatch(setStudentsList([]));
        dispatch(setStudentsList(responseStudentsBygroup.data))
      }
    } else if (curseType === 2) {
      const dataStudent = {
        grupo_periodo_id: intersemestralInfo.grupo,
        carrera_uac_id: intersemestralInfo.carrera_uac_id,
        tipo_recursamiento: "intersemestral",
        plantel_id: intersemestralInfo.plantel,
      }
      const responseStudentsBygroup = await getStudentsBySchoolGroup(dataStudent);
      if (responseStudentsBygroup.success) {
        dispatch(setStudentsList([]));
        dispatch(setStudentsList(responseStudentsBygroup.data))
      }
    }
    setLoading(false);
  }

  const columns = [
    {
      ...columnProps,
      title: "Opciones",
      render: (student) => {
        /*TODO: Set margins*/
        return (
          <>
            <Checkbox defaultChecked={(studentsSelected.find(e => e.usuario_id === student.usuario_id))} onChange={() => onChangeCheck(student)} />
          </>
        );
      },
    },
    defaultColumn("Periodo", "periodo"),
    defaultColumn("Matricula", "matricula"),
    defaultColumn("Nombre", "nombre"),
    defaultColumn("Primer Apellido", "primer_apellido"),
    defaultColumn("Segundo Apellido", "segundo_apellido"),
    defaultColumn("Carrera", "carrera"),

  ];

  const columnsIntersemestral = [
    {
      ...columnProps,
      title: "Opciones",
      render: (student) => {
        /*TODO: Set margins*/
        return (
          <>
            <Checkbox defaultChecked={(studentsSelected.find(e => e.usuario_id === student.usuario_id))} onChange={() => onChangeCheck(student)} />
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
  const onChangeCheck = async (student) => {
    const index = selectedStudent.findIndex(
      (e) => e.usuario_id === student.usuario_id
    )
    let arrayStudents = selectedStudent;
    if (selectedStudent.find(e => e.usuario_id === student.usuario_id)) {
      arrayStudents.splice(index, 1);
      setSelectedStudent(arrayStudents);
      dispatch(setStudentsSelected(arrayStudents));
    } else {
      arrayStudents.push(student);
      setSelectedStudent(arrayStudents);
      dispatch(setStudentsSelected(arrayStudents));
    }
  }
  return (
    <>
      <p style={{ marginTop: "2em" }}>
        <strong>Seleccione alumnos que cursarán la asignatura</strong>
      </p>
      <Row {...styles.rowProps}>
        {
          curseType === 1 ?
            <Col  /* {...styles.colProps} */>
              <Form
                form={form}
                layout="vertical"
              >
                <Form.Item label="Buscar alumnos por periodo reprobado:" name="period_id" style={{ marginRight: "30px" }}>
                  <SearchSelect
                    dataset={periods}
                    onChange={handleOnPeriodsChange}
                  />
                </Form.Item>
              </Form>
            </Col>
            : null
        }
        <Col /* {...styles.colProps} */>
          <ButtonCustom
            size="large"
            icon={<UserAddOutlined />}
            color="blue"
            onClick={() => showModal()}
            disabled={!intersemestralInfo.estado && !intersemestralInfo.plantel && !intersemestralInfo.carrera}
            width={"100%"}
          >
            Buscar alumno
          </ButtonCustom>
        </Col>
      </Row>
      <Loading loading={loading}>
        <Table
          rowKey="usuario_id"
          bordered
          pagination={{ position: ["topLeft", "bottomLeft"] }}
          columns={curseType === 1 ? columns : columnsIntersemestral}
          scroll={{ x: columns.length * 200 }}
          dataSource={students}
          size="small"
        />
      </Loading>
      <AddStudentModal schoolIdSelected={intersemestralInfo.plantel} studentsSelectedTable={studentsSelected} setShowModalAdd={setShowModalAdd} showModalAdd={showModalAdd} />
      <p style={{ marginTop: "2em" }}>
        <strong>Registros encontrados: </strong> {students.length}
      </p>
    </>
  );
};