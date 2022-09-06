import CareerApi from "../api/CareerApi";
import LectureApi from "../api/LectureApi";
import Alerts from "../shared/alerts";

export default {
addCareer: async (form) => {
    const response = await CareerApi.addCareer(form);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  careerAll: async () => {
    const response = await CareerApi.careerAll();
    if (!response.success)
      Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },   
  careerSearch: async (values) => {
    const response = await CareerApi.careerSearch(values);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  getCareerData: async (careerKey) => {
    const response = await CareerApi.getCareerData(careerKey);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  editCareer: async (careerKey, form) => {
    const response = await CareerApi.editCareer(careerKey, form);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },
  addModule:async(career,form)=>{
    const response=await CareerApi.addModule(career,form);
    if(!response.success)Alerts.error("Ha ocurrido un error",response.message);
    return response;
  }, 
  getCareerModuleData:async(idcareerModule)=>{
    const response = await CareerApi.getCareerModuleData(idcareerModule);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;    
  },  
  editCareerModule: async (idcareerModule,career, form) => {
    const response = await CareerApi.editCareerModule(idcareerModule,career, form);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  }, 
  deleteCompetences: async (values) => {
    const response = await CareerApi.deleteCompetences(values);
    if (!response.success) Alerts.error("Ha ocurrido un error", response.message);
    return response;
  },   
  ///////////////////////////////////////////////////
  //////////para pestaña materia
  //////////////////////////////////////////////////
  getLecturesByCareer: async (id) => {
    const response = await LectureApi.getLecturesByCareer(id);
    if (!response.success)
      Alerts.error("Ha ocurrido un error en getLecturesByCareer", response.message);
    return response;
  },
  getLecturesByCareer_UAC: async (busqueda, id) => {
    const response = await LectureApi.getLecturesByCareer_UAC(busqueda, id);
    if (!response.success)
      Alerts.error("Ha ocurrido un error en getLecturesByCareer_UAC", response.message);
    return response;
  },
  deleteLectureAssociationByCU_Id: async (id) => {
    console.log("en service deleteLectureAssociationByCU_Id:"+id);
    const response = await  LectureApi.deleteLectureAssociationByCU_Id(id);
    if (!response.success)
      Alerts.error("Ha ocurrido un error deleteLectureAssociationByCU_Id", response.message);
    return response;
  },
  getLectureById: async (id) => {
    const response = await  LectureApi.getLectureById(id);
    if (!response.success)
      Alerts.error("Ha ocurrido un error en getLectureById", response.message);
    return response;
  },
  updateLectureById: async (id,form) => {
    console.log("en service deleteLectureAssociationByCU_Id:"+"(id:"+id+",form:"+form);
    const response = await  LectureApi.updateLectureById(id,form);
    if (!response.success)
      Alerts.error("Ha ocurrido un error updateLectureById", response.message);
    return response;
  },
  getLecturesNotInCarrer: async (busqueda, id) => {
    const response = await  LectureApi.getLecturesNotInCarrer(busqueda, id);
    if (!response.success)
      Alerts.error("Ha ocurrido un error en getLecturesNotInCarrer", response.message);
    return response;
  },
  insertLectureCareerAssociation: async (form) => {
    console.log("en service insertLectureCareerAssociation:"+"(form:"+form);
    const response = await  LectureApi.insertLectureCareerAssociation(form);
    if (!response.success)
      Alerts.error("Ha ocurrido un error insertLectureCareerAssociation", response.message);
    return response;
  },
  insertLecture: async (id,form) => {
    console.log("en service insertLecture:"+"(idcareer:"+id+",form:"+form);
    const response = await  LectureApi.insertLecture(id,form);
    if (!response.success)
      Alerts.error("Ha ocurrido un error insertLecture", response.message);
    return response;
  },  
  
}