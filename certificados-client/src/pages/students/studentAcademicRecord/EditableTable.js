import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table, Form, Collapse, Modal } from "antd";
import { columnProps } from "../../../shared/columns";
import { ButtonIcon } from "../../../shared/components";
import { CloseOutlined, EditOutlined, SaveOutlined, ExclamationCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import EditableCell from "./EditableCell";
import StudentService from "../../../service/StudentService";
import alerts from "../../../shared/alerts";
import PermissionValidator from "../../../components/PermissionValidator";
import { permissionList } from "../../../shared/constants";

export default ({ dataGrades, idStudent, refreshData }) => {
  const [form] = Form.useForm();
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingKey, setEditingKey] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalDeleteVisible, setIsModalDeleteVisible] = useState(false);
  const [isModalDeleteAssingVisible, setIsModalDeleteAssingVisible] = useState(false);
  const [editedItem, setEditedItem] = useState([]);
  const [deleteGradeData, setDeleteGradeData] = useState(0);
  const [deleteAssingData, setDeleteAssingData] = useState(0);
  const academicRecord = useSelector((store) => store.academicRecordReducer.academicRecordList);
  const primaryColor = "#9d2449";

  const { Panel } = Collapse;

  const isEditing = (record) => record.key === editingKey;

  const columns = [
    {
      title: 'Opciones',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span style={{ "width": "100%", "display": "block", textAlign: "center" }}>
            <span style={{ marginRight: "8px" }}>
              <ButtonIcon
                tooltip="Guardar"
                icon={<SaveOutlined />}
                color="blue"
                onClick={() => save(record)}
                tooltipPlacement="top"
                loading={loading}
              />
            </span>
            <span>
              <ButtonIcon
                tooltip="Cancelar"
                icon={<CloseOutlined />}
                color="blue"
                onClick={cancel}
                tooltipPlacement="top"
                loading={loading}
              />
            </span>
          </span>
        ) : (
          <PermissionValidator permissions={[permissionList.AGREGAR_CALIFICACIONES_HISTORICAS]}>
            <span style={{ "width": "100%", "display": "block", textAlign: "center" }}>
              <ButtonIcon
                tooltip="Editar"
                icon={<EditOutlined />}
                color="blue"
                disabled={editingKey !== ''}
                onClick={() => edit(record)}
                tooltipPlacement="top"
                loading={loading}
              />
              <ButtonIcon
                tooltip="Eliminar"
                icon={<DeleteOutlined />}
                color="blue"
                onClick={() => handleDetele(record)}
                tooltipPlacement="top"
                loading={loading}
                style={{ "margin-left": '5px' }}
              />
            </span>
          </PermissionValidator>
        );
      },
    },
    {
      ...columnProps,
      title: "Asignatura",
      render: (data) => {
        const uac = `${data[0].carrera_uac.uac.clave_uac} - ${data[0].carrera_uac.uac.nombre}`;
        return (
          <>
            {uac}
          </>
        );
      },
    },
    {
      ...columnProps,
      title: "Parcial 1",
      dataIndex: "parcial_1",
      editable: true,
    },
    {
      ...columnProps,
      title: "Parcial 2",
      dataIndex: "parcial_2",
      editable: true,
    },
    {
      ...columnProps,
      title: "Parcial 3",
      dataIndex: "parcial_3",
      editable: true,
    },
    {
      ...columnProps,
      title: "Calificación final",
      dataIndex: "parcial_4",
      editable: true,
    },
    {
      ...columnProps,
      title: "Extraordinario",
      dataIndex: "parcial_5",
      editable: true,
    },
    {
      ...columnProps,
      title: "Curso intersemestral",
      dataIndex: "parcial_6",
      editable: true,
    },
    {
      ...columnProps,
      title: "Recursamiento semestral",
      dataIndex: "rs",
      editable: true,
    },
  ]
  const setUp = async () => {
    setLoading(true);
    setLoading(false);
  };

  useEffect(() => {
    setUp();
  }, [dataGrades]);

  const edit = (record) => {
    setEditedItem([]);
    form.setFieldsValue({
      parcial_1: record.parcial_1 !== null && record.parcial_1 !== "-" ? record.parcial_1 : '',
      parcial_2: record.parcial_2 !== null && record.parcial_2 !== "-" ? record.parcial_2 : '',
      parcial_3: record.parcial_3 !== null && record.parcial_3 !== "-" ? record.parcial_3 : '',
      parcial_4: record.parcial_4 !== null && record.parcial_4 !== "-" ? record.parcial_4 : '',
      parcial_5: record.parcial_5 !== null && record.parcial_5 !== "-" ? record.parcial_5 : '',
      parcial_6: record.parcial_6 !== null && record.parcial_6 !== "-" ? record.parcial_6 : '',
      rs: record.rs !== null && record.rs !== "-" ? record.rs : '',
    });
    setEditingKey(record.key);
  };

  const handleOk = async () => {
    setLoading(true);
    const studentGradesResponse = await StudentService.editAcademicRecordFromStudent(idStudent, {
      calificaciones: grades
    });
    if (studentGradesResponse && studentGradesResponse.success) {
      alerts.success(studentGradesResponse.data.message);
      refreshData();
      setEditingKey('');
    }
    setIsModalVisible(false);
    /* setEditedItem([]); */
    setLoading(false);
  }

  const handleCancelModal = () => {
    setIsModalVisible(false);
  }
  const handleCancelModalDelete = () => {
    setIsModalDeleteVisible(false);
  }
  const handleCancelModalDeleteAssign = () => {
    setIsModalDeleteAssingVisible(false);
  }

  const cancel = () => {
    setEditingKey('');
    setEditedItem([]);
  };

  const save = async (record) => {
    setLoading(true);
    const data = editedItem.map((e) => {
      if (record[`${e.dataIndex}_id`] && record[`${e.dataIndex}_id`] !== "-") {
        return {
          calificacion: e.value,
          calificacion_id: record[`${e.dataIndex}_id`]
        }
      } else if (e.dataIndex === "parcial_1" && record.parcial_1 !== e.value || e.dataIndex === "parcial_2" && record.parcial_2 !== e.value || e.dataIndex === "parcial_3" && record.parcial_3 !== e.value) {
        return {
          tipo_calificacion: "N",
          calificacion: e.value,
          carrera_uac_id: record.key,
          parcial: e.dataIndex.split("_")[1]
        }
      } else if (e.dataIndex === "parcial_5" && record.parcial_5 !== e.value && e.value !== "") {
        return {
          tipo_calificacion: "EXT",
          calificacion: e.value,
          carrera_uac_id: record.key,
        }
      } else if (e.dataIndex === "parcial_6" && record.parcial_6 !== e.value && e.value !== "") {
        return {
          tipo_calificacion: "CI",
          calificacion: e.value,
          carrera_uac_id: record.key,
        }
      } else if (e.dataIndex === "rs" && record.rs !== e.value && e.value !== "") {
        return {
          tipo_calificacion: "RS",
          calificacion: e.value,
          carrera_uac_id: record.key,
        }
      }
    });
    if (data.length >= 1) {
      setGrades(data);
      setIsModalVisible(true);
    }
    setLoading(false);
  };

  const deleteGrade = async () => {
    setIsModalDeleteVisible(true);
  }

  const handleOkDetele = async () => {
    setLoading(true);
    const data = {
      calificacion_id: deleteGradeData,
    }
    const response = await StudentService.deleteGradeFromAcademicRecordById(idStudent, data);
    if (response && response.success) {
      alerts.success(response.data.data);
      refreshData();
      setEditingKey('');
    }
    setIsModalDeleteVisible(false);
    setLoading(false);
  }

  const handleDetele = async (values) => {
    setDeleteAssingData(values.key)
    setIsModalDeleteAssingVisible(true);
  }

  const handleOkDeteleAssign = async () => {
    setLoading(true);
    const data = { alumno_id: idStudent, carrera_uac_id: deleteAssingData };
    const response = await StudentService.deleteGradeFromAcademicRecord(data);
    if(response && response.success) {
      alerts.success(response.data.data);
      refreshData();
      setIsModalDeleteAssingVisible(false);
    }
    setLoading(false);
  }

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
        edited: setEditedItem,
        editedItems: editedItem,
        disabled: record.parcial_5 === "-" && record.parcial_6 === "-" && record.rs === "-" ? false : (col.dataIndex === "parcial_1" || col.dataIndex === "parcial_2" || col.dataIndex === "parcial_3" ? true : false),
        setDeleteGradeData: setDeleteGradeData,
        deleteGrade: deleteGrade
      }),
    };
  });

  return (
    <Collapse defaultActiveKey={['1']}>
      {academicRecord.map((p, value) => {
        return (
          <Panel header={"Semestre " + value} key={value}>
            {
              <Form form={form} component={false}>
                <Table
                  components={{
                    body: {
                      cell: EditableCell,
                    },
                  }}
                  bordered
                  columns={mergedColumns}
                  rowClassName="editable-row"
                  scroll={{ x: columns.length * 200 }}
                  size="small"
                  dataSource={Object.values(p)}
                  loading={loading}
                  pagination={false}
                >
                </Table>
                <Modal title="Confimación" visible={isModalVisible} confirmLoading={loading} onOk={handleOk} onCancel={handleCancelModal} okText='Aceptar' cancelText='Cancelar' okButtonProps={{ style: { backgroundColor: primaryColor, borderColor: primaryColor, } }}>
                  <ExclamationCircleOutlined /> <span>¿Está seguro de guardar los cambios realizados?</span>
                </Modal>
                <Modal title="Confimación de eliminación calificación" visible={isModalDeleteVisible} confirmLoading={loading} onOk={handleOkDetele} onCancel={handleCancelModalDelete} okText='Aceptar' cancelText='Cancelar' okButtonProps={{ style: { backgroundColor: primaryColor, borderColor: primaryColor, } }}>
                  <ExclamationCircleOutlined /> <span>¿Está seguro de eliminar la calificación seleccionada?</span>
                </Modal>
                <Modal title="Confimación de eliminación asignatura" visible={isModalDeleteAssingVisible} confirmLoading={loading} onOk={handleOkDeteleAssign} onCancel={handleCancelModalDeleteAssign} okText='Aceptar' cancelText='Cancelar' okButtonProps={{ style: { backgroundColor: primaryColor, borderColor: primaryColor, } }}>
                  <ExclamationCircleOutlined /> <span>¿Está seguro de eliminar la asignatura seleccionada?</span>
                </Modal>
              </Form>
            }
          </Panel>
        )
      })}
    </Collapse>
  );
};
