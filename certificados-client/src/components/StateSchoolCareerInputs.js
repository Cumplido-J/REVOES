import React, { useEffect, useImperativeHandle, forwardRef } from "react";
import { Col, Form } from "antd";
import { SearchSelect } from "../shared/components";
import useStateSchoolCareerInputs from "../hooks/catalogs/useStateSchoolCareerInputs";
import PermissionValidator from "./PermissionValidator";
import { permissionList } from "../shared/constants";
const validations = {
  required: [
    {
      required: true,
      message: "Este campo es requerido",
    },
  ],
};
const StateSchoolCareerInputs = (
  {
    colProps = {
      xs: { span: 24 },
      md: { span: 8 },
    },
    naming = {
      state: "stateId",
      school: "schoolId",
      career: "careerId",
    },
    hideCareers = false,
    requiredCareers = false,
    onValuesChange = () => {},
    form = undefined,
  },
  ref
) => {
  const [
    loading,
    states,
    handleOnStateChange,
    school,
    handleOnSchoolChange,
    careers,
  ] = useStateSchoolCareerInputs({
    form,
    naming,
    hideCareers,
  });
  useImperativeHandle(ref, () => ({
    handleOnStateChange,
    handleOnSchoolChange,
  }));
  // Returns useful data as callback
  useEffect(() => {
    onValuesChange({
      loading,
      states,
      school,
      careers,
    });
  }, [loading, states, school, careers]);
  return (
    <>
      <PermissionValidator
        permissions={[permissionList.NACIONAL, permissionList.ESTATAL]}
        allPermissions={false}
      >
        <Col {...colProps}>
          <Form.Item
            label="Estado"
            name={naming.state}
            rules={validations.required}
          >
            <SearchSelect dataset={states} onChange={handleOnStateChange} />
          </Form.Item>
        </Col>
      </PermissionValidator>
      <Col {...colProps}>
        <Form.Item
          label="Plantel"
          name={naming.school}
          rules={validations.required}
        >
          <SearchSelect
            disabled={!school?.length}
            dataset={school}
            onChange={handleOnSchoolChange}
          />
        </Form.Item>
      </Col>
      {!hideCareers && (
        <Col {...colProps}>
          <Form.Item
            label="Carrera"
            name={naming.career}
            rules={requiredCareers ? validations.required : undefined}
          >
            <SearchSelect disabled={!careers?.length} dataset={careers} />
          </Form.Item>
        </Col>
      )}
    </>
  );
};
export default forwardRef(StateSchoolCareerInputs);
