import React, { useEffect,useState } from "react";
import  {Form, Row, Col }  from "antd";
import {SearchSelect,PrimaryButton} from "../../shared/components";
import Alerts from "../../shared/alerts";
import { CheckCircleOutlined } from "@ant-design/icons";
import CatalogService from "../../service/CatalogService";

const colProps = {
  xs: { span: 24 },
  md: { span: 8 },
};
const rowProps = {
  style: { marginBottom: "1em" },
};
const validations = {
  careerId: [{ required: true, message: "¡Carrera es requerido!" }],
}
export default function SchoolFormupdate({ dataset,onSubmit,cct,schoolcareerId }) {
  const [loading, setLoading] = useState(true);
  const [catalogs, setCatalogs] = useState({careers: []});
  const [form] = Form.useForm();
  const [inputval,setInputval]=useState();
  useEffect(() => {
    async function getCareers() {
      const response = await CatalogService.getCareerCatalogsSelect(cct);
      if (!response) return;
      const careers = response.careers.map((career) => ({ id:career.schoolcareerId,
        description: `${career.description2}-${career.description1}` }));
      setCatalogs({careers });
      setInputval(schoolcareerId);
      setLoading(false);
    }
    getCareers();
  }, [schoolcareerId]);

  const handleFinish = async (values) => {
    setLoading(true);
    await onSubmit(values);
    setLoading(false);
  };

  const handleFinishFailed = () => {
    Alerts.warning("Favor de llenar correctamente", "Existen campos sin llenar.");
  };
  return (
    <>
      <Form form={form} layout="vertical" onFinish={handleFinish} onFinishFailed={handleFinishFailed} >
      <Row align="center" {...rowProps}>
          <Col {...rowProps}>
            <Form.Item label="Mover Alumnos a la Carrera de:" name="careerId" rules={validations.careerId}>
              <SearchSelect dataset={catalogs.careers} />
            </Form.Item>
          </Col>          
        </Row>        
        <Row align="center" {...rowProps} >          
          <Col {...colProps}>
            <PrimaryButton loading={loading} icon={<CheckCircleOutlined />}>Aceptar</PrimaryButton> 
          </Col>    
        </Row>        
      </Form>      
      <p>
        <strong>Registros encontrados: </strong> {dataset}
      </p>
      
    </>
  );
}
