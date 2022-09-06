import React, { useEffect, useState } from "react";
import { Button, Form, Input, InputNumber, Modal, Table } from "antd";
import { FileAddOutlined } from "@ant-design/icons";
import { columnProps, defaultColumn } from "../../shared/columns";
import { ButtonIcon, Loading, SearchSelect } from "../../shared/components";
import CatalogService from "../../service/CatalogService";
import { Semesters } from "../../shared/catalogs";
import { getSignaturesForEnrollmentByCareerSemester } from "../../service/UacService";
import alerts from "../../shared/alerts";

const {
  getPeriodsCatalog,
  getStateCatalogs,
  getAllStateCatalogs,
  getSchoolCatalogs,
  getSchoolCatalogsWithoutPermission,
  getCareerCatalogs,
} = CatalogService;

const validations = {
  required: [
    {
      required: true,
      message: "este campo es requerido",
    },
  ],
};

export default ({ onGradesUacChange }) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [states, setStates] = useState([]);
  const [schools, setSchools] = useState([]);
  const [careers, setCareers] = useState([]);

  const [editModalVisibility, setEditModalVisibility] = useState(false);
  const [currentEditGrade, setCurrentEditGrade] = useState({});
  const [formEdit] = Form.useForm();
  useEffect(() => {
    const setUp = async () => {
      /* SET ALL STATES */
      const statesCatalogs = await getAllStateCatalogs();
      if (statesCatalogs && statesCatalogs.success) {
        setStates(
          statesCatalogs.data.map((state) => ({
            id: state.id,
            description: state.nombre,
          }))
        );
      }
      /* SET PERIODS */
      const periodsCatalog = await getPeriodsCatalog();
      if (periodsCatalog && periodsCatalog.success) {
        setPeriods(
          periodsCatalog.periods.map(({ id, nombre_con_mes }) => ({
            id,
            description: nombre_con_mes,
          }))
        );
      }

      setLoading(false);
    };
    setUp();
  }, []);

  useEffect(() => {
    onGradesUacChange(tableData);
  }, [tableData]);

  const columns = [
    {
      ...columnProps,
      title: "Opciones",
      render: (grade, index) => {
        return (
          <ButtonIcon
            tooltip="Capturar calificaciones"
            icon={<FileAddOutlined />}
            color={grade.final ? "blue" : "volcano"}
            onClick={() => handleSetValuesToGrade(grade)}
            tooltipPlacement="top"
          />
        );
      },
    },
    defaultColumn("Clave UAC", "clave_uac"),
    defaultColumn("Nombre", "nombre"),
    defaultColumn("Semestre", "semestre"),
    defaultColumn("Créditos", "creditos"),
    defaultColumn("Horas", "horas"),
    defaultColumn("Periodo", "periodo_nombre"),
    defaultColumn("Parcial 1", "parcial1"),
    defaultColumn("Parcial 2", "parcial2"),
    defaultColumn("Parcial 3", "parcial3"),
    defaultColumn("Final", "final"),
    defaultColumn("Extraordinario", "extra"),
  ];

  const handleOnStateChange = async (stateId) => {
    setLoading(true);
    const schoolsCatalog = await getSchoolCatalogsWithoutPermission(stateId);
    if (schoolsCatalog && schoolsCatalog.success) {
      form.setFieldsValue({ plantel_id: null, carrera_id: null }); // Evita que el bug del find de searchSelect detenga la ejecución
      setCareers([]);
      setSchools(
        schoolsCatalog.schools.map(({ id, cct, nombre }) => ({
          id,
          description: `${cct} - ${nombre}`,
        }))
      );
    }
    setLoading(false);
  };

  const handleOnSchoolChange = async (schoolId) => {
    setLoading(true);
    const careersCatalog = await getCareerCatalogs(schoolId);
    if (careersCatalog && careersCatalog.success) {
      form.setFieldsValue({ carrera_id: null });
      setCareers(
        careersCatalog.careers.map(({ id, description1, description2 }) => ({
          id,
          description: `${description1} - ${description2}`,
        }))
      );
    }
    setLoading(false);
  };

  // EDIT MODAL
  const handleSetValuesToGrade = (grade) => {
    setCurrentEditGrade(grade);
    formEdit.setFieldsValue({
      parcial1: grade.parcial1,
      parcial2: grade.parcial2,
      parcial3: grade.parcial3,
      final: grade.final,
      extra: grade.extra,
      periodo_id: grade.periodo_id,
    });
    setEditModalVisibility(true);
  };
  const handleEditOk = () => {
    formEdit.submit();
  };
  const handleEditCancel = () => {
    setEditModalVisibility(false);
  };
  const handleOnEditFinish = (formData) => {
    setLoading(true);
    const newCurrentEditGrade = {
      ...currentEditGrade,
      parcial1: formData.parcial1,
      parcial2: formData.parcial2,
      parcial3: formData.parcial3,
      final: formData.final,
      extra: formData.extra,
      periodo_id: formData.periodo_id,
      periodo_nombre: periods.find((p) => p.id === formData.periodo_id)
        .description,
    };
    setTableData(
      tableData.map((td) => {
        if (td.id === newCurrentEditGrade.id) {
          return newCurrentEditGrade;
        }
        return td;
      })
    );
    setEditModalVisibility(false);
    setLoading(false);
  };
  const handleOnEditFinishFailed = () => {
    alerts.warning(
      "Favor de llenar correctamente",
      "Existen campos sin llenar."
    );
  };
  // Search modal
  const handleOpenModal = () => {
    form.resetFields();
    setVisible(true);
  };

  const handleOnOk = () => {
    form.submit();
  };

  const handleOnCancel = () => {
    setVisible(false);
  };

  const handleOnFinish = async ({ semestre, carrera_id, plantel_id }) => {
    setLoading(true);
    const signatures = await getSignaturesForEnrollmentByCareerSemester({
      semestre,
      carrera_id,
    });
    if (signatures && signatures.success) {
      setTableData(
        signatures.materias.map((materia) => ({
          ...materia,
          plantel_id,
          carrera_uac_id: materia.id,
          periodo_nombre: null,
          periodo_id: null,
          parcial1: null,
          parcial2: null,
          parcial3: null,
          final: null,
          extra: null,
        }))
      );
    }
    setVisible(false);
    setLoading(false);
  };

  const handleOnFinishFailed = () => {};

  return (
    <>
      <fieldset>
        <legend>Capturar calificaciones UAC</legend>
        {/*Modal Btn*/}
        <Button
          icon={<FileAddOutlined />}
          color={"blue"}
          onClick={handleOpenModal}
        >
          Capturar calificaciones
        </Button>
        <br />
        <br />
        {/* Table */}
        <Table
          rowKey="id"
          bordered
          pagination={{ position: ["topLeft", "bottomLeft"] }}
          columns={columns}
          scroll={{ x: columns.length * 200 }}
          dataSource={tableData}
          size="small"
        />
      </fieldset>
      {/* Modal de busqueda */}
      <Modal
        visible={visible}
        title="Buscar materias"
        onOk={handleOnOk}
        onCancel={handleOnCancel}
        confirmLoading={loading}
      >
        <Loading loading={loading}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleOnFinish}
            onFinishFailed={handleOnFinishFailed}
          >
            <Form.Item
              label="Estado"
              name="estado_id"
              rules={validations.required}
            >
              <SearchSelect
                dataset={states}
                disabled={!states.length}
                onChange={handleOnStateChange}
              />
            </Form.Item>
            <Form.Item
              label="Plantel"
              name="plantel_id"
              rules={validations.required}
            >
              <SearchSelect
                dataset={schools}
                disabled={!schools.length}
                onChange={handleOnSchoolChange}
              />
            </Form.Item>
            <Form.Item
              label="Carrera"
              name="carrera_id"
              rules={validations.required}
            >
              <SearchSelect dataset={careers} disabled={!careers.length} />
            </Form.Item>
            <Form.Item
              label="Último semestre cursado"
              name="semestre"
              rules={validations.required}
            >
              <SearchSelect dataset={Semesters} />
            </Form.Item>
          </Form>
        </Loading>
      </Modal>
      {/* Modal editar */}
      <Modal
        visible={editModalVisibility}
        title="Capturar datos materia"
        onOk={handleEditOk}
        onCancel={handleEditCancel}
        confirmLoading={loading}
      >
        <Loading loading={loading}>
          <Form
            form={formEdit}
            layout="vertical"
            onFinish={handleOnEditFinish}
            onFinishFailed={handleOnEditFinishFailed}
          >
            {/* 
              parcial1
              parcial2
              parcial3
              final
              extra
            */}
            <Form.Item label="Calificación parcial 1" name="parcial1">
              <InputNumber min={1} max={10} style={{ width: "90%" }} />
            </Form.Item>
            <Form.Item label="Calificación parcial 2" name="parcial2">
              <InputNumber min={1} max={10} style={{ width: "90%" }} />
            </Form.Item>
            <Form.Item label="Calificación parcial 3" name="parcial3">
              <InputNumber min={1} max={10} style={{ width: "90%" }} />
            </Form.Item>
            <Form.Item
              label="Calificación final"
              name="final"
              rules={validations.required}
            >
              <InputNumber min={1} max={10} style={{ width: "90%" }} />
            </Form.Item>
            <Form.Item label="Calificación extraordinaria" name="extra">
              <InputNumber min={1} max={10} style={{ width: "90%" }} />
            </Form.Item>
            <Form.Item
              label="Periodo"
              name="periodo_id"
              rules={validations.required}
            >
              <SearchSelect dataset={periods} />
            </Form.Item>
          </Form>
        </Loading>
      </Modal>
    </>
  );
};
