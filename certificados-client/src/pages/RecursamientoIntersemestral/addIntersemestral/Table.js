import React, { useState, useEffect, useRef } from "react";
import { Input, Form, Table, Checkbox, Row, Col } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Loading, ButtonCustom } from "../../../shared/components";
import { defaultColumn, columnProps } from "../../../shared/columns";
import { setTeacherSelected } from "../../../reducers/intersemestralReducer/actions/setTeacherSelected";
import { SearchOutlined } from "@ant-design/icons";
import { getFilteredTeachers } from "../../../service/TeacherService";
import { setTeachersList } from "../../../reducers/teachers/actions/setTeachers";


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
    style: { justifyContent: "flex-end", alignItems: "center" },
  },
};

export default () => {
  const _isMounted = useRef(true); // Initial value _isMounted = true

  const teacher_id = useSelector((store) => store.intersemestralReducer.teacherSelectId);
  const teachers = useSelector((store) => store.teachersReducer.teachersList);
  const intersemestralInfo = useSelector((store) => store.intersemestralReducer.interInfoData);
  const [selectedTeacher, setSelectedTeacher] = useState();
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(false);
    return () => {
      _isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    setSelectedTeacher(teacher_id)
  }, [teacher_id]);
  
  if (_isMounted.current) {
    // Check always mounted component
    // continue treatment of AJAX response... ;
  }

  const columns = [
    {
      ...columnProps,
      title: "Opciones",
      render: (teacher) => {
        /*TODO: Set margins*/
        return (
          <>
            <Checkbox defaultChecked={(teacher_id == teacher.docente_asignacion_id)} disabled={selectedTeacher && teacher.docente_asignacion_id != selectedTeacher} onChange={() => onChangeCheck(teacher)}/>
          </>
        );
      },
    },
    defaultColumn("Nombre", "nombre"),
    defaultColumn("Primer Apellido", "primer_apellido"),
    defaultColumn("Segundo Apellido", "segundo_apellido"),
    defaultColumn("CURP", "curp"),
    defaultColumn("Cédula", "cedula"),
    defaultColumn("Fecha Ingreso", "fecha_ingreso"),
    defaultColumn("Estatus", "estatus"),
  ];
  const onChangeCheck = async (teacher) => {
    if(!selectedTeacher){
      setSelectedTeacher(teacher.docente_asignacion_id)
      dispatch(setTeacherSelected(teacher.docente_asignacion_id))
    } else if(selectedTeacher === teacher.docente_asignacion_id) {
      setSelectedTeacher();
      dispatch(setTeacherSelected())
    }
  }
  const handleOnSearchTeacher = async () => {
    setSelectedTeacher();
    dispatch(setTeacherSelected())
    const response = await getFilteredTeachers({
      input: form.getFieldsValue().input,
      plantel_id: intersemestralInfo.plantel
    });
    if(response && response.success) {
      dispatch(setTeachersList(response.teachers));
    }
  };
  return (
    <>
      <p style={{ marginTop: "2em" }}>
        <strong>Seleccione un docente que impartirá la asignatura</strong>
      </p>
      <Loading loading={loading}>
      <Row {...styles.rowProps}>
        <Col  /* {...styles.colProps} */>
          <Form
            form={form}
            layout="vertical"
          >
            <Form.Item label="Nombre / CURP empleado:" name="input" style={{ marginRight: "30px" }}>
              <Input placeholder="Nombre / CURP empleado" />
            </Form.Item>
          </Form>
        </Col>
        <Col /* {...styles.colProps} */>
          <ButtonCustom
            size="large"
            icon={<SearchOutlined />}
            color="blue"
            width={"100%"}
            onClick={handleOnSearchTeacher}
          >
            Buscar Docente
          </ButtonCustom>
        </Col>
      </Row>
      <Table
        rowKey="id"
        bordered
        pagination={{ position: ["bottomLeft"] }}
        columns={columns}
        scroll={{ x: columns.length * 200 }}
        dataSource={teachers}
        size="small"
      />
      </Loading>
      <p style={{ marginTop: "2em" }}>
        <strong>Registros encontrados: </strong> {teachers.length}
      </p>
    </>
  );
};
