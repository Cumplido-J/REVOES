import React, { useState } from "react";
import { Alert } from "antd";
import { CloudSyncOutlined } from "@ant-design/icons";

import { ButtonCustom } from "../../shared/components";

export default function CertificateQuerySincronize({ pendientBatches, sincronizeBatches, sincronizeResponse }) {
  const [loading, setLoading] = useState(false);
  const sincronize = async () => {
    setLoading(true);
    await sincronizeBatches();
    setLoading(false);
  };
  return (
    <>
      {pendientBatches && (
        <Alert
          style={{ marginBottom: "1em" }}
          message={<strong>Información</strong>}
          description={
            <>
              <p>
                No están actualizados los archivos con el servidor de certificación, favor de dar click en el siguiente
                botón
              </p>
              <ButtonCustom
                color="red"
                onClick={sincronize}
                loading={loading}
                icon={<CloudSyncOutlined />}
                fullWidth={true}
              >
                Actualizar certificados
              </ButtonCustom>
              <p>{loading && <>Actualizando.. este proceso puede tardar varios minutos</>}</p>
            </>
          }
          type="info"
          showIcon
        />
      )}
      {sincronizeResponse && <SincronizeResponseMessage sincronizeResponse={sincronizeResponse} />}
    </>
  );
}
function SincronizeResponseMessage({ sincronizeResponse }) {
  if (sincronizeResponse.success) {
    return (
      <Alert
        message={<strong>Certificación de alumnos</strong>}
        description={sincronizeResponse.message}
        type="success"
        showIcon
        closable
      />
    );
  }

  const messages = sincronizeResponse.message.split(",");
  const message = (
    <>
      {messages.map((message, index) => (
        <p key={index}>{message}</p>
      ))}
    </>
  );

  return (
    <Alert
      message={<strong>Certificación de alumnos</strong>}
      description={
        <>
          <p>{message}</p>
          <p>Favor de intentar nuevamente</p>
        </>
      }
      type="warning"
      showIcon
    />
  );
}
