import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Alert } from "antd";

import SigedService from "../../service/SigedService";
import { PageLoading, Subtitle } from "../../shared/components";
import { getFullName } from "../../shared/functions";

export default function FolioData({ match }) {
  const [loading, setLoading] = useState(true);
  const [folioData, setFolioData] = useState(null);
  const [datoFolio, setDatoFolio] = useState(null);
  const [active, setActive] = useState(false);
  const { folio } = match.params;
  useEffect(() => {
    async function searchFolioData() {
      //const data = await SigedService.searchFolioData(folio);
      setLoading(true);
     // const datos = await SigedService.searchFolioDataApi(folio);
      if (folio) {
        await loadIndepe();
      }
      //setFolioData(datos.folioData[0]);
      setLoading(false);
    }
    searchFolioData();
  }, [folio]);

  const loadIndepe = async () => {
    const response = await SigedService.searchFolioDataDegree(folio);
    if(response.datoFolio)  setActive(true);
      setDatoFolio(response.datoFolio);
  };
  return (
    <PageLoading loading={loading}>
      <div className="container">
        <Subtitle>Información de título digital:</Subtitle>
        {active==true && <FolioDataFound folioData={datoFolio} />}
        {active==false && <FolioDataNotFound />}       
        <div className="text-center">
          <Link className="btn btn-primary" to="/">
            Regresar a inicio
          </Link>{" "}
          <Link className="btn btn-default" to="/FolioDegree">
            Buscar otro folio
          </Link>
        </div>
      </div>
    </PageLoading>
  );
}

function FolioDataNotFound() {
  return (
    <Alert
      style={{ marginBottom: "2em" }}
      message={<strong>Atención</strong>}
      description="No se ha encontrado información de este folio. Favor de intentar nuevamente"
      type="warning"
      showIcon
    />
  );
}

function FolioDataFound({ folioData }) {
  const fullName = getFullName(folioData.name, folioData.firstLastName, folioData.secondLastName);
  return (
    <>
      <div className="row text-center">
        <FolioDataFoundElement name={"Folio digital"} value={folioData.folio} />
        <FolioDataFoundElement name={"Nombre"} value={fullName} />
        <FolioDataFoundElement name={"Matrícula"} value={folioData.enrollmentKey} />
        <FolioDataFoundElement name={"CURP"} value={folioData.curp} />
        <FolioDataFoundElement name={"Entidad federativa"} value={folioData.stateName} />
        <FolioDataFoundElement name={"Nombre carrera"} value={folioData.careerName} />
        <FolioDataFoundElement name={"Nombre Plantel"} value={folioData.schoolName} />
        
      </div>
      <div className="row">
        <div className="form-group col-md-6">
          <div className="alert alert-success">
            <h5>
              <strong>Fecha Expedición:</strong>
            </h5>
            <p>{folioData.dateExpedition}</p>
           
          </div>
        </div>
        <div className="form-group col-md-6">
          <div className="alert alert-info">
            <h5>
              <strong>Fecha Timbrado:</strong>
            </h5>
            <p>
              <strong>{folioData.stampedDate}</strong>
            </p>
          </div>
        </div>

        <div className="form-group col-md-12">
          {folioData.excelStatus === 1 && (
            <div className="alert alert-success">
            <h5>
              <strong>Mensaje de Estatus:</strong>
            </h5>
            <p>{folioData.excelMessage}</p>
           
          </div>
          )}
          {folioData.excelStatus === 2 && (
            <div className="alert alert-danger">
            <h5>
              <strong>Mensaje de Estatus:</strong>
            </h5>
            <p>{folioData.excelMessage}</p>
           
          </div>
          )}
          
        </div>
      </div>
      <div className="row text-center">
        <a className="btn btn-link" href={`https://siged.sep.gob.mx/SIGED/documentos.html?folio=${folioData.folio}`}>
          Verificar información en SIGED
        </a>
      </div>
    </>
  );
}
function FoundData({ datoFolio }) {
  return (
    <>
      <div className="row text-center">
        <FolioDataFoundElement name={"Folio digital"} value={datoFolio.folio} />
        <FolioDataFoundElement name={"Tipo de documento"} value={datoFolio.tipoCertificado} />
        <FolioDataFoundElement name={"Estatus"} value={datoFolio.estatus} />
        <FolioDataFoundElement name={"Nombre"} value={datoFolio.nombreCompleto} />
        <FolioDataFoundElement name={"Autoridad emisora"} value={datoFolio.emisora} />
        <FolioDataFoundElement name={"Plan de estudios"} value={datoFolio.planestudio} />
        <FolioDataFoundElement name={"Promedio"} value={datoFolio.promedio} />
        <FolioDataFoundElement name={"Fecha registro SIGED"} value={datoFolio.fechaCertificado} />
        <FolioDataFoundElement name={"Fecha emision"} value={datoFolio.fechaEmision} />
        <FolioDataFoundElement name={"Entidad federativa"} value={datoFolio.entidad} />
      </div>
      <div className="row">
        <div className="form-group col-md-6">
          <div className="alert alert-success">
            <h5>
              <strong>Promedio:</strong>
            </h5>
            <p>{datoFolio.promedio}</p>
            <p>{datoFolio.promedioTexto}</p>
          </div>
        </div>
        <div className="form-group col-md-6">
          <div className="alert alert-info">
            <h5>
              <strong>Estatus del documento:</strong>
            </h5>
            <p>
              <strong>{datoFolio.estatus}</strong>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
function FolioDataFoundElement({ name, value }) {
  return (
    <div className="form-group col-md-6">
      <label>
        <strong>{name}:</strong>
      </label>
      <p>{value}</p>
    </div>
  );
}
