import React, { useEffect, useState } from "react";
import { CheckCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { Row, Col, Table, Form, Input, Button } from "antd";
import { ButtonCustom, Loading, PrimaryButton } from "../../shared/components";
import Columns from "../../shared/columns";
import CatalogService from "../../service/CatalogService";
import SchoolAddCareer from "./SchoolAddCareer";
import SchoolService from "../../service/SchoolService";
import alerts from "../../shared/alerts";

const colProps = {
  xs: { span: 24 },
  md: { span: 8 },
};

const columns = [
  Columns.description2,
  Columns.description1,
];

export default function SchoolCareers({ cct }) {
  const [form] = Form.useForm();
  const [careerData, setCareerData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [modalFielVisible, setModalFielVisible] = useState(false);
  const [uploadResponse, setUploadResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCareerData([]);
  }, [cct]);

  useEffect(() => {
    const getSchoolDataCareers = async () => {
      const response = await CatalogService.getAllCareersCatalogs2();
      setCareerData(response.careersList);
      setLoading(false);
    };
    getSchoolDataCareers();
  }, [cct]);



  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => setSelectedRowKeys(newSelectedRowKeys),
    onSelectAll: (selected) => {
      let idcareers = [];
      if (selected) idcareers = careerData.map((row) => row.id);
      setSelectedRowKeys(idcareers);
    },
  };

  const toggleModalFiel = () => {
    setModalFielVisible(!modalFielVisible);
  };

  const addCareerSchool = async (values) => {
    setLoading(true);
    const response = await SchoolService.addCareerSchool({
      cct: cct,
      careerTypeId: selectedRowKeys,
    });
    setUploadResponse(response);
    setLoading(false);

    if (response.success) {
      setSelectedRowKeys([]);
      alerts.success(response.message);
    }
    return response;
  };

  const handleFinish = async (values) => {
    setLoading(true);
    var serch = careerData.filter(item => {
      if (item.description1.toString().includes(values.keycareer)) {
        return item;
      }
    });
    if (values.keycareer !== "") {
      setCareerData(serch);
    }
    setLoading(false);
  };

  const handleFinishFailed = () => {
    alerts.warning("Favor de llenar correctamente", "Existen campos sin llenar.");
  };
  const updateCareer = async (values) => {
    const response = await CatalogService.getAllCareersCatalogs2();
    setCareerData(response.careersList);
  };

  const updateCareer2 = () => {
    updateCareer();
  };
  return (
    <>
      <Loading loading={loading}>
        <br></br>
        <Form onFinish={handleFinish} onFinishFailed={handleFinishFailed}>
          <Row>
            <Col xs={24} sm={12} xl={12}>
              <Form.Item label="" name="keycareer">
                <Input addonBefore="Clave de plantel:" allowClear placeholder="clave" style={{ width: "90%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xs={24} sm={12} xl={4}>
              <PrimaryButton loading={loading} icon={<SearchOutlined />} >
                Buscar
              </PrimaryButton>
            </Col>
            <Col xs={24} sm={12} xl={6}>
              <ButtonCustom
                tooltip="Registrar carreras"
                color="gold"

                disabled={selectedRowKeys.length === 0}
                onClick={toggleModalFiel}
                loading={loading}
                icon={<CheckCircleOutlined />}
              >
                Registrar carreras
              </ButtonCustom>
            </Col>
            <Col xs={24} sm={12} xl={5}>
              <Button
                onClick={updateCareer2}
                tooltip="Lista de carreras"
                color="red"
              >Actualizar
              </Button>
            </Col>
          </Row>
        </Form>



        <Table
          rowKey="id"
          bordered
          pagination={{ position: ["topLeft", "bottomLeft"] }}
          columns={columns}
          scroll={{ x: columns.length * 200 }}
          dataSource={careerData}
          rowSelection={rowSelection}
          size="small"
        />
        <SchoolAddCareer
          modalFielVisible={modalFielVisible}
          toggleModalFiel={toggleModalFiel}
          addCareerSchool={addCareerSchool}
          setCareerData={setCareerData}
          cct={0}
        />
      </Loading>
    </>
  );
}