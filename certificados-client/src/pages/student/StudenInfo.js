import React from 'react'
import { Row, Col,  Alert } from "antd";

function StudenInfo(props) {
    return (
        <>
          <Row style={{ marginBottom: "1em" }}>
        <Col xs={{ span: 24 }}>
          <Alert
            message={<strong>Certificación de alumnos</strong>}
            description={
              <>
                <p>A continuación se muestra un boton para la generación de certificación del alumno, 
                    con las siguientes clausulas:</p>
                <ul>
                  <li>Únicamente podrá registrar, modificar o alternar un certificado antes de que sea validado.</li>
                  <li>Una vez validado el certificado deberá ser aprobado, sí desea modificar o cambiar de certificado deberá cancelar el mismo.
                  </li>
                  <li>Sí desea modificar o cambiar de certificado deberá cancelar el mismo.
                  </li>
                  <li>Sí es generado un certificado parcial - calificaciones deberá cancelarlo para el registro de otro o modficación del mismo.</li>
                </ul>    

                {props.children}
              </>
            }
            type="warning"
            showIcon
          />
        </Col>
      </Row>  
        </>
    )
}

export default StudenInfo