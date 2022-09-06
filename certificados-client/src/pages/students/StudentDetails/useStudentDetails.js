import React, { useEffect, useState } from "react";
import StudentService from "../../../service/StudentService";
import moment from "moment";

const useStudentDetails = (curp) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    administrativeData: [],
    schoolData: [],
    studentData: [],
    medicalData: [],
    tutorsContactData: [],
  });
  const setUp = async (studentCurp) => {
    setLoading(true);
    // Get student data
    const studentDataResponse = await StudentService.getStudentByCurp(
      studentCurp
    );
    if (studentDataResponse?.success) {
      parseServiceToData(studentDataResponse.student);
    }
    setLoading(false);
  };
  const parseServiceToData = (studentData) => {
    let dataArrays = {
      administrativeData: [
        {
          title: "Tipo de alumno",
          value: studentData?.tipo_alumno,
        },
        {
          title: "Tipo trayectoria",
          value: studentData?.tipo_trayectoria,
        },
        {
          title: "Se permite inscripción a grupo",
          value: studentData?.permitir_inscripcion === "Permitir" ? "Si" : "No",
        },
        {
          title: "Es cambio de carrera",
          value: studentData?.cambio_carrera ? "Si" : "No",
        },
        {
          title: "Estatus de inscripción",
          value: studentData.estatus_inscripcion,
        },
        {
          title: "Periodo inicio",
          value: studentData?.periodo_inicio,
        },
        {
          title: "Periodo fin",
          value: studentData?.periodo_termino,
        },
        {
          title: "Generación",
          value: studentData?.generacion,
        },
      ],
      schoolData: [
        {
          title: "Estado",
          value: studentData?.plantel?.municipio?.estado?.nombre,
        },
        {
          title: "Plantel",
          value: `${studentData?.plantel?.cct}-${studentData?.plantel?.nombre}`,
        },
        {
          title: "Carrera",
          value: `${studentData?.carrera?.clave_carrera}-${studentData?.carrera?.nombre}`,
        },
        {
          title: "Semestre",
          value: studentData?.semestre,
        },
        {
          title: "Matrícula",
          value: studentData?.matricula,
        },
        {
          title: "Documentos",
          value:
            Array.isArray(studentData?.documentos) &&
            studentData?.documentos.length > 0
              ? studentData?.documentos.map(({ nombre }) => nombre).join(", ")
              : null,
        },
        {
          title: "Estatus de la documentación",
          value: studentData?.estatus,
        },
      ],
      studentData: [
        {
          title: "Nombre",
          value: studentData?.usuario?.nombre,
        },
        {
          title: "Primer apellido",
          value: studentData?.usuario?.primer_apellido,
        },
        {
          title: "Segundo apellido",
          value: studentData?.usuario?.segundo_apellido,
        },
        {
          title: "País de nacimiento",
          value: studentData?.expediente?.pais_nacimiento,
        },
        {
          title: "Estado de nacimiento",
          value:	studentData?.expediente?.estado_nacimiento?.nombre,
        },
        {
          title: "Municipio de nacimiento",
          value: studentData?.expediente?.municipio_nacimiento?.nombre,
        },
        {
          title: "Código postal del lugar de nacimiento",
          value: studentData?.expediente?.codigo_postal_nacimiento,
        },
        {
          title: "Fecha de nacimiento",
          value: studentData?.expediente?.fecha_nacimiento,
        },
        {
          title: "CURP",
          value: studentData?.usuario?.username,
        },
        {
          title: "Sexo",
          value: studentData?.genero,
        },
        {
          title: "Correo electrónico",
          value: studentData?.usuario?.email,
        },
        {
          title: "Teléfono móvil",
          value: studentData?.usuario?.numero_movil,
        },
        {
          title: "Dirección",
          value: studentData?.direccion,
        },
        {
          title: "Código postal",
          value: studentData?.codigo_postal,
        },
      ],
      medicalData: [
        {
          title: "Institución médica",
          value: studentData?.expediente?.institucion,
        },
        {
          title: "Número de seguro social",
          value: studentData?.expediente?.nss,
        },
        {
          title: "Tipo de sangre",
          value: studentData?.expediente?.tipo_sangre,
        },
      ],
    };
    // Filter data
    Object.keys(dataArrays).forEach((key) => {
      dataArrays[key] = dataArrays[key].filter(
        ({ value }) => value !== undefined && value !== null
      );
    });
    dataArrays.tutorsContactData = studentData.tutores;
    setData(dataArrays);
  };
  useEffect(() => {
    setUp(curp);
  }, []);

  return [loading, data];
};

export default useStudentDetails;
