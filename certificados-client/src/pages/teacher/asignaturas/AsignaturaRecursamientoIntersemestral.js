import React, { useState, useEffect } from "react";
import TitleBar from "../../../components/TitleBar";
import Breadcrumb from "../../../components/BreadCrumb";
import { useSelector, useDispatch } from "react-redux";
import { setAsignaturaView } from "../../../reducers/asignaturasDocente/actions/setAsignaturaView";
import {
  getSubjectRecursamientoIntersemestral
} from "../../../service/TeacherAsignaturaService";
import { useHistory } from "react-router-dom";
import { setTeacherId } from "../../../reducers/teachers/actions/setTeacherView";
import CapturaCalificacionesRecursamiento from "../capturaCalificacionesRecursamiento/TableCapturaRecursamiento";
import { Loading } from "../../../shared/components";

export default ({ match }) => {

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const [docenteAsignatura, setDocenteAsignatura] = useState([]);
  const teacherId = useSelector(
    (store) => store.teachersReducer.teacherId
  );

  const docenteAsignaturaId = useSelector(
    (store) => store.asignaturasDocenteReducer.docenteAsignaturaId
  );

  const breadCrumbLinks = [
    {
      text: "Docentes",
      path: "/Docentes"
    },
    {
      text: "Información",
      path: `/Docentes/Editar/${teacherId}`
    },
    {
      text: "Captura calificaciones",
      path: false
    }
  ];

  const getData = async (docenteAsignaturaId) => {
    setLoading(true);
    const docenteAsignaturaApi = await getSubjectRecursamientoIntersemestral(docenteAsignaturaId);
    if (docenteAsignaturaApi.success) {
      const docenteAsignaturaDetails = docenteAsignaturaApi.teacherAsignatura.data;
      setDocenteAsignatura(docenteAsignaturaDetails);
      /* guardar estado del docente */
      dispatch(setTeacherId(docenteAsignaturaDetails.plantilla_docente.docente_id));
    } else {
      history.push("/NotFound");
    }
    setLoading(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0); //up scroll automatic
    /* get información */
    getData(match.params.docenteAsignaturaId);
    /* guardar estado de la asignatura */
    dispatch(setAsignaturaView(match.params.docenteAsignaturaId));
    /* en caso de que se acceda directamente con la ruta */
    if (!teacherId) {
      /* guardar estado del docente */
      dispatch(setTeacherId(teacherId));
    }
  }, []);

  return (
    <>
      <Loading loading={loading}>
        <Breadcrumb links={breadCrumbLinks} />
        <TitleBar>Captura De Calificaciones Recursamiento Intersemestral</TitleBar>
        <CapturaCalificacionesRecursamiento docenteAsignatura={docenteAsignatura} onSave={() => getData(match.params.docenteAsignaturaId)} tipoRecursamiento={2} />
      </Loading>
    </>
  );
};
