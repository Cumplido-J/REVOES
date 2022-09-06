import React from "react";
import { Form, InputNumber, Input } from "antd";
import { ButtonIcon } from "../../../shared/components";
import { DeleteOutlined } from "@ant-design/icons";
import alerts from "../../../shared/alerts";
import PermissionValidator from "../../../components/PermissionValidator";
import { permissionList } from "../../../shared/constants";

export default ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  edited,
  editedItems,
  disabled,
  deleteGrade,
  setDeleteGradeData,
  ...restProps
}) => {
  const handledChange = (value) => {
    const index = editedItems.findIndex(e => e.dataIndex === dataIndex);
    if (value !== null && value !== undefined) {
      if (index !== -1) {
        const arrayAlt = editedItems.map(e => {
          if (e.dataIndex === dataIndex) {
            return {
              dataIndex: e.dataIndex,
              value
            }
          } else {
            return {
              ...e
            }
          }
        })
        edited(arrayAlt);
      } else {
        edited([...editedItems, { value, dataIndex }]);
      }
    } else {
      if (index !== -1) {
        const arrayAlt = editedItems;
        arrayAlt.splice(index, 1);
        edited(arrayAlt);
      }
    }
  }

  const handleDeleteGrade = () => {
    if (record[`${dataIndex}_id`] !== "-") {
      setDeleteGradeData(record[`${dataIndex}_id`]);
      deleteGrade();
    } else {
      alerts.warning("No hay registros para eliminar");
    }
  }
  return (
    <td {...restProps}>
      {editing && record[`${dataIndex}_id`] !== "-" ? (
        <span style={{ "width": "100%", "display": "flex", textAlign: "center", alignItems: "center", justifyContent: "center" }}>
          <span>
            <Form.Item
              name={dataIndex}
              style={{
                margin: 0,
              }}
            >
              <InputNumber disabled={disabled} onChange={handledChange} step={0.1} min={0} max={10} style={{ textAlign: 'center' }} />
            </Form.Item>
          </span>
          {(dataIndex === "parcial_5" || dataIndex === "parcial_6" || dataIndex === "rs") && (record[`${dataIndex}_id`] !== "-") ? (
            <PermissionValidator permissions={[permissionList.ELIMINAR_CALIFICACIONES_HISTORICAS]}>
              <span style={{ marginLeft: "8px" }}>
                <ButtonIcon
                  tooltip="Eliminar calificación"
                  icon={<DeleteOutlined />}
                  color="red"
                  onClick={handleDeleteGrade}
                  tooltipPlacement="top"
                  style={{ "margin-left": '5px' }}
                />
              </span>
            </PermissionValidator>
          ) : (null)}

        </span>
      ) : (
        children
      )}
    </td>
  );
};
