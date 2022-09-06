import React, { useEffect, useState } from "react";
import { Button, Form, Input, InputNumber, Modal, Table } from "antd";
import {
  FileAddOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { columnProps, defaultColumn } from "../../shared/columns";
import { ButtonIcon, Loading, SearchSelect } from "../../shared/components";
import CatalogService from "../../service/CatalogService";
import StudentService from "../../service/StudentService";

const { getPeriodsCatalog } = CatalogService;

const validations = {
  required: [
    {
      required: true,
      message: "Este campo es requerido",
    },
  ],
};

export default ({ onGradesChange, studentId = null, disabled = false }) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentGrade, setCurrentGrade] = useState({});

  useEffect(() => {
    const setUp = async () => {
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
    onGradesChange(tableData);
  }, [tableData]);

  useEffect(() => {
    if (studentId) getGrades();
  }, [studentId]);

  const getGrades = async () => {
    setLoading(true);
    const gradesResponse =
      await StudentService.getRevalidationGradesFromStudent(studentId);
    if (gradesResponse && gradesResponse?.success) {
      setTableData(
        gradesResponse.data.map((grade) => ({
          ...grade,
          periodo_name: grade?.periodo?.nombre_con_mes,
        }))
      );
    }
    setLoading(false);
  };

  const columns = [
    defaultColumn("CCT", "cct"),
    defaultColumn("Tipo de asignatura", "tipo_asignatura"),
    defaultColumn("Calificación", "calificacion"),
    defaultColumn("Creditos", "creditos"),
    defaultColumn("Horas", "horas"),
    defaultColumn("Periodo", "periodo_name"),
    {
      ...columnProps,
      title: "Opciones",
      render: (grade) => {
        return (
          <>
            <ButtonIcon
              tooltip="Editar"
              icon={<EditOutlined />}
              color="blue"
              tooltipPlacement="top"
              onClick={() => handleEditGrade(grade)}
              loading={disabled || loading}
            />

            <ButtonIcon
              tooltip="Eliminar"
              icon={<DeleteOutlined />}
              color="red"
              onClick={() => handleEditFromTable(grade.id)}
              tooltipPlacement="top"
              loading={disabled || loading}
            />
          </>
        );
      },
    },
  ];

  const handleEditFromTable = (id) => {
    setTableData(tableData.filter((grade) => grade.id !== id));
  };

  const handleAddGrade = () => {
    form.resetFields();
    setIsEditing(false);
    setVisible(true);
  };

  const handleEditGrade = (grade) => {
    setCurrentGrade(grade);
    setIsEditing(true);
    form.setFieldsValue({
      tipo_asignatura: grade.tipo_asignatura,
      calificacion: grade.calificacion,
      creditos: grade.creditos,
      periodo_id: grade.periodo_id,
      horas: grade.horas,
      cct: grade.cct,
    });
    setVisible(true);
  };

  const handleOnOk = () => {
    form.submit();
  };

  const handleOnCancel = () => {
    setVisible(false);
  };

  const handleOnFinish = (formData) => {
    formData = {
      ...formData,
      periodo_name: periods.find((period) => period.id === formData.periodo_id)
        .description,
    };
    if (isEditing) {
      handleSaveEdit(formData);
    } else {
      handleSaveCreate(formData);
    }
    setVisible(false);
  };

  const handleSaveEdit = (formData) => {
    setTableData(
      tableData.map((grade) =>
        grade.id === currentGrade.id
          ? {
              ...grade,
              ...formData,
            }
          : grade
      )
    );
  };

  const handleSaveCreate = (formData) => {
    formData.id = "custom" + Date.now();
    setTableData([...tableData, formData]);
  };

  const handleOnFinishFailed = () => {};

  return (
    <>
      <fieldset>
        <legend>Capturar calificaciones</legend>
        {/*Modal Btn*/}
        <Button
          icon={<FileAddOutlined />}
          color={"blue"}
          onClick={handleAddGrade}
          disabled={disabled}
          loading={loading}
        >
          Capturar calificación
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
          loading={loading || disabled}
        />
      </fieldset>
      {/* Modal */}
      <Modal
        visible={visible}
        title={`${isEditing ? "Editar" : "Capturar"} calificación`}
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
            <Form.Item label="CCT" name="cct" rules={validations.required}>
              <Input style={{ width: "90%" }} />
            </Form.Item>
            <Form.Item
              label="Tipo de la asignatura"
              name="tipo_asignatura"
              rules={validations.required}
            >
              <Input style={{ width: "90%" }} />
            </Form.Item>
            <Form.Item
              label="Calificación"
              name="calificacion"
              rules={validations.required}
            >
              <InputNumber style={{ width: "90%" }} max={10} min={1} />
            </Form.Item>
            <Form.Item
              label="Créditos"
              name="creditos"
              rules={validations.required}
            >
              <Input style={{ width: "90%" }} />
            </Form.Item>
            <Form.Item label="Horas" name="horas" rules={validations.required}>
              <Input style={{ width: "90%" }} />
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
