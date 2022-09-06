import React, { useEffect, useState } from "react";
import { Alert } from "antd";

import { Loading, Subtitle } from "../../shared/components";
import { dateToReadableDate, getFullName } from "../../shared/functions";

import SurveyService from "../../service/SurveyService";

export default function SurveyConfirmation({ match }) {
  const folio = match.params.folio;
  const [loading, setLoading] = useState(true);
  const [folioInfo, setFolioInfo] = useState(null);

  useEffect(() => {
    const getInfoFromFolio = async () => {
      const response = await SurveyService.getInfoFromFolio(folio);
      if (response.success) setFolioInfo(response.folioInfo);
      setLoading(false);
    };
    getInfoFromFolio();
  }, [folio]);
  return (
    <Loading loading={loading}>
      {!folioInfo && <NoInfoFound />}
      {folioInfo && <InfoFound folio={folio} folioInfo={folioInfo} />}
    </Loading>
  );
}

function NoInfoFound() {
  return (
    <div className="container">
      <Alert
        message={<strong>Atención</strong>}
        description="No se ha encontrado información de este folio de confirmación. Favor de verificarlo"
        type="warning"
        showIcon
      />
    </div>
  );
}
function InfoFound({ folioInfo, folio }) {
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <Alert
            style={{ marginBottom: "2em" }}
            message={<strong>Gracias por participar en la encuesta de egresados.</strong>}
            description="Sus respuestas han sido registradas, favor de guardar el folio de confirmación."
            type="success"
            showIcon
          />
        </div>
        <div className="col-md-6">
          <Alert
            style={{ marginBottom: "2em" }}
            message={<strong>Folio de confirmación.</strong>}
            description={folio}
            type="info"
            showIcon
          />
        </div>
      </div>
      <Subtitle>Datos del encuestado</Subtitle>
      <div className="row text-center">
        <div className="form-group col-md-6">
          <label>
            <strong>Fecha de respuesta:</strong>
          </label>
          <p>{dateToReadableDate(folioInfo.date)}</p>
        </div>
        <div className="form-group col-md-6">
          <label>
            <strong>Curp:</strong>
          </label>
          <p>{folioInfo.curp}</p>
        </div>
        <div className="form-group col-md-6">
          <label>
            <strong>Nombre:</strong>
          </label>
          <p>{getFullName(folioInfo.name, folioInfo.firstLastName, folioInfo.secondLastName)}</p>
        </div>
      </div>
    </div>
  );
}
