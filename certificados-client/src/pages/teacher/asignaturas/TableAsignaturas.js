import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { defaultColumn, columnProps } from "../../../shared/columns";
import {
  UserAddOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import CatalogService from "../../../service/CatalogService";
import { Loading, SearchSelect, ButtonIcon, ButtonIconLink } from "../../../shared/components";
import { Form, Row, Col, Table, Modal, Button} from "antd";
import { getGroupsPeriod } from "../../../service/GroupsPeriodService";
import {
  addAsignaturaAsignacion,
  editAsignaturaAsignacion,
  getAsignacionById,
  getTeacherDetails,
  deleteAsignaturaAsignacion,
} from "../../../service/TeacherService";
import { setAsignacionesList } from "../../../reducers/asignacion/actions/setAsignacionesList";
import { setAsignaturasDocenteList } from "../../../reducers/asignaturasDocente/actions/setAsignaturasDocenteList";
import Alerts from "../../../shared/alerts";
import PermissionValidator from "../../../components/PermissionValidator";
import { permissionList } from "../../../shared/constants";
import PrintStudentGradesList from "../../../components/PrintStudentGradesList";

const { getUacByFilter } = CatalogService;

export default () => {
  const currentPeriod = useSelector(
    (store) => store.permissionsReducer.period
  );
  const perrmisionsUser = useSelector(
    (store) => store.permissionsReducer.permissions
  );
  const asignacion = useSelector((store) => store.asignacionReducer.asignacion);
  const asignaturas = useSelector(
    (store) => store.asignaturasDocenteReducer.asignaturasDocenteList
  );
  const careers = useSelector((store) => store.asignacionReducer.careersList);
  const [form] = Form.useForm();
  const [formDelete] = Form.useForm();

  const [visibleAddAsignatura, setVisibleAddAsignatura] = useState(false);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  /* asignatura */
  const [asignaturaEdit, setAsignaturaEdit] = useState([]);
  const [groups, setGroups] = useState([]);
  const [uac, setUac] = useState([]);
  const [visibleSemester, setVisibleSemester] = useState(true);
  /* asignatura id's */
  const [careersId, setCareersId] = useState(null);
  const [visibleDelete, setVisibleDelete] = useState(null);
  const [asignaturaId, setAsignaturaId] = useState(null);
  const [semestreId, setSemestreId] = useState(null);

  const semesters = [
    { id: 1, description: "1" },
    { id: 2, description: "2" },
    { id: 3, description: "3" },
    { id: 4, description: "4" },
    { id: 5, description: "5" },
    { id: 6, description: "6" },
  ];

  const columnsAsignaturas = [
    {
      ...columnProps,
      title: "Opciones",
      render: (data) => {
        return (
          <>
          
           <PermissionValidator
              permissions={[permissionList.VER_DETALLES_DE_ASIGNATURA]}
            >
              {(currentPeriod.id === data.periodo && asignacion.estatus_asignacion !== "Terminado" ) && (
                <ButtonIconLink
                  tooltip="Ver Más"
                  icon={<EyeOutlined />}
                  color="green"
                  tooltipPlacement="top"
                  link={`/Docentes/Asignatura/${data.id}`}
                />
              )}
            </PermissionValidator>
            <PermissionValidator
              permissions={[permissionList.EDITAR_ASIGNATURA_DE_DOCENTE]}
            >
              {(currentPeriod.id === data.periodo && asignacion.estatus_asignacion !== "Terminado" || perrmisionsUser.includes('Nacional') || perrmisionsUser.includes('Estatal')) && (
                <ButtonIcon
                  tooltip="Modificar"
                  icon={<EditOutlined />}
                  color="geekblue"
                  onClick={() => handleOnEdit(data)}
                  tooltipPlacement="top"
                />
              )}
            </PermissionValidator>
            <PermissionValidator
              permissions={[permissionList.ELIMINAR_ASIGNATURA_DE_DOCENTE]}
            >
              {(currentPeriod.id === data.periodo && asignacion.estatus_asignacion !== "Terminado" || perrmisionsUser.includes('Nacional') || perrmisionsUser.includes('Estatal')) && (
                <ButtonIcon
                  tooltip="Eliminar"
                  icon={<DeleteOutlined />}
                  color="red"
                  onClick={() => handleOnDelete(data)}
                  tooltipPlacement="top"
                />
              )}
            </PermissionValidator>
            <PrintStudentGradesList
              groupPeriodId={data.grupo_periodo_id}
              teacherAssigmentId={data.plantilla_docente_id}
              plantelId={data.plantel_id}
              CareerUacId={data.carrera_uac_id}
            />
          </>
        );
      },
    },
    defaultColumn("Periodo", "periodo_description"),
    defaultColumn("Semestre", "semestre"),
    defaultColumn("Grupo", "grupo"),
    defaultColumn("Asignatura", "uac_description"),
    defaultColumn("Carrera", "carrera_description"),
    defaultColumn("Horas", "horas")
  ];

  const validations = {
    /* asignatura add */
    carrera_id: [{ required: true, message: "¡La carrera es requerido!" }],
    semestre_id: [{ required: true, message: "¡El semestre es requerido!" }],
    carrera_uac_id: [{ required: true, message: "¡La UAC es requerida!" }],
    grupo_periodo_id: [{ required: true, message: "¡El grupo es requerido!" }],
  };

  const styles = {
    colProps: {
      xs: { span: 24 },
      md: { span: 12 },
    },
    rowProps: {
      style: { marginBottom: "1em" },
    },
  };

  const handleOnDelete = (values) => {
    setVisibleDelete(true);
    setAsignaturaId(values.id);
  };

  const deleteData = async () => {
    setLoading(true);
    const response = await deleteAsignaturaAsignacion(asignaturaId);
    if (response.success) {
      getData();
      Alerts.success(response.message, "");
      setVisibleDelete(false);
    }
    setLoading(false);
  };

  const handleOnEdit = async (values) => {
    setAsignaturaEdit(true); /* true => editar, false = agregar , modal*/
    setVisibleAddAsignatura(true); /* modal */
    setAsignaturaId(values.id); /* asignatura a editar */
    setVisibleSemester(false); /* habilitar select semestre */
    getGroups(
      values.semestre,
      values.carrera_id,
      values
    ); /* activar selects por busqueda de filtros */
  };

  const getGroups = async (semestre, carrera_id = null, values_edit = null) => {
    setLoading(true);
    /* limpiar  campos*/
    setGroups([]);
    setUac([]);
    form.setFieldsValue({ carrera_uac_id: null, grupo_periodo_id: null });
    /* filtros */
    let data = {
      carrera_id: carrera_id ? carrera_id : careersId,
      plantel_id: asignacion.plantelId,
      semestre: semestre,
    };
    const groupsItems = await getGroupsPeriod(data);
    /* check is exist groups */
    if (groupsItems.groups.length !== 0) {
      let groups = [];
      groupsItems.groups.forEach((e) => {
        groups.push({
          id: e.id,
          description: e.grupo,
        });
      });
      setGroups(groups);
      if (values_edit) {
        /* modal get edit data */
        getUac(
          semestre,
          semestre === 6 ? values_edit.grupo_periodo_id : null,
          carrera_id,
          values_edit
        ); /* get uac's */
      } else {
        setLoading(false);
      }
    } else {
      /* no resultados */
      Alerts.warning(
        "No se encontraron resultados",
        "No hay grupos disponibles."
      );
      setLoading(false);
    }
  };

  const getUac = async (
    semestre,
    grupo_periodo_id = null,
    carrera_id = null,
    values_edit = null
  ) => {
    setLoading(true);
    let filters;
    filters = {
      carrera_id: carrera_id ? carrera_id : careersId,
      semestre: semestre,
      grupo_periodo_id: grupo_periodo_id ? grupo_periodo_id : null,
    };
    const uacCat = await getUacByFilter(filters);
    let uac = [];
    uacCat.type.forEach((e) => {
      uac.push({
        id: e.id,
        description: e.uac.clave_uac + " " + e.uac.nombre,
      });
    });
    setUac(uac); /* llenado de uac's */
    /* si es modifiación llenar los campos */
    if (values_edit) {
      form.setFieldsValue({
        carrera_id: values_edit.carrera_id,
        semestre_id: values_edit.semestre,
        grupo_periodo_id: values_edit.grupo_periodo_id,
        carrera_uac_id: values_edit.carrera_uac_id,
      });
    }
    setLoading(false);
  };

  const handleOnSemestreChange = (semestre) => {
    /* filters groups */
    setSemestreId(semestre);
    getGroups(semestre);
  };

  const handleOnCareersChange = (values) => {
    setLoading(true);
    setCareersId(values);
    setVisibleSemester(false);
    setLoading(false);
  };

  const handleOnGropuChange = (grupo_periodo_id) => {
    form.setFieldsValue({
      carrera_uac_id: null,
    });
    if (!grupo_periodo_id) {
      setUac([]); /* limpiar uac's para nueva busqueda */
    } else {
      /*  setUacDisabled(true); */
      if (semestreId !== 6) {
        getUac(semestreId, grupo_periodo_id); /* semestre sin optativas */
      } else {
        getUac(semestreId, grupo_periodo_id); /* semestre con optativas */
      }
    }
  };

  const handleOnClickNewAsignatura = () => {
    setVisibleAddAsignatura(true);
    setAsignaturaEdit(false);
  };

  const handleOnCancelAsignatura = () => {
    handleFormateForm();
    setVisibleAddAsignatura(false);
    setVisibleDelete(false);
    setVisibleSemester(true);
    /* clean select */
    setGroups([]);
    setUac([]);
  };

  const handleFinishEdit = async (values) => {
    setLoading(true);
    let data = {
      plantilla_docente_id: asignacion.id,
      grupo_periodo_id: values.grupo_periodo_id,
      plantel_id: asignacion.plantelId,
      carrera_uac_id: values.carrera_uac_id,
    };
    const editAsignatura = await editAsignaturaAsignacion(data, asignaturaId);
    if (editAsignatura.success) {
      getData();
      Alerts.success("Éxito", editAsignatura.message);
      handleOnCancelAsignatura(); /* close modal anda reset form */
    }
    setLoading(false);
  };

  const handleFinish = (values) => {
    if (asignaturaEdit) {
      handleFinishEdit(values);
    } else {
      handleFinishAdd(values);
    }
  };

  const getData = async () => {
    /* get informacion para rellenar despues de una accion */
    const teacherDetailsApi = await getTeacherDetails(asignacion.docente_id);
    const teacherDetails = teacherDetailsApi.teacher;
    const asignacionDetailsApi = await getAsignacionById(asignacion.id);
    const asignacionDetails = asignacionDetailsApi.teacher;
    /* asignaturas lista */
    dispatch(setAsignaturasDocenteList(asignacionDetails.docente_asignatura));
    /* docente_asginaciones list */
    teacherDetails["periodo_actual"] = currentPeriod; //periodo
    dispatch(setAsignacionesList(teacherDetails));
  };

  const handleFinishAdd = async (values) => {
    setLoading(true);
    let data = {
      plantilla_docente_id: asignacion.id,
      carrera_uac_id: values.carrera_uac_id,
      grupo_periodo_id: values.grupo_periodo_id,
      plantel_id: asignacion.plantelId,
    };
    const addAsignatura = await addAsignaturaAsignacion(data);
    if (addAsignatura.success) {
      getData();
      Alerts.success("Éxito", addAsignatura.message);
      /* close modal anda reset form */
      handleOnCancelAsignatura();
    }
    setLoading(false);
  };

  const handleFinishFailed = () => {
    Alerts.warning(
      "Favor de llenar correctamente",
      "Existen campos sin llenar."
    );
  };

  const handleFormateForm = () => {
    form.resetFields();
  };

  return (
    <>
      <fieldset>
        <PermissionValidator
          permissions={[permissionList.CREAR_ASIGNATURA_DE_DOCENTE]}
        >
          {asignacion.estatus_asignacion !== "Terminado" && (
            <Button
              icon={<UserAddOutlined />}
              color={"blue"}
              onClick={handleOnClickNewAsignatura}
            >
              Nueva Asignatura
            </Button>
          )}
        </PermissionValidator>
        <PermissionValidator
          permissions={[permissionList.VER_ASIGNATURAS_DE_DOCENTE]}
        >
          <Table
            rowKey="id"
            bordered
            pagination={{ position: ["topLeft", "bottomLeft"] }}
            columns={columnsAsignaturas}
            scroll={{ x: columnsAsignaturas.length * 200 }}
            dataSource={asignaturas}
            size="small"
          />
        </PermissionValidator>
      </fieldset>

      {/* modal new asignatura */}
      <Modal
        visible={visibleAddAsignatura}
        title={asignaturaEdit ? "Modificar Asignatura" : "Nueva Asignatura"}
        onOk={form.submit}
        width={950}
        onCancel={handleOnCancelAsignatura}
        confirmLoading={loading}
      >
        <Loading loading={loading}>
          <Form
            form={form}
            onFinish={handleFinish}
            onFinishFailed={handleFinishFailed}
            layout="vertical"
          >
            <Row {...styles.rowProps}>
              <Col {...styles.colProps}>
                <Form.Item
                  label="Carrera:"
                  name="carrera_id"
                  rules={validations.carrera_id}
                >
                  <SearchSelect
                    dataset={careers}
                    onChange={handleOnCareersChange}
                  />
                </Form.Item>
              </Col>
              <Col {...styles.colProps}>
                <Form.Item
                  label="Semestre:"
                  name="semestre_id"
                  rules={validations.semestre_id}
                >
                  <SearchSelect
                    dataset={semesters}
                    disabled={visibleSemester}
                    onChange={handleOnSemestreChange}
                  />
                </Form.Item>
              </Col>

              <Col {...styles.colProps}>
                <Form.Item
                  label="Grupo:"
                  name="grupo_periodo_id"
                  rules={validations.grupo_periodo_id}
                >
                  <SearchSelect
                    dataset={groups}
                    disabled={!groups.length}
                    onChange={handleOnGropuChange}
                  />
                </Form.Item>
              </Col>
              <Col {...styles.colProps}>
                <Form.Item
                  label="UAC:"
                  name="carrera_uac_id"
                  rules={validations.carrera_uac_id}
                >
                  <SearchSelect dataset={uac} disabled={!uac.length} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Loading>
      </Modal>
      {/* modal delete asginacion  */}
      <Modal
        visible={visibleDelete}
        title="Eliminar Asignatura"
        onOk={formDelete.submit}
        onCancel={handleOnCancelAsignatura}
        confirmLoading={loading}
      >
        <p>¿Está seguro de realizar esta acción?</p>
        <Loading loading={loading}>
          <Form
            form={formDelete}
            onFinish={deleteData}
            onFinishFailed={handleFinishFailed}
            layout="vertical"
          ></Form>
        </Loading>
      </Modal>
    </>
  );
};
