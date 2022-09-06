import React, { useEffect, useState } from "react";
import  {Modal}  from "antd";
import { Loading } from "../../shared/components";
import { Table } from "antd";
import Columns from "../../shared/columns";
import CatalogService from "../../service/CatalogService";

const columns = [
  Columns.module,
  Columns.order,
  Columns.credits,
  Columns.hours,
  ];

export default function CareerShowCompetence({ careerKey, setCareerKey}) {
  const [loading, setLoading] = useState(true);
  const [compeData,setCompeData]= useState([]);
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    const getCompeData = async () => {
      setLoading(true);
      setLoading(false);
      setShowModal(true);
    };
    if (careerKey=== null) {
        setCompeData([]);
        setShowModal(false);
    } else {
      getCompeData();
      showCompeData(careerKey);
    }
  }, [careerKey]);

  const showCompeData = async function (values) {
    const response = await CatalogService.getCompetencias(values);
    setCompeData(response.competList);
  
  };

  return (
    <Modal
      onCancel={() => {
        setCareerKey(null);
      }}
      visible={showModal}
      width="40%"
      zIndex={1040}
      centered
      title={"Competencias de la carrera"}
      footer={null}
    >
      <Loading loading={loading}>
      <Table
        rowKey="id"
        bordered
        pagination={{ position: ["topLeft", "bottomLeft"] }}
        columns={columns}
        scroll={{ x: columns.length * 200 }}
       dataSource={compeData}
        size="small"
      />
     
      </Loading>
    </Modal>
  );
}