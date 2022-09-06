import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setTeachersList } from "../../../reducers/teachers/actions/setTeachers";
import { Modal } from "antd";
import { ArrowUpOutlined } from "@ant-design/icons";
import { ButtonIcon } from "../../../shared/components";
import { altaDocente } from "../../../service/TeacherService";
import Alerts from "../../../shared/alerts";

export default ({ docente }) => {
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const docentesLista = useSelector(
    (store) => store.teachersReducer.teachersList
  );
  const handleOnClickDisable = () => {
    setVisible(true);
  };

  const handleOnCancel = async () => {
    setVisible(false);
  };

  const handleOnOk = async () => {
    setLoading(true);
    const apiResponse = await altaDocente(docente.id);
    /* modifciar lista de filtros */
    for (var i in docentesLista) {
      if (docentesLista[i].id === docente.id) {
          /* lo eliminamos */
          docentesLista.splice(i, 1);
          /* insertamos el nuevo valor en su posicion con sus nuevos valores */
          docentesLista.splice(i, 0, apiResponse.teacher);
      }
    }
    dispatch(setTeachersList(docentesLista));
    setVisible(false);
    Alerts.success(
      "Registro actualizado",
      `Se ha activado el docente ${docente.nombre} ${docente.primer_apellido} ${docente.segundo_apellido}`
    );
    setLoading(false);
  };

  return (
    <>
      <ButtonIcon
        tooltip="Activar Docente"
        icon={<ArrowUpOutlined />}
        color="green"
        onClick={handleOnClickDisable}
        tooltipPlacement="top"
      />
      <Modal
        visible={visible}
        title="Dar de baja docente"
        onOk={handleOnOk}
        onCancel={handleOnCancel}
        confirmLoading={loading}
      >
        <p>
          ¿Está seguro de dar de alta al docente {docente.nombre}{" "}
          {docente.primer_apellido} {docente.segundo_apellido}?
        </p>
      </Modal>
    </>
  );
};
