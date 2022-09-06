import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Alert, Typography } from "antd";

import SigedService from "../../service/SigedService";
import { PageLoading, Subtitle } from "../../shared/components";
import { getFullName, getLetrasNumero } from "../../shared/functions";

const { Text} = Typography;

export default function FolioData({ match }) {
  const [loading, setLoading] = useState(true);
  const [folioData, setFolioData] = useState(null);
  const [datoFolio, setDatoFolio] = useState(null);
  const { folio } = match.params;

  const [folioData2, setFolioData2] = useState(null);

  const [longi, setlongi]=useState({});

  useEffect(() => {
    async function searchFolioData() {
      //const data = await SigedService.searchFolioData(folio);
      setLoading(true);
      //const datos = await SigedService.searchFolioDataApi(folio);
      await loadSisec();
      //setFolioData(datos.folioData[0]);
      if (!longi) {
        await loadIndepe();
      }
      setLoading(false);

    }
    searchFolioData();
  }, [folio]);

  const loadSisec = async () => {
    const response =  await SigedService.searchFolioData(folio);
    if (response.folioData2)
      setlongi(response.folioData2.length>0);
      setFolioData2(response.folioData2);
  };
  const loadIndepe = async () => {
    const response = await SigedService.getFolioData(folio);
    if (response.datoFolio)
      setDatoFolio(response.datoFolio);
  };
  return (
    <PageLoading loading={loading}>
      <div className="container">
        {!folioData2 && !datoFolio && <FolioDataNotFound />}
        {!folioData2 && datoFolio && <FoundData datoFolio={datoFolio} />}
        {folioData2 && !datoFolio && <FolioDataFound folioData2={folioData2} />}
        {folioData2 && datoFolio && <FolioDataFound folioData2={folioData2}/>}
        <div className="text-center">
          <Link className="btn btn-primary" to="/">
            Regresar a inicio
          </Link>{" "}
          <Link className="btn btn-default" to="/Folio">
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

function FolioDataFound({folioData2}) {
  
  const letra = folioData2.estatus;
  const primer=letra.substring(0,1); 
  const resto=letra.substring(1);
  const status=primer+resto.toLowerCase()+" en el SIGED";

  const numPromedio=folioData2.promedioText;
  const longitud=folioData2.len;// numPromedio.toString().length;
  let vlo;
  if(longitud>3){
    vlo="Diez";
  }else{
    const digito1=numPromedio.substring(0,1);
    const digito2=numPromedio.substring(2);
    vlo=getLetrasNumero(digito1, digito2);
  }
  
  const fullName = getFullName(folioData2.nombres, folioData2.primerApellido, folioData2.segundoApellido);
  return (
    <>
      <div className="row text-center">
        <Subtitle>Datos del Estudiante</Subtitle>
      </div>    
      <div className="row">
        <FolioDataFoundElement name={"Nombre y apellidos"} value={fullName} />
        <FolioDataFoundElement name={"Número de matricula"} value={folioData2.numControl} />
      </div>
      <div className="row text-center">
        <Subtitle>Datos del plantel o servicio educativo</Subtitle>
      </div>
      <div className="row">
        <FolioDataFoundElement name={"Institución Educativa Emisora"} value={"Dirección General del Colegio de Estudios Científicos y Tecnológicos del Estado de "+folioData2.emisora} />
        <FolioDataFoundElement name={"Plantel o Servicio Educativo"} value={folioData2.institucion} />
        <FolioDataFoundElement name={"Clave de Centro de Trabajo"} value={folioData2.cctSchool} />
      </div>
      <div className="row text-center">
        <Subtitle>Trayectoria académica y datos del documento</Subtitle>
      </div>
      <div className="row">
        <FolioDataFoundElement name={"Plan de estudios"} value={folioData2.carrera} />
        <FolioDataFoundElement name={"Tipo de documento"} value={folioData2.tipoCertificado} />
        <FolioDataFoundElement name={"Promedio"} value={folioData2.promedio+ " "+vlo} />
        <FolioDataFoundElement name={"Créditos obtenidos"} value={"("+folioData2.obtainedCredits+" de un total de "+folioData2.creditsTotal+")"} />
        <FolioDataFoundElement name={"Estatus"} value={status} />
        <FolioDataFoundElement name={"Folio digital"} value={folioData2.folio} />
        <FolioDataFoundElement name={"Fecha y hora del timbrado"} value={folioData2.fechaEmision} />
      </div>             
      <div className="row text-center">
        <a className="btn btn-link" href={`https://siged.sep.gob.mx/SIGED/documentos.html?folio=${folioData2.folio}`}>
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
    <>
      <div className="form-group col-md-12">
        <Text strong>{name}:</Text> <Text>{value}</Text>
      </div>
    </>
  );
}

function DivTable({ name}) {
  return (
    <div className="col-md-12">
      <label>
        <strong>{name}</strong>
      </label>
    </div>
  );
}
