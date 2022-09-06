import React, { useEffect, useState } from "react";
import { Modal, Alert } from "antd";
import { Loading } from "../../shared/components";
import { Table } from "antd";
import { columnProps } from "../../shared/columns";
import DegreeCatalogService from "../../service/DegreeCatalogService";


const columns = [{
  ...columnProps,
  title: "Nombre en DGP",
  align: 'left',
  render: (row) => {
    return (
      row.description2
    )
  }
},
{
  ...columnProps,
  title: "Clave en DGP",
  width: '25%',
  render: (row) => {
    return (
      row.description1
    )
  }
},
];

export default function SchoolSerchCareer({ schoolId, setSchoolId }) {
  const [loading, setLoading] = useState(true);
  const [careerData, setCareerData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    const getCareerData = async () => {
      setLoading(true);
      setLoading(false);
      setShowModal(true);
    };
    if (schoolId === null) {
      setCareerData([]);
      setShowModal(false);
    } else {
      getCareerData();
      searchCareerData(schoolId);
    }
  }, [schoolId]);

  const searchCareerData = async function (values) {
    const response = await DegreeCatalogService.getCarrers(schoolId);
    if (!response) return;
    setCareerData(response.careers);

  };

  return (
    <Modal
      onCancel={() => {
        setSchoolId(null);
      }}
      visible={showModal}
      width="40%"
      zIndex={1040}
      centered
      title={"Carreras del plantel en DGP"}
      footer={null}
    >
      <Loading loading={loading}>
        {careerData.length != 0 && (
          <>
            <p style={{ marginTop: "2em" }}>
              <strong>Registros encontrados: </strong> {careerData.length}
            </p>
            <Table
              rowKey="id"
              bordered
              pagination={{ position: ["topLeft", "bottomLeft"] }}
              columns={columns}
              scroll={{ x: columns.length * 200 }}
              dataSource={careerData}
              size="small"
            />
            <p style={{ marginTop: "2em" }}>
              <strong>Registros encontrados: </strong> {careerData.length}
            </p>
          </>
        )}
        {careerData == 0 && (
          <Alert
          message="Información"
          description="Por el momento no tenemos carreras asociadas a este plantel."
          type="info"
          showIcon
        />
        )}
      </Loading>
    </Modal>
  );
}