package mx.edu.cecyte.sisec.shared;

public class Messages {
    public final static String user_wrongUsername = "Usuario no existe. Favor de intentar nuevamente.";
    public final static String user_wrongPassword = "Contraseña incorrecta. Favor de intentar nuevamente.";
    public final static String user_usernameIsInUse = "Esta curp le pertenece a otro usuario.";

    public final static String cryptography_fielWrongPassword = "La contraseña de la FIEL es incorrecta.";
    public final static String cryptography_fielError = "Favor de verificar la FIEL.";
    public final static String cryptography_fielWrongCer = "Su certificado .cer es incorrecto.";

    public final static String student_doesntExist = "No existe un alumno con esta curp.";

    public final static String decParser_xmlError = "Ocurrio un error al generar el xml.";
    public final static String degreeParser_error = "Ocurrio un error al generar el xml.";

    public final static String pdfResource_fileNotFound = "No se ha podido encontrar el recurso para el PDF.";

    public final static String student_noEditPermissions = "No tienes permiso de editar este alumno.";
    public final static String state_noEditPermissions = "No tienes permisos en este estado";

    public final static String school_noEditPermissions = "No tienes permisos en este plantel.";
    public final static String school_doesntExist = "No existe un plantel con este CCT.";
    public final static String school_cctIsInUse = "Este cct le pertenece a otro plantel.";
    public final static String school_idIsInUse = "El plantel ya cuenta con equivalencia.";

    public final static String dev_cantReadFile = "Ha ocurrido un error al leer los archivos.";

    public final static String database_cantFindResource = "Ha ocurrido un error en la base de datos.";
    public final static String siged_cantConnect = "No se ha podido establecer conexión con el servior de SIGED.";
    public final static String mec_cantReadExcel = "Ha ocurrido un error al leer la respuesta del webservice MEC.";

    public final static String file_cantWrite = "Ha ocurrido un error al guardar un archivo en el servidor.";
    public final static String file_cantCompress = "Ha ocurrido un error al comprimir los archivos a .ZIP.";
    public final static String file_cantDecompress = "Ha ocurrido un error al descomprimir los archivos del .ZIP.";
    public final static String file_cantRead = "Ha ocurrido un error al buscar el XML en el servidor.";

    public final static String survey_alreadyAnswered = "Ya has contestado esta encuesta previamente. Gracias.";
    public final static String survey_thankYou = "Gracias por contestar la encuesta.";

    public final static String appFunctions_xmlDateWrongFormat = "Error en la fecha de timbrado.";
    public final static String dev_parseDate = "Error al parsear la fecha.";
    public final static String dev_noPermissions = "No tienes permiso de realizar esta acción";
    public final static String adminSearch_incorrectAdminType = "Se ha seleccionado un tipo de usuario incorrecto.";
    public final static String schoolCareer_wrongId = "Favor de elegir una carrera correcta";
    public final static String student_hasSchoolCareer = "Ya tienes una carrera asignada.";
    public final static String certificate_cantReadXml = "No se ha encontrado el XML del certificado.";
    public final static String user_notCertificationAdmin = "No tienes permiso para certificar alumnos.";
    public final static String mec_noServerConnection = "No se ha logrado la comunicación con el servidor de certificación, favor de intentar nuevamente";

    public final static String pdfdownload_high = "Puedes descargar máximo 150 pdfs al mismo tiempo";
    public final static String school_doesntHavePdfName = "El plantel no tiene asignado un nombre de plantel, favor de verificar.";
    
    public final static String persona_doesntExist = "No existe este Id en la base de datos.";
    public final static String persona_Exite = "Esta persona ya existe.";
    public final static String persona_curpdoesntExist = "No existe firmante con esta curp";
    public final static String persona_curpIsInUse = "Este curp le pertenece a otra persona.";
    public final static String cantFindResourceState = "Estado no encontrado por falta de permisos";
    public final static String cantFindResourceSchool = "Plantel no encontrado por falta de permisos";
    public final static String cantFindResourceMec = "Mec no encontrado";
    public final static String cantFindResourceMet = "Met no encontrado";

    public final static String nameIsInUse = "Este nombre le pertenece a otro registro.";
    public final static String registrationIsNotExist = "Registro no encontrado.";
    public final static String isExistAssociation = "Registro con asociaciones.";
    public final static String  recordInUse= "Existe un registro identico.";
}
