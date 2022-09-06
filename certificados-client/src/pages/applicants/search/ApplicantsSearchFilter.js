import React, { useMemo, useState } from "react";
import { Loading, PrimaryButton } from "../../../shared/components";
import { Col, Form, Input, Row } from "antd";
import Alerts from "../../../shared/alerts";
import StateSchoolCareerInputs from "../../../components/StateSchoolCareerInputs";
import { SearchOutlined } from "@ant-design/icons";
import useGetApplicants from "./hooks/useGetApplicants";

const styles = {
  colProps: {
    xs: { span: 24 },
    md: { span: 8 },
  },
  rowProps: {
    style: { marginBottom: "1em" },
  },
};

const ApplicatsSearchFilter = () => {
  const [form] = Form.useForm();
  const [, loadingApplicants, loadApplicants] = useGetApplicants();
  const [stateSchoolCareerInputs, setStateSchoolCareerInputs] = useState({
    loading: false,
    states: [],
    school: [],
    careers: [],
  });
  const [loading] = useState(false);
  const showLoading = useMemo(
    () => loading || stateSchoolCareerInputs?.loading || loadingApplicants,
    [loading, stateSchoolCareerInputs, loadingApplicants]
  );
  const handleFinish = ({ stateId, schoolId, searchText }) => {
    loadApplicants({ state: stateId, school: schoolId, searchText });
  };
  const handleFinishFailed = () => {
    Alerts.warning(
      "Favor de llenar correctamente",
      "Existen campos sin llenar."
    );
  };
  const handleOnStateSchoolCareerChange = (props) => {
    setStateSchoolCareerInputs(props);
  };
  return (
    <Loading loading={showLoading}>
      <Form
        form={form}
        onFinish={handleFinish}
        onFinishFailed={handleFinishFailed}
        layout="vertical"
      >
        <Row {...styles.rowProps}>
          <StateSchoolCareerInputs
            form={form}
            colProps={styles.colProps}
            onValuesChange={handleOnStateSchoolCareerChange}
            hideCareers
          />
          <Col {...styles.colProps}>
            <Form.Item label="CURP/Nombre:" name="searchText">
              <Input placeholder="Nombre/CURP" style={{ width: "90%" }} />
            </Form.Item>
          </Col>
        </Row>
        <Row {...styles.rowProps}>
          <Col {...styles.colProps}>
            <PrimaryButton loading={showLoading} icon={<SearchOutlined />}>
              Buscar
            </PrimaryButton>
          </Col>
        </Row>
      </Form>
    </Loading>
  );
};

export default ApplicatsSearchFilter;
