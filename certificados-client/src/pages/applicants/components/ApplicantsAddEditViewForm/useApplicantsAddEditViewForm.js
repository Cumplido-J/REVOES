import { useEffect, useMemo, useRef, useState } from "react";
import { Form } from "antd";
import Alerts from "../../../../shared/alerts";
import moment from "moment";
import {
  createApplicants,
  editApplicant,
  getApplicantById,
} from "../../../../service/ApplicantsService";
import { useHistory } from "react-router-dom";

const useApplicantsAddEditViewForm = (applicantId = null) => {
  const history = useHistory();
  const [stateSchoolInputs, setStateSchoolInputs] = useState({
    loading: false,
  });
  const [loadingSave, setLoadingSave] = useState(false);
  const [form] = Form.useForm();
  const loading = useMemo(
    () => loadingSave || stateSchoolInputs?.loading,
    [loadingSave, stateSchoolInputs]
  );
  const stateSchoolInputsRef = useRef(null);
  const loadEditData = async () => {
    setLoadingSave(true);
    const currentApplicantResponse = await getApplicantById({
      id: applicantId,
    });
    if (currentApplicantResponse?.success) {
      const responseData = currentApplicantResponse?.data;
      form.setFieldsValue({
        stateId: responseData.plantel?.municipio?.estado_id,
      });
      await stateSchoolInputsRef.current.handleOnStateChange(
        responseData.plantel?.municipio?.estado_id
      );
      form.setFieldsValue({
        schoolId: responseData?.plantel?.id,
      });
      await stateSchoolInputsRef.current.handleOnSchoolChange(
        responseData?.plantel?.id
      );
      form.setFieldsValue({
        name: responseData?.nombre,
        firstLastName: responseData?.primer_apellido,
        secondLastName: responseData?.segundo_apellido,
        curp: responseData?.curp,
        phone: responseData?.telefono,
        email: responseData?.correo,
        birthday: responseData?.fecha_nacimiento
          ? moment(responseData?.fecha_nacimiento)
          : null,
        careerId: responseData?.carrera?.id,
        domicilio: responseData?.domicilio,
      });
    }
    setLoadingSave(false);
  };
  const handleFinish = async (data) => {
    setLoadingSave(true);
    if (data.birthday)
      data.birthday = moment(data.birthday).format("YYYY-MM-DD");
    const saveApplicantResponse = applicantId
      ? await editApplicant(data, applicantId)
      : await createApplicants(data);
    if (saveApplicantResponse.success) {
      Alerts.success(
        "Registro del aspirante",
        saveApplicantResponse.message ||
          `Se ha ${
            applicantId ? "editado" : "registrado"
          } al aspirante con éxito.`
      );
      history.push("/Aspirantes");
    }
    setLoadingSave(false);
  };
  const handleFinishFailed = () => {
    Alerts.warning(
      "Favor de llenar correctamente",
      "Existen campos sin llenar."
    );
  };
  const handleOnStateSchoolSelectsChange = (props) => {
    setStateSchoolInputs(props);
  };
  useEffect(() => {
    if (applicantId) loadEditData();
  }, [applicantId]);
  return [
    loading,
    form,
    handleFinish,
    handleFinishFailed,
    handleOnStateSchoolSelectsChange,
    stateSchoolInputsRef,
  ];
};

export default useApplicantsAddEditViewForm;
