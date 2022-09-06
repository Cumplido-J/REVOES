import React from "react";
import { Link } from "react-router-dom";
import { Descriptions, Alert } from "antd";

import { Subtitle } from "../../shared/components";

export default function HomeSurveys({ surveys }) {
  if (!surveys.length) {
    return (
      <>
        <Subtitle>Encuestas no disponibles</Subtitle>
        <Alert
          message={<strong>Atención</strong>}
          description="No hay encuestas disponibles en este momento."
          type="warning"
          showIcon
        />
      </>
    );
  }
  return (
    <>
      <Subtitle>Encuestas disponibles</Subtitle>
      {surveys.map((survey, index) => (
        
        <Descriptions key={index} size="small" bordered>
           {survey.folio==null && ( 
             <>
          <Descriptions.Item label="Encuesta">{survey.name}</Descriptions.Item>
          <Descriptions.Item label="Enlace">
            <Link to={survey.link}>Ir a la encuesta</Link>
          </Descriptions.Item>
          <Descriptions.Item label="Fecha inicio">{survey.startDate}</Descriptions.Item>
          <Descriptions.Item label="Fecha término">{survey.endDate}</Descriptions.Item>
            </>
          )}
          {survey.folio!=null && (
            <>
            <Descriptions.Item label="Gracias por participar en la">{survey.name}</Descriptions.Item>
            <Descriptions.Item label="Folio de confirmación">{survey.folio}</Descriptions.Item>
                       
            </>
          )}
        </Descriptions>
        
      ))}
    </>
  );
}
