import ApiCall from "../shared/apicall";
import "moment/locale/es";

const controller = "adminList";
export default {
  userSearch: async ({ adminTypeId, stateId, schoolId, username }) => {
    console.log(username)
    if (!adminTypeId) adminTypeId = 0;
    if (!stateId) stateId = 0;
    if (!schoolId) schoolId = 0;
    if (!username) username = "";
    /*if (!checkAdminNivel)checkAdminNivel = 0;
    if (!adminSchoolId)adminSchoolId = 0;
    if (!superUserId)superUserId = 0;*/

    let response = { success: true };

    const method = `selectListUser?adminTypeId=${adminTypeId}&stateId=${stateId}&schoolId=${schoolId}&username=${username}`;//&checkAdminNivel=${checkAdminNivel}&adminSchoolId=${adminSchoolId}&superUserId=${superUserId}`;

    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.userList = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.userList = [];
    }
    return response;
  },
  getUserData: async (username) => {
    if (!username) username = "";
    let response = { success: true };

    const method = `${username}`;
    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.userData = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.userData = {};
    }
    return response;
  },
  addUser: async (form) => {
    if (!form) form = {};
    if (!form.cargoId) form.cargoId = 0;
    if (!form.cargoIdTitulo) form.cargoIdTitulo = 0;

    let response = { success: true };

    const method = `addNewUser`;
    try {
      const apiResponse = await ApiCall.post(controller, method, form);
      response.userData = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  editUser: async (username, form) => {
    if (!form) form = {};
    if (!form.username) form.username = null;
    if (!form.name) form.name = null;
    if (!form.firstLastName) form.firstLastName = null;
    if (!form.secondLastName) form.secondLastName = null;
    if (!form) form = {};
    if (!form.id) form.id = null;
    if (!form.username) form.username = null;
    if (!form.name) form.name = null;
    if (!form.firstLastName) form.firstLastName = null;
    if (!form.secondLastName) form.secondLastName = null;
    if (!form.email) form.email = null;
    if (!form.statusId) form.statusId = null;
    if (!form.stateId) form.stateId = null;
    if (!form.schoolId) form.schoolId = null;
    if (!form.roleId) form.roleId = null;
    if (!form.cargoId) form.cargoId = null;
    if (!form.adminSchoolId) form.adminSchoolId = null;
    if (!form.superUserId) form.superUserId = null;
    if (!form.checkAdminNivel) form.checkAdminNivel = null;
    if (!form.cargoIdTitulo) form.cargoIdTitulo = 0;
    if (!form.rfc) form.rfc = null;
    if (!form.sexo) form.sexo = null;
    let response = { success: true };

    const method = `edit/${username}`;
    try {
      const apiResponse = await ApiCall.post(controller, method, form);
      response.userData = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  editUserPassword: async (username, form) => {
    if (!username) username = "";
    if (!form) form = {};
    if (!form.password) form.password = null;

    let response = { success: true };

    const method = `password/${username}`;

    try {
      const apiResponse = await ApiCall.post(controller, method, form);
      response.userData = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  addGroup: async (form) => {
    if (!form) form = {};
    let response = { success: true };

    const method = `addGroup`;
    try {
      const apiResponse = await ApiCall.post(controller, method, form);
      response.catalog = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },

  getGroupData: async (id) => {
    if (!id) id = "";
    let response = { success: true };

    const method = `findByGroup/${id}`;
    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.groupData = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.groupData = {};
    }
    return response;
  },

  updateGroup: async (form) => {
    if (!form) form = {};
    //if (!form.id) form.id = null;
    let response = { success: true };

    const method = `updateGroup`;
    try {
      const apiResponse = await ApiCall.post(controller, method, form);
      response.catalog = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },

  deleteGroup: async (form) => {
    if (!form) form = {};
    let response = { success: true };

    const method = `deleteGroup`;
    try {
      const apiResponse = await ApiCall.post(controller, method, form);
      response.catalog = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  addPermission: async (form) => {
    if (!form) form = {};
    let response = { success: true };

    const method = `addPermission`;
    try {
      const apiResponse = await ApiCall.post(controller, method, form);
      response.catalog = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },

  getPermissionData: async (id) => {
    if (!id) id = "";
    let response = { success: true };

    const method = `findByPermission/${id}`;
    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.permissionData = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.permissionData = {};
    }
    return response;
  },

  updatePermission: async (form) => {
    if (!form) form = {};
    //if (!form.id) form.id = null;
    let response = { success: true };

    const method = `updatePermission`;
    try {
      const apiResponse = await ApiCall.post(controller, method, form);
      response.catalog = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },

  deletePermission: async (form) => {
    if (!form) form = {};
    let response = { success: true };

    const method = `deletePermission`;
    try {
      const apiResponse = await ApiCall.post(controller, method, form);
      response.catalog = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },

  getfindByPermissionNotAssignedToGroup: async (id) => {
    if (!id) id = "";
    let response = { success: true };

    const method = `findByPermissionNotAssignedToGroup/${id}`;
    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.permissionData = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.permissionData = {};
    }
    return response;
  },
  addPermissionTheGroup: async (form) => {
    if (!form) form = {};
    if (!form.idGroup) form.idGroup = {};
    if (!form.idPermission) form.idPermission = [];
    let response = { success: true };

    const method = `addPermissionTheGroup`;
    try {
      const apiResponse = await ApiCall.post(controller, method,form);
      response.message = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  removePermissionTheGroup: async (form) => {
    if (!form) form = {};
    if (!form.idGroup) form.idGroup = {};
    if (!form.idPermission) form.idPermission = [];
    let response = { success: true };

    const method = `removePermissionTheGroup`;
    try {
      const apiResponse = await ApiCall.post(controller, method,form);
      response.message = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  findByPermissionOfGroup: async (id) => {
    if (!id) id = "";
    let response = { success: true };

    const method = `findByPermissionOfGroup/${id}`;
    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.permissionData = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.permissionData = {};
    }
    return response;
  },
  SuggestionGroupAndPermiissionData: async (form) => {
   
    let response = { success: true };

    const method = `getSuggestionGroupAndPermissionData`;
    try {
      const apiResponse = await ApiCall.post(controller, method,form);
      response.suggestionData = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.suggestionData = {};
    }
    return response;
  },

  getAllScope: async () => {
    let response = { success: true };

    const method = `getAllScope`;
    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.scope = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.scope = {};
    }
    return response;
  },
  getAllScopeDetailByIdUserScope: async (id) => {
    if (!id) id = "";
    let response = { success: true };

    const method = `getAllScopeDetailByIdUserScope/${id}`;
    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.scopeData = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.scopeData = {};
    }
    return response;
  },

  getAllScopeDescription: async () => {
    let response = { success: true };

    const method = `getAllScopeDescription`;
    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.scope = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.scope = {};
    }
    return response;
  },
  getAllScopeDetail: async () => {
    let response = { success: true };

    const method = `getAllScopeDetail`;
    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.scope = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.scope = {};
    }
    return response;
  },
  addNewCatScope: async (form) => {
    if (!form) form = {};
    let response = { success: true };

    const method = `addNewCatScope`;
    try {
      const apiResponse = await ApiCall.post(controller, method, form);
      response.catalog = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  editCatScope: async (form) => {
    if (!form) form = {};
    let response = { success: true };

    const method = `editCatScope`;
    try {
      const apiResponse = await ApiCall.post(controller, method, form);
      response.catalog = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  getByIdCatScope: async (id) => {
    if (!id) id = "";
    let response = { success: true };

    const method = `getByIdCatScope/${id}`;
    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.scopeData = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.scopeData = {};
    }
    return response;
  },
  deleteCatScope: async (form) => {
    if (!form) form = {};
    let response = { success: true };

    const method = `deleteCatScope`;
    try {
      const apiResponse = await ApiCall.post(controller, method, form);
      response.catalog = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  addNewScope: async (form) => {
    if (!form) form = {};
    if (!form.schoolId) form.schoolId = 0;
    let response = { success: true };

    const method = `addNewScope`;
    try {
      const apiResponse = await ApiCall.post(controller, method, form);
      response.catalog = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  getByIdScope: async (id) => {
   
    let response = { success: true };

    const method = `getByIdScope/${id}`;
    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.scopeData = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.scopeData = {};
    }
    return response;
  },
  updateScope: async (form) => {
    if (!form) form = {};
    if (!form.schoolId) form.schoolId = 0;
    let response = { success: true };

    const method = `updateScope`;
    try {
      const apiResponse = await ApiCall.post(controller, method, form);
      response.catalog = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  deleteScope: async (form) => {
    if (!form) form = {};
    let response = { success: true };

    const method = `deleteScope`;
    try {
      const apiResponse = await ApiCall.post(controller, method, form);
      response.catalog = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  findByPermissionNotAssignedToScope: async (id) => {
   
    let response = { success: true };

    const method = `findByPermissionNotAssignedToScope/${id}`;
    try {
      const apiResponse = await ApiCall.get(controller, method);
      response.scopeData = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
      response.scopeData = {};
    }
    return response;
  },
  addPermissionTheScope: async (form) => {
    if (!form) form = {};
    if (!form.idGroup) form.idGroup = {};
    if (!form.idPermission) form.idPermission = [];
    let response = { success: true };

    const method = `addPermissionTheScope`;
    try {
      const apiResponse = await ApiCall.post(controller, method,form);
      response.message = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
  removePermissionTheScope: async (form) => {
    if (!form) form = {};
    if (!form.idGroup) form.idGroup = {};
    if (!form.idPermission) form.idPermission = [];
    let response = { success: true };

    const method = `removePermissionTheScope`;
    try {
      const apiResponse = await ApiCall.post(controller, method,form);
      response.message = apiResponse.data;
    } catch (error) {
      response = ApiCall.handleCatch(error);
    }
    return response;
  },
};
