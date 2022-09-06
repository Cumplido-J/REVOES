import React from "react";
import { Link } from "react-router-dom";

import imgError from "../icons/goberror.svg";

export default function NotFound({ history }) {
  const goBack = () => {
    history.goBack();
  };
  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-7">
          <h2>La página solicitada no se encuentra en este servidor</h2>
          <h3>Error 404</h3>
          <p>
            La página solicitada puede no estar disponible, haber cambiado de dirección (URL) o no existir. Con
            frecuencia es debido a algún error al escribir la dirección en la página (URL). Compruebe de nuevo si es
            correcta.
          </p>
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
