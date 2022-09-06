package mx.edu.cecyte.sisec.shared;

public class AppCatalogs {

    public static final Integer ROLE_DEV = 1;
    public static final Integer ROLE_STUDENT = 3;
    public static final Integer ROLE_TRACING_ADMIN = 4;
    public static final Integer ROLE_SCHOOL_CONTROL = 5;
    public static final Integer ROLE_CERTIFICATION_ADMIN = 6;
    public static final Integer ROLE_TITULACION_ADMIN = 8;
    public static final Integer ROLE_PLANNING_ADMIN = 7;

    public static final Integer SCHOOLTYPE_CECYTE = 18;
    public static final Integer SCHOOLTYPE_EMSAD = 19;

    public static final Integer CERTIFICATETYPE_ENDING = 1;
    public static final Integer CERTIFICATETYPE_PARTIAL = 2;
    public static final Integer CERTIFICATETYPE_ABROGATED = 3;


    public static final String TEMPORAL_PASSWORD = "temporal";

    public static final String firstSemesterCareerKey = "COMP_BASI";

    public static final String nombreSEN = "Sistema Educativo Nacional de México";
    public static final String nombreDependencia = "Subsecretaría de Educación Media Superior";
    public static final Integer TIPOIEMS_DESCENTRALIZADO = 5;
    public static final Integer GENERO_EL = 1;
    public static final Integer GENERO_LA = 2;
    public static final Integer SOSTENIMIENTO_PUBLICO = 1;
    public static final Integer NIVELESTUDIOS_BACHILLERATO = 2;
    public static final Integer TIPOCERTIFICADO_TERMINO = 1;

    public static final Integer ADMINTYPE_CERTIFICATION = 1;
    public static final Integer ADMINTYPE_SCHOOLCONTROL = 2;
    public static final Integer ADMINTYPE_TRACING = 3;
    public static final Integer ADMINTYPE_DEV = 4;
    public static final Integer ADMINTYPE_TITULACION = 5;

    public static final Integer[] actualEndingCertificateStates = {1,2,3, 4,5, 7,8, 10,11,12,13, 14, 15,16, 17, 18, 19,20, 21,22,23,24, 25,26, 27, 28, 29, 30,31,32 };
    public static final Integer[] actualAbrogatedCertificateStates = {1,2,3, 4,5, 7,8, 10,11,12,13, 14, 15,16, 17, 18, 19,20, 21,22,23,24, 25,26, 27, 28, 29, 30,31,32 };

    public static final Integer CERTIFICATESEARCH_VALIDATE = 1;
    public static final Integer CERTIFICATESEARCH_UPLOAD = 2;
    public static final Integer CERTIFICATESEARCH_QUERY = 3;

    public static final Integer DEGREESEARCH_VALIDATE = 1;
    public static final Integer DEGREESEARCH_UPLOAD = 2;

    public static final Integer SURVEY_INTENTIONS2020 = 1;
    public static final Integer SURVEY_GRADUATED2020 = 2;
    public static final Integer SURVEY_INTENTIONS2021 = 3;
    public static final Integer SURVEY_GRADUATED2021 = 4;
    public static final Integer SURVEY_INTENTIONS2022 = 5;
    public static final Integer SURVEY_GRADUATED2022 = 6;

    public static final int TIPOPERIODO_SEMESTRAL = 1;

    public static final Integer BCS_ROLE_DEV=13;
    public static final Integer BCS_ROLE_DIRECCION=14;
    public static final Integer BCS_ROLE_SEGUIMIENTO_ESTATAL=16;
    public static final Integer BCS_ROLE_SEGUIMIENTO_PLANTEL=17;
    public static final Integer BCS_ROLE_CONTROL_ESCOLAR_ESTATAL=18;
    public static final Integer BCS_ROLE_CONTROL_ESCOLAR_PLANTEL=19;
    public static final Integer BCS_ROLE_CERTIFICACION=20;
    public static final Integer BCS_ROLE_CONTROL_ESCOLAR_ESTATAL_SISEC=22;
    public static final Integer BCS_ROLE_CONTROL_ESCOLAR_PLANTEL_SISEC=23;
    public static final Integer BCS_ROLE_TITULACION = 25;

    public static final Integer CHECK_NIVEL_ESTATAL = 1;
    public static final Integer CHECK_NIVEL_PLANTEL = 2;

    public static final Integer CATALOG_DOMINIO_VALIDATION_ESTATAL = 1;
    public static final Integer CATALOG_CERTIFY_ESTATAL = 2;
    public static final Integer CATALOG_SCHOOL_CONTROL_DOMINIO_VALIDATION_ESTATAL = 3;
    public static final Integer CATALOG_DIRECTOR_ESTATAL = 4;
    public static final Integer CATALOG_DEGREE_ESTATAL = 5;

    public static final Integer CATALOG_DOMINIO_VALIDATION_PLANTEL = 1;
    public static final Integer CATALOG_SCHOOL_CONTROL_DOMINIO_VALIDATION_PLANTEL = 2;

    public static final boolean isState = true;
    public static final boolean isSchool = false;

    public static final int TYPE_CERTIFICATE_ENDING_TEST= 5;
    public static final int TYPE_CERTIFICATE_PARTIAL_TEST= 6;
    public static final int TYPE_CERTIFICATE_ENDING= 1;
    public static final int TYPE_CERTIFICATE_PARTIAL= 2;
}
