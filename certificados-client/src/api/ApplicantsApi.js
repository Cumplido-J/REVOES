import apicall from "../shared/apicall";

const controllerPhp = "aspirantes";
const ApplicantsApi = {
  /**
   *
   * @param {number|undefined} state
   * @param {number|undefined} school
   * @param {string|undefined} cadena
   * @returns {Promise<{success: boolean, data: any}>}
   */
  getApplicants: async ({ state, school, searchText }) => {
    let response = { success: true };
    let data = {
      estado_id: state,
      plantel_id: school,
    };
    if (searchText) data.cadena = searchText;
    try {
      const apiResponse = await apicall.post(
        controllerPhp,
        "filtrar",
        data,
        true
      );
      if (apiResponse?.data?.data) {
        response.data = apiResponse.data.data;
      }
    } catch (exception) {
      response = apicall.handleCatch(exception);
      response.data = [];
    }
    return response;
  },
  getApplicantById: async ({ id }) => {
    let response = { success: true };
    try {
      const apiResponse = await apicall.get(controllerPhp, id, true);
      if (apiResponse?.data?.data) {
        response.data = apiResponse.data.data;
      }
    } catch (e) {
      response = apicall.handleCatch(e);
    }
    return response;
  },
  deleteApplicantById: async ({ id }) => {
    let response = { success: true };
    try {
      const apiResponse = await apicall.delete(controllerPhp, id, true);
      if (apiResponse?.data?.data) {
        response.data = apiResponse.data.data;
      }
    } catch (e) {
      response = apicall.handleCatch(e);
    }
    return response;
  },
  creatApplicant: async ({
    name,
    firstLastName,
    secondLastName,
    curp,
    schoolId,
    careerId,
    phone,
    email,
    birthday,
    dio_alta = "Control escolar",
    estatus_pago,
    domicilio,
    sincronizado = 0,
  }) => {
    let response = { success: true };
    const data = {};
    if (name) data.nombre = name;
    if (firstLastName) data.primer_apellido = firstLastName;
    if (curp) data.curp = curp;
    if (schoolId) data.plantel_id = schoolId;
    if (careerId) data.carrera_id = careerId;
    if (secondLastName) data.segundo_apellido = secondLastName;
    if (phone) data.telefono = phone;
    if (email) data.correo = email;
    if (birthday) data.fecha_nacimiento = birthday;
    if (dio_alta) data.dio_alta = dio_alta;
    if (estatus_pago) data.estatus_pago = estatus_pago;
    if (domicilio) data.domicilio = domicilio;
    if (sincronizado || sincronizado === 0) data.sincronizado = sincronizado;
    try {
      const apiResponse = await apicall.post(controllerPhp, "", data, true);
      if (apiResponse?.data?.data) {
        response.data = apiResponse.data.data;
      }
    } catch (exception) {
      response = apicall.handleCatch(exception);
      response.data = [];
    }
    return response;
  },
  getDateConfigApplicant: async ( id ) => {
    let response = { success: true };
    try {
      const apiResponse = await apicall.get(
        controllerPhp,
        `configurar/${id}`,
        //"",
        true
      );
      if (apiResponse?.data) {
        response.data = apiResponse.data?.data;
      }
    } catch (exception) {
      response = apicall.handleCatch(exception);
      response.data = [];
    }
    return response;
  },
  dateConfigApplicant: async ({ plantel_id, fecha_inicio, fecha_fin, fecha_examen }) => {
    let response = { success: true };
    const data = {};
    if (plantel_id) data.plantel_id = plantel_id;
    if (fecha_inicio) data.fecha_inicio = fecha_inicio;
    if (fecha_fin) data.fecha_fin = fecha_fin;
    if (fecha_examen || fecha_examen === 0) data.fecha_examen = fecha_examen;
    try {
      const apiResponse = await apicall.post(controllerPhp, "configurar", data, true);
      if (apiResponse?.data) {
        response.data = apiResponse.data;
      }
    } catch (exception) { 
      response = apicall.handleCatch(exception);
      response.data = [];
    }
    return response;
  },
  editApplicant: async (
    {
      name,
      firstLastName,
      secondLastName,
      curp,
      schoolId,
      careerId,
      phone,
      email,
      birthday,
      estatus_pago,
      domicilio,
    },
    applicantId
  ) => {
    let response = { success: true };
    const data = {};
    if (name) data.nombre = name;
    if (firstLastName) data.primer_apellido = firstLastName;
    if (curp) data.curp = curp;
    if (schoolId) data.plantel_id = schoolId;
    if (careerId) data.carrera_id = careerId;
    if (secondLastName) data.segundo_apellido = secondLastName;
    if (phone) data.telefono = phone;
    if (email) data.correo = email;
    if (birthday) data.fecha_nacimiento = birthday;
    if (estatus_pago) data.estatus_pago = estatus_pago;
    if (domicilio) data.domicilio = domicilio;
    try {
      const apiResponse = await apicall.put(
        controllerPhp,
        applicantId,
        data,
        true
      );
      if (apiResponse?.data?.data) {
        response.data = apiResponse.data.data;
      }
    } catch (exception) {
      response = apicall.handleCatch(exception);
      response.data = [];
    }
    return response;
  },
  printReceipt: async (applicantId) => {
    let response = { success: true };
    try {
      const apiResponse = await apicall.get(
        controllerPhp,
        `comprobante/${applicantId}`,
        true,
        {
          responseType: "blob",
          "Content-Type": "application/pdf",
        }
      );
      response.data = apiResponse.data;
    } catch (e) {
      response = apicall.handleCatchBlob(e);
    }
    return response;
  },
  printSearchEnrollmentReport: async (data) => {
    let response = { success: true };
    try {
      const apiResponse = await apicall.post(
        "reportes/aspirantes",
        "",
        data,
        true,
        {
          responseType: "blob",
        }
      );
      response.data = apiResponse.data;
    } catch (e) {
      response = apicall.handleCatchBlob(e);
    }
    return response;
  },
};
export default ApplicantsApi;
