import { Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PeriodDateConfig from "./PeriodDateConfig";
import Breadcrumb from "../../../components/BreadCrumb";
import { Loading } from "../../../shared/components";
import { getEvaluationsDates } from "../../../service/EvaluationSettingsService";
import TitleBar from "../../../components/TitleBar";
import { permissionList } from "../../../shared/constants";

const breadCrumbLinks = [
  {
    text: "Lista de planteles",
    path: "/Planteles",
  },
  {
    text: "Configuración",
    path: false,
  },
];

export default ({stateId}) => {
  const currentPermissions = useSelector(
    (store) => store.permissionsReducer
  );
  
  const [currentPeriod, setCurrentPeriod] = useState();
  const [configSelected, setConfigSelected] = useState({});
  const [loading, setLoading] = useState(true);

  const setUp = async () => {
    setLoading(true);
    setCurrentPeriod(currentPermissions.period.id);
    /* const evaluationsDataResponse = await getEvaluationsDates(cct);
    if (evaluationsDataResponse && evaluationsDataResponse.success) {
      setEvaluationsData(evaluationsDataResponse.data);
    } */
    setLoading(false);
  };
  const onChangeTab = (value) => {
    setConfigSelected(value);
  }
  useEffect(() => {
    setUp();
  }, []);
  return (
    <>
      <Loading loading={loading}>
      <Tabs defaultActiveKey={1} onChange={onChangeTab} type="card">
          {[permissionList.CONFIG_FECHAS_INICIO_FIN_PERIODO_POR_ESTADO].some(p => currentPermissions.permissions.includes(p)) ? (
            <Tabs.TabPane tab="Configuración Fecha inicio y fin de semestre" key="1">
              <PeriodDateConfig periodName={currentPermissions.period} periodId={currentPeriod} stateId={stateId} />
            </Tabs.TabPane>
          ) : ("")}
        </Tabs>
      </Loading>
    </>
  );
};
