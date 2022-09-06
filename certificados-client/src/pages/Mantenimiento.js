import React from "react";
import { Link } from "react-router-dom";

import imgError from "../icons/goberror.svg";

export default function Mantenimiento({ history }) {
  const goBack = () => {
    history.goBack();
  };
  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-7" style={{ marginTop: "2em" }}>
          <h2>Mantenimiento</h2>
          <h3>El sistema se encuentra bajo mantenimiento. Favor de intentar más tarde. Gracias</h3>
          <hr />
        </div>
        <div className="col-sm-4 col-sm-offset-1">
          <figure>
            <img className="img-responsive" src={imgError} alt="Página no encontrada" />
          </figure>
          <h3>Otras opciones:</h3>
          <ul>
            <li>
              <Link to="/">Regresar al inicio</Link>
            </li>
            <li>
              <a href="http://www.gob.mx/busqueda">Buscar en gob.mx</a>
            </li>
            <li>
              <a href="/#" onClick={goBack}>
                Volver a la página anterior
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
