import React from "react";
import { Link } from "react-router-dom";
import { Alert } from "antd";
import { Title } from "../../shared/components";

export default function StudentInfoNotUpdated() {
  return (
    <>
      <Title>ENCUESTA DE SEGUIMIENTO DE EGRESADOS</Title>
      <Alert
        message={<strong>Atención</strong>}
        description={
          <>
            Tus datos no están actualizados. Favor de actualizarlos para poder contestar la encuesta.{" "}
            <Link to="/ActualizarDatos">Ir a actualizar datos</Link>
          </>
        }
        type="warning"
        showIcon
      />
    </>
  );
}
