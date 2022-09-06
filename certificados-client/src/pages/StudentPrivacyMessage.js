import React from "react";
import { Title } from "../shared/components";
import StudentFunctionsService from "../service/StudentFunctionsService";
import alerts from "../shared/alerts";

export default function StudentPrivacyMessage({ logout, history, getUserProfile }) {
  const acceptPrivacy = async () => {
    const response = await StudentFunctionsService.acceptPrivacy();
    if (!response.success) return;
    alerts.success(response.message);
    await getUserProfile();
    history.push("/");
  };
  return (
    <div className="container" style={{ marginTop: "7em", marginBottom: "5em" }}>
      <Title>Aviso de privacidad</Title>
      <p className="text-justify">
        Los datos personales recabados de alumnos del Nivel Medio Superior serán incorporados en el Sistema de datos
        personales denominado <strong>“Sistema Integral de Seguimiento de Egresados de los CECyTEs”</strong>, con
        fundamento en lo establecido en los artículos 1, 7, 23, 68, 116 Ley General de Transparencia y Acceso a la
        información Pública; 4, 5, 7 Ley General de protección de Datos Personales en Posesión de Sujetos Obligados;
        Décimo sexto, Decimoséptimo, de los Lineamientos de Protección de los Datos Personales. La finalidad de recabar
        dichos datos personales es para dar cumplimiento a las disposiciones en materia educativa que existen en el
        país, así como para dar cumplimiento a la Normatividad del CECyTE que regula el registro y desarrollo de los
        estudios de los alumnos de Nivel Medio Superior. El{" "}
        <strong>Sistema Integral de Seguimiento de Egresados de los CECyTEs</strong>, queda registrado en el Listado de
        sistemas de datos personales ante el Instituto Federal de Acceso a la Información Pública (www.inai.org.mx) y
        podrán ser transmitidos a instancias correspondientes dentro del CECyTE y a las autoridades competentes en
        materia educativa, además de otras transmisiones previstas en la Ley. La Unidad Administrativa responsable del
        Sistema de datos personales es el CECyTE.
      </p>
      <p className="text-justify">
        Asimismo, el interesado podrá ejercer los derechos de acceso y corrección de datos en el domicilio ubicado en
        Av. Viaducto Río de la Piedad 551 Magdalena Mixhuca. Venustiano Carranza, C.P. 15860. CDMX. Lo anterior se
        informa en cumplimiento del Artículo Decimoséptimo de los Lineamientos de Protección de datos Personales,
        publicados en Diario Oficial de la Federación el 30 de septiembre del 2005.
      </p>
      <p className="text-justify">
        El presente aviso de privacidad puede sufrir modificaciones, cambios o actualizaciones derivadas de nuevos
        requerimientos legales o por otras causas.
      </p>
      <p className="text-justify">
        Nos comprometemos a mantenerlo informado sobre los cambios que pueda sufrir el presente aviso de privacidad a
        través de la página web del CECyTE en la dirección www.cecyte.edu.mx
      </p>
      <div className="text-center">
        <button className="btn btn-primary" onClick={acceptPrivacy}>
          Aceptar aviso
        </button>{" "}
        <button className="btn btn-danger" onClick={logout}>
          Rechazar
        </button>
      </div>
    </div>
  );
}
