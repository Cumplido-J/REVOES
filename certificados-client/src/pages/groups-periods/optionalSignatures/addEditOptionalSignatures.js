import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CheckOutlined } from "@ant-design/icons";
import { setPeriodsOptionalSignatures } from "../../../reducers/groups-periods/actions/setPeriodsOptionalSignatures";
import TitleBar from "../../../components/TitleBar";
import Breadcrumb from "../../../components/BreadCrumb";
import OptionalSignaturesTable from "./OptionalSignaturesTable";
import { getGroupPeriodById } from "../../../service/GroupsPeriodService";
import { getUacOptionals } from "../../../service/SignaturesService";
import { PrimaryButton } from "../../../shared/components";
import { setOptionalSignatures } from "../../../service/GroupsPeriodService";
import Alerts from "../../../shared/alerts";
const breadCrumbLinks = [
  {
    text: "Grupos-Periodos",
    path: "/Grupos-Periodos",
  },
  {
    text: "Optativas",
    path: false,
  },
];

export default ({ match }) => {
  const dispatch = useDispatch();
  const { groupPeriodsId } = match.params;
  const [loading, setLoading] = useState(true);
  const [currentGroupPeriod, setCurrentGroupPeriod] = useState(false);
  const availableSignatures = useSelector(
    (store) => store.groupsPeriodsReducer.groupsPeriodsOptionalSignaturesList
  );
  const selectedSignatures = useSelector(
    (store) =>
      store.groupsPeriodsReducer.groupsPeriodsOptionalSignaturesSelected
  );
  useEffect(() => {
    async function setUp() {
      const currentGroupPeriodResponse = await getGroupPeriodById(
        groupPeriodsId
      );
      if (currentGroupPeriodResponse.success) {
        setCurrentGroupPeriod(currentGroupPeriodResponse.data);
        const availableSignatures = await getUacOptionals(
          currentGroupPeriodResponse.data.plantel_carrera.carrera_id
        );
        dispatch(
          setPeriodsOptionalSignatures(
            availableSignatures.data.filter(
              (as) =>
                !currentGroupPeriodResponse.data.optativas.some(
                  (cs) => cs.id === as.id
                )
            ),
            currentGroupPeriodResponse.data.optativas
          )
        );
        setLoading(false);
      } // TODO: Handle fail
    }
    setUp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleOnSave = async () => {
    setLoading(true);
    if (!(selectedSignatures.length > 3)) {
      const apiResponse = await setOptionalSignatures(
        groupPeriodsId,
        selectedSignatures.map((s) => s.id)
      );
      console.log(apiResponse);
      if (apiResponse.success) {
        Alerts.success("Guardado", apiResponse.message);
      }
    } else {
      Alerts.error(
        "Error",
        "No se pueden asignar más de 3 optativas a un grupo por periodo"
      );
    }
    setLoading(false);
  };
  return (
    <>
      <Breadcrumb links={breadCrumbLinks} />
      <TitleBar>
        Optativas del grupo - {currentGroupPeriod.grupo || "..."}
      </TitleBar>
      <OptionalSignaturesTable
        loading={loading}
        signatures={availableSignatures}
      />
      <OptionalSignaturesTable
        loading={loading}
        signatures={selectedSignatures}
        isSelected
      />
      <PrimaryButton
        loading={loading}
        icon={<CheckOutlined />}
        onClick={handleOnSave}
      >
        Guardar
      </PrimaryButton>
    </>
  );
};
