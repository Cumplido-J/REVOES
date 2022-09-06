import React, { useEffect, useState } from "react";
import  {Modal}  from "antd";
import { Loading } from "../../shared/components";
import { Table } from "antd";
import Columns from "../../shared/columns";
import CatalogService from "../../service/CatalogService";

const columns = [
    Columns.description2,
    Columns.description1,
  ];

export default function SchoolEquivalentModal({ cct, setCct}) {
  const [loading, setLoading] = useState(true);
  const [careerData,setCareerData]= useState([]);
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    const getCareerData = async () => {
      setLoading(true);
      setLoading(false);
      setShowModal(true);
    };
    if (cct === null) {
      setCareerData([]);
      setShowModal(false);
    } else {
      getCareerData();
      searchCareerData(cct);
    }
  }, [cct]);

  const searchCareerData = async function (values) {
    const response = await CatalogService.getCareerCatalogs2(values);
    setCareerData(response.careersList);
  
  };

  return (
    <Modal
      onCancel={() => {
        setCct(null);
      }}
      visible={showModal}
      width="40%"
      zIndex={1040}
      centered
      title={"Carreras del plantel"}
      footer={null}
    >
      <Loading loading={loading}>
      <Table
        rowKey="id"
        bordered
        pagination={{ position: ["topLeft", "bottomLeft"] }}
        columns={columns}
        scroll={{ x: columns.length * 200 }}
       dataSource={careerData}
        size="small"
      />
     
      </Loading>
    </Modal>
  );
}