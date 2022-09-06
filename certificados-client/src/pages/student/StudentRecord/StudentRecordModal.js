import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'antd';
import { SafetyCertificateOutlined, } from "@ant-design/icons";


import StudentService from '../../../service/StudentService';

export default function StudentRecordModal({ menssage, type, curp, studentId }) {
  //alert(JSON.stringify(certificate))
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState([]);
  useEffect(() => {
    async function issuedCertificates() {
      const response = await StudentService.selectIssuedCertificates(curp, type);
      //alert(JSON.stringify(response))
      if (!response.success) return;
      setData(response.dataStudent)
    }
    issuedCertificates();

  }, [type, curp]);
  return (
    <>
      <a type="primary" onClick={() => setVisible(true)}>
        {menssage}
      </a>
      <Modal
        title={` Información del certificado`}
        centered
        visible={visible}
        onCancel={() => setVisible(false)}
        width={1000}

        footer={[
          <Button key="back" onClick={() => setVisible(false)} >
            Cerrar
          </Button>,
         
        ]}
      >
        <h5><SafetyCertificateOutlined /> 
          {type == 1 && (" Certificados de términos")}
          {type == 2 && (" Certificados parciales")}
          {type == 3 && (" Certificados abrogados")}
        </h5>
        <table className='table table-striped table-sm'>
          <thead style={{ backgroundColor: '#0C231E', color: '#ffffff' }}>
            <tr>
              <th>Fecha</th>
              <th>Folio</th>
              <th>Nombre</th>
              <th>Promerio</th>
              <th>Estatus</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => {
              return (
                <>

                  <tr>
                    <td>{row.fechaCertificado}</td>
                    <td>{row.folio}</td>
                    <td>{row.nombreCompleto}</td>                    
                    <td>{row.promedio}</td>
                    <td>{row.estatus}</td>
                  </tr>
                </>
              );
            })}
          </tbody>
        </table>
      </Modal>
    </>
  );
};

