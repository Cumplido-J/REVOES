import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux"
import { setTeachersList } from "../../../reducers/teachers/actions/setTeachers";
import { Modal } from "antd";
import { ArrowDownOutlined } from "@ant-design/icons";
import { ButtonIcon } from "../../../shared/components";
import { bajaDocente } from "../../../service/TeacherService";
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
    const apiResponse = await bajaDocente(docente.id);
    console.log(apiResponse);
    if (apiResponse.success) {
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
       Alerts.warning(
         "Registro actualizado",
         `Se ha desactivado el docente ${docente.nombre} ${docente.primer_apellido} ${docente.segundo_apellido}`
       );
    } else {
      console.log(apiResponse);
    }
    setVisible(false);
    setLoading(false);
  };

  return (
    <>
      <ButtonIcon
        tooltip="Baja Docente"
        icon={<ArrowDownOutlined />}
        color="red"
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
          ¿Está seguro de dar de baja al docente {docente.nombre}{" "}
          {docente.primer_apellido} {docente.segundo_apellido}?
        </p>
      </Modal>
    </>
  );
};
