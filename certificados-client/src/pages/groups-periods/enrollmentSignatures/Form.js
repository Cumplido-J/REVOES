import React, { useEffect, useState } from "react";
import { Form, DatePicker, Row, Col } from "antd";
import moment from "moment";
import { CheckCircleOutlined } from "@ant-design/icons";
import {
  Loading,
  SearchSelect,
  PrimaryButton,
} from "../../../shared/components";
import { EnrollmentTypesGroupsConfigCatalog } from "../../../shared/catalogs";
import { getGroupPeriodById } from "../../../service/GroupsPeriodService";
import { setEnrollmentConfigOnGroup } from "../../../service/GroupsPeriodService";
import Alerts from "../../../shared/alerts";

const { RangePicker } = DatePicker;
export default ({ groupPeriodsId }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function setUp() {
      const apiResponse = await getGroupPeriodById(groupPeriodsId);
      console.log(apiResponse);
      if (apiResponse.success && apiResponse.data) {
        const formData = {};
        if (apiResponse.data.fecha_inicio && apiResponse.data.fecha_fin) {
          formData.regular = [
            moment(apiResponse.data.fecha_inicio),
            moment(apiResponse.data.fecha_fin),
          ];
        }
        if (
          apiResponse.data.fecha_inicio_irregular &&
          apiResponse.data.fecha_fin_irregular
        ) {
          formData.irregular = [
            moment(apiResponse.data.fecha_inicio_irregular),
            moment(apiResponse.data.fecha_fin_irregular),
          ];
        }
        if (apiResponse.data.tipo_inscripcion) {
          formData.tipo_inscripcion = apiResponse.data.tipo_inscripcion;
        }
        form.setFieldsValue(formData);
      }
      setLoading(false);
    }
    setUp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFinish = async ({ irregular, regular, tipo_inscripcion }) => {
    setLoading(true);
    const data = {
      tipo_inscripcion,
      fecha_inicio: moment(regular[0]).format("DD/MM/YYYY"),
      fecha_fin: moment(regular[1]).format("DD/MM/YYYY"),
      fecha_inicio_irregular: moment(irregular[0]).format("DD/MM/YYYY"),
      fecha_fin_irregular: moment(irregular[1]).format("DD/MM/YYYY"),
    };
    const response = await setEnrollmentConfigOnGroup(groupPeriodsId, data);
    if (response.success) {
      Alerts.success("Listo", "Configuración guardada con éxito");
    }
    setLoading(false);
  };
  const handleFail = () => {
    Alerts.warning(
      "Favor de llenar correctamente",
      "Existen campos sin llenar."
    );
  };

  const validations = {
    req: [{ required: true, message: "Este campo es requerido" }],
  };
  const colProps = {
    xs: { span: 24 },
    md: { span: 12 },
  };
  const rowProps = {
    style: { marginBottom: "1em" },
  };
  return (
    <>
      <Loading loading={loading}>
        <Form
          form={form}
          onFinish={handleFinish}
          onFinishFailed={handleFail}
          layout="vertical"
        >
          <Row {...rowProps}>
            <Col {...colProps}>
              <Form.Item
                label="Fechas para alumno regular"
                name="regular"
                rules={validations.req}
              >
                <RangePicker
                  format="DD/MM/YYYY"
                  placeholder={["Fecha de inicio", "Fecha límite"]}
                />
              </Form.Item>
            </Col>
            <Col {...colProps}>
              <Form.Item
                label="Fechas para alumnos irregulares"
                name="irregular"
                rules={validations.req}
              >
                <RangePicker
                  format="DD/MM/YYYY"
                  placeholder={["Fecha de inicio", "Fecha límite"]}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row {...rowProps}>
            <Col {...colProps}>
              <Form.Item
                label="Tipo de inscripción"
                name="tipo_inscripcion"
                rules={validations.req}
              >
                <SearchSelect dataset={EnrollmentTypesGroupsConfigCatalog} />
              </Form.Item>
              <div>
                Esta opción determina si los alumnos se inscribirán ellos
                mismos, si es responsabilidad de control escolar o ambos.
              </div>
            </Col>
          </Row>
          <Row {...rowProps}>
            <Col {...colProps}>
              <PrimaryButton
                icon={<CheckCircleOutlined />}
                size={"large"}
                fullWidth={false}
              >
                Guardar configuración
              </PrimaryButton>
            </Col>
          </Row>
        </Form>
      </Loading>
    </>
  );
};
