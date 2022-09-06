import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux"
import { setIntersemestralList } from "../../../reducers/intersemestralReducer/actions/setIntersemestralList"; 
import { DeleteOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { ButtonIcon } from "../../../shared/components";
import { deleteAssignInterSemester, deleteAssignSemestral } from "../../../service/IntersemestralService";
import { deleteExtraExam } from "../../../service/ExtraordinaryExamService";
import Alerts from "../../../shared/alerts";

export default ({ intersemestral, tipoRecursamiento }) => {
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const intersemestralList = useSelector((store) => store.intersemestralReducer.intersemestralList);

  const handleOnClickDisable = () => {
    setVisible(true);
  };

  const handleOnCancel = async () => {
    setVisible(false);
  };

  const handleOnOk = async () => {
    setLoading(true);
    let arrayIntersemestralList = intersemestralList;
    var responseDelete = {};
    if(tipoRecursamiento === 1) {
      responseDelete = await deleteAssignSemestral(intersemestral);
    } else if ( tipoRecursamiento === 2 ) {
      responseDelete = await deleteAssignInterSemester(intersemestral);
    } else if ( tipoRecursamiento === 3) {
      responseDelete = await deleteExtraExam(intersemestral);
    }
    if(responseDelete.success) {
      for (var i in intersemestralList) {
        if (intersemestralList[i].id === responseDelete.data.id) {
          arrayIntersemestralList.splice(i, 1);
        }
      }
      dispatch(setIntersemestralList(arrayIntersemestralList));
      Alerts.success(
        "Registro eliminado",
        `Se ha eliminado el grupo de recursamiento`
      );
    } else {
    }
    setVisible(false);
    setLoading(false);
  };

  return (
    <>
      <ButtonIcon
        tooltip="Eliminar"
        icon={<DeleteOutlined />}
        color="red"
        style={{ margin: 5 }}
        onClick={handleOnClickDisable}
      />
      <Modal
        visible={visible}
        title="Eliminar grupo de recursamiento"
        onOk={handleOnOk}
        onCancel={handleOnCancel}
        confirmLoading={loading}
      >
        <p>
          ¿Está seguro de eliminar el grupo de recursamiento?
        </p>
      </Modal>
    </>
  );
};
