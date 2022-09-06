import React from "react";
import { Alert } from "antd";

const colProps = {
  xs: { span: 24 },
  md: { span: 8 },
};
const rowProps = {
  style: { marginBottom: "1em" },
};

export default function StudentDegreeData({ dataset }) {
  //alert(JSON.stringify(dataset))
  return (
    <>
      <Alert
        style={{ marginBottom: "2em" }}
        message={<strong>ATENCIÓN.</strong>}
        description="Este apartado muestra los datos del alumno, indicando que ya ha terminado su proceso de titulación, o que este en proceso."
        type="info"
        showIcon
      />
      <table class="table table-bordered table-striped">
        <thead>
          <tr>
            <th>SECCIÓN</th>
            <th>ATRIBUTOS</th>
            <th>DATOS</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th rowSpan="2">Institución</th>
            <td scope="row">g.cveInstitucion</td>
            <td>{dataset[0].schoolKey}</td>
          </tr>
          <tr>
            <td scope="row">h.nombreInstitucion</td>
            <td>{dataset[0].schoolName}</td>
          </tr>
          <tr>
            <th rowSpan="6">Carrera</th>
            <td scope="row">i.cveCarrera</td>
            <td>{dataset[0].careerKey}</td>
          </tr>
          <tr>
            <td scope="row">j.nombreCarrera</td>
            <td>{dataset[0].careerName}</td>
          </tr>
          <tr>
            <td scope="row">k.fechaInicio</td>
            <td>{dataset[0].startDateCareer}</td>
          </tr>
          <tr>
            <td scope="row">l.fechaTerminacion</td>
            <td>{dataset[0].endDateCareer}</td>
          </tr>
          <tr>
            <td scope="row">m.idAutorizacionReconocimiento</td>
            <td>{dataset[0].autorizationId}</td>
          </tr>
          <tr>
            <td scope="row">n.AutorizacionReconocimiento</td>
            <td>{dataset[0].auth}</td>
          </tr>
          <tr>
            <th rowSpan="5">Profesionista</th>
            <td scope="row">p.curp</td>
            <td>{dataset[0].curp}</td>
          </tr>
          <tr>
            <td scope="row">q.nombre</td>
            <td>{dataset[0].name}</td>
          </tr>
          <tr>
            <td scope="row">r.primerApellido</td>
            <td>{dataset[0].firstLastName}</td>
          </tr>
          <tr>
            <td scope="row">s.segundoApellido</td>
            <td>{dataset[0].secondLastName}</td>
          </tr>
          <tr>
            <td scope="row">t.correoElectronico</td>
            <td>{dataset[0].email}</td>
          </tr>
          <tr>
            <th rowSpan="10">Expedición</th>
            <td scope="row">u.fechaExpedicion</td>
            <td>{dataset[0].expeditionDate}</td>
          </tr>
          <tr>
            <td scope="row">v.idModalidadTitulacion</td>
            <td>{dataset[0].modalityId}</td>
          </tr>
          <tr>
            <td scope="row">w.modalidadTitulacion</td>
            <td>{dataset[0].degreeModality}</td>
          </tr>
          <tr>
            <td scope="row">x.fechaExamenProfesional</td>
            <td>{dataset[0].examinationDate}</td>
          </tr>
          <tr>
            <td scope="row">y.fechaExencionExamenProfesional</td>
            <td>{dataset[0].exemptionDate}</td>
          </tr>
          <tr>
            <td scope="row">z.cumplioServicioSocial</td>
            <td>{dataset[0].socialService}</td>
          </tr>
          <tr>
            <td scope="row">aa.idFundamentoLegalServicioSocial</td>
            <td>{dataset[0].legalBasisId}</td>
          </tr>
          <tr>
            <td scope="row">bb.fundamentoLegalServicioSocial</td>
            <td>{dataset[0].legalBasis}</td>
          </tr>
          <tr>
            <td scope="row">cc.idEntidadFederativa</td>
            <td>
              {dataset[0].federalEntityId <= 9 && (
                '0' + dataset[0].federalEntityId
              )}
              {dataset[0].federalEntityId > 9 && (
                dataset[0].federalEntityId
              )}
            </td>
          </tr>
          <tr>
            <td scope="row">dd.entidadFederativa</td>
            <td>{dataset[0].state}</td>
          </tr>
          <tr>
            <th rowSpan="7">Antecedente</th>
            <td scope="row">ee.institucionProcedencia</td>
            <td>{dataset[0].institutionOrigin}</td>
          </tr>
          <tr>
            <td scope="row">ff.idTipoEstudioAntecedente</td>
            <td>{dataset[0].institutionOriginTypeId}</td>
          </tr>
          <tr>
            <td scope="row">gg.tipoEstudioAntecedente</td>
            <td>{dataset[0].antecedent}</td>
          </tr>
          <tr>
            <td scope="row">hh.idEntidadFederativa</td>
            <td>
              {dataset[0].federalEntityOriginId <= 9 && (
                '0' + dataset[0].federalEntityOriginId
              )}
              {dataset[0].federalEntityOriginId > 9 && (
                dataset[0].federalEntityOriginId
              )}
            </td>
          </tr>
          <tr>
            <td scope="row">ii.entidadFederativa</td>
            <td>{dataset[0].antecedentState}</td>
          </tr>
          <tr>
            <td scope="row">jj.fechaInicio</td>
            <td>{dataset[0].antecedentStartDate}</td>
          </tr>
          <tr>
            <td scope="row">kk.fechaTerminacion</td>
            <td>{dataset[0].antecedentEndDate}</td>
          </tr>

        </tbody>
      </table>
      
    </>
  );
}




