import { Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Form from "./Form";
import Recursamiento from "./Recursamiento";
import Recuperacion from "./Recuperacion";
import AcademicRecordSettings from "./AcademicRecordSettings";
import ApplicantsSettings from "./ApplicantsSettings";
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

export default ({ match }) => {
  const currentPermissions = useSelector(
    (store) => store.permissionsReducer.permissions
  );
  const { cct } = match.params;
  const [evaluationsData, setEvaluationsData] = useState({});
  const [loading, setLoading] = useState(true);

  const setUp = async () => {
    setLoading(true);
    const evaluationsDataResponse = await getEvaluationsDates(cct);
    if (evaluationsDataResponse && evaluationsDataResponse.success) {
      setEvaluationsData(evaluationsDataResponse.data);
    }
    setLoading(false);
  };
  useEffect(() => {
    setUp();
  }, []);
  return (
    <>
      <Breadcrumb links={breadCrumbLinks} />
      <TitleBar>Configuración</TitleBar>
      <Loading loading={loading}>
        <Tabs defaultActiveKey={1} type="card">
          <Tabs.TabPane tab="Evaluaciones parciales" key="1">
            <Form evaluationsData={evaluationsData} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Recursamiento" key="2">
            <Recursamiento evaluationsData={evaluationsData} onSave={setUp} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Corrección parcial" key="3">
            <Recuperacion evaluationsData={evaluationsData} />
          </Tabs.TabPane>
          {[permissionList.VER_CALIFICACIONES_HISTORICAS].some(p => currentPermissions.includes(p)) ? (
            <Tabs.TabPane tab="Correción históricos" key="4">
              <AcademicRecordSettings cct={evaluationsData.cct} />
            </Tabs.TabPane>
          ) : ("")}
          {[permissionList.CONFIG_FECHAS_PARA_ASPIRANTES].some(p => currentPermissions.includes(p)) ? (
            <Tabs.TabPane tab="Configuración Aspirantes" key="5">
              <ApplicantsSettings cct={evaluationsData} />
            </Tabs.TabPane>
          ) : ("")}
        </Tabs>
      </Loading>
    </>
  );
};
