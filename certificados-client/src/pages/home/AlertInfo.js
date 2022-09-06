import React, { useEffect, useState }from "react";
import { Loading } from "../../shared/components";
import { FileProtectOutlined } from "@ant-design/icons";
import {Col, Row,Alert} from "antd";
import DashboardService from "../../service/DashboardService";
const colProps = {
  xs: { span: 24 },
  sm: { span: 16 },
  md: { span: 8 },
};
const colProps2 = {
  xs: { span: 24},
  sm: { span: 16 },
  md: { span: 4 },
};
export default function AlertInfo({stateId,schoolId}) {
  const [loading, setLoading] = useState(false);
  const [tcertified, setTcertified] = useState([]);  
  useEffect(() => {
    const getState = async () => {
      setLoading(true);
      const response = await DashboardService.getCertified(stateId,schoolId);
      setLoading(false);
      if (!response.success) return;
      setTcertified(response.tcertified[0]);
    };
    getState();
  }, [stateId,schoolId]);  
    return(
      <Loading loading={loading}>
            <Row gutter={16} >
                <DashPrincipal  messaje={"Certificados Termino: "+tcertified.tuno} tipo={"success"} ico={<FileProtectOutlined />}/>
                <DashPrincipal tipo={"success"} messaje={"Certificados Parcial: "+tcertified.tdos}/>
                <DashPrincipal tipo={"success"} messaje={"Certificados Abrogado: "+tcertified.ttres}/> 
            </Row>
            <br/>          
        </Loading>

    );

}
function DashPrincipal({messaje,tipo,ico}){
    return (
      <Col className="gutter-row" {...colProps}>
          <Alert
          message={<strong>{messaje}</strong>}
          description=""
          type={tipo}
          icon={ico}
          showIcon
          />
      </Col>
    );
  }
   