import React, { useEffect, useState } from "react";
import {Modal} from "antd";
import alerts from "../../shared/alerts";
import { Loading, Subtitle} from "../../shared/components";
import SurveyReportService from "../../service/SurveyReportService";

const colProps = {
  xs: { span: 24 },
  md: { span: 8 },
};
const rowProps = {
  style: { marginBottom: "1em" },
};
export default function SurveyShowAnswer({curp,setCurp,surveyType}){

    const [loading, setLoading] = useState(true);
    const [answerData, setAnswerData] = useState({});
    const [showModal, setShowModal] = useState(false);
    //const response="";
    useEffect(() => {
        const getAnswerData = async () => {
          setLoading(true);
          if(surveyType===1){
            //intencion 1
            const response = await SurveyReportService.getAnswerData1(curp);
            setAnswerData(response.answerData); 
          }
          else if(surveyType===2){
            //graduated 2
            const response = await SurveyReportService.getAnswerData2(curp);
            setAnswerData(response.answerData); 
          }
          else if(surveyType===3){
            //intencion 3
            const response = await SurveyReportService.getAnswerData3(curp);
            setAnswerData(response.answerData);  
          }
          else if(surveyType===4){
            //intencion 4
            const response = await SurveyReportService.getAnswerData4(curp);
            setAnswerData(response.answerData);  
          }
          //const response = await SurveyReportService.getAnswerData(curp,surveyType);
          setLoading(false);
          //if (!response.success) return;
          //setAnswerData(response.answerData);          
          setShowModal(true);
        };
        if (curp === null) {
          setAnswerData([]);
          setShowModal(false);
        } else {
          getAnswerData();
          //searchCareerData(cct);
        }
    }, [curp,surveyType]);

    return(
        <Modal
        onCancel={() => {
          setCurp(null);
        }}
        visible={showModal}
        width="65%"
        zIndex={1040}
        centered
        title={"Respuestas a la encuesta"}
        footer={null}
        >
            <Loading loading={loading}>
                <div className="row">
                    <Element name={"1. ??En qu?? frecuencia usas tus conocimientos y habilidades que adquiriste en el Bachillerato?"} value={answerData.q1}/>
                    <Element name={"2. ??Qu?? conocimientos t??cnicos consideras que te hicieron falta durante tu Bachillerato?"} value={answerData.q2}/>
                    <Element name={"3. ??Qu?? habilidades consideras que te hicieron falta durante tu Bachillerato?"} value={answerData.q3}/>
                    {(surveyType==1 || surveyType==3) &&(
                      <>
                        <Element name={"4. ??A qu?? actividad te incorporaras al egresar?"} value={answerData.q4}/>
                        <Element name={"5. ??Qu?? carrera deseas estudiar al egresar?"} value={answerData.q5}/>
                        <Element name={"6. ??Es una carrera af??n a tu bachillerato?"} value={answerData.q6}/>
                        <Element name={"7. ??Planeas emigrar de tu comunidad y/o Ciudad para estudiar?"} value={answerData.q7}/> 
                        <Element name={"8. ??Planeas emigrar de tu comunidad y/o Ciudad para trabajar?"} value={answerData.q8}/> 
                        <Element name={"9. ??Cu??l de estas frases describe mejor tu inter??s en trabajar?"} value={answerData.q9}/> 
                        <Element name={"10. ??Cu??les son las causas por las que planeas trabajar al concluir el Bachillerato?"} value={answerData.q10}/> 
                        <Element name={"11. ??Cu??l es la raz??n por la cu??l no te has decidido?"} value={answerData.q11}/>
                        <Element name={"12. ??C??mo calificas los servicios ofrecidos de tu plantel, por las ??reas de?"} value={""}/>  
                        <Element2 name={"Servicios Escolares"} value={answerData.q12}/>                  
                        <Element2 name={"Laboratorios"} value={answerData.q13}/> 
                        <Element2 name={"Talleres"} value={answerData.q14}/> 
                        <Element2 name={"Vinculaci??n"} value={answerData.q15}/> 
                        <Element2 name={"Docentes"} value={answerData.q16}/> 
                        <Element2 name={"??reas recreativas y deportivas"} value={answerData.q17}/> 
                        <Element2 name={"Personal administrativo"} value={answerData.q18}/> 
                        <Element2 name={"Personal directivo"} value={answerData.q19}/> 
                        <Element2 name={"Sanitarios"} value={answerData.q20}/> 
                        <Element2 name={"Aulas"} value={answerData.q21}/> 
                        <Element2 name={"Espacios para comer"} value={answerData.q22}/> 
                        {surveyType==3 &&(
                          <>
                          <Element2 name={"Eventos culturales"} value={answerData.q23}/> 
                          <Element2 name={"Eventos deportivos"} value={answerData.q24}/> 
                          <Element2 name={"Eventos tecnol??gicos"} value={answerData.q25}/> 
                          <Element2 name={"Eventos de emprendimiento"} value={answerData.q26}/> 
                          <Element name={"13. ??De tu experiencia en el plantel que fue lo que m??s te gusto?"} value={answerData.q27}/> 
                          <Element name={"14. ??De tu experiencia en el plantel que es lo que mejorar??as?"} value={answerData.q28}/>
                          </>
                        )} 
                      </>
                    )}
                    {(surveyType==2 || surveyType==4) &&(
                      <>
                        <Element name={"4. ??Actividad a la que te estas dedicando?"} value={answerData.q4}/>                   
                        <Element name={"5. Nombre de la Instituci??n donde estas estudiando actualmente"} value={answerData.q5}/>
                        <Element name={"6. Estado de la ubicaci??n de la Instituci??n donde estas estudiando"} value={answerData.q6}/>
                        <Element name={"7. ??Qu?? tipo de Instituci??n es?"} value={answerData.q7}/>
                        <Element name={"8. Nombre de la carrera en la que estas estudiando"} value={answerData.q8}/>
                        <Element name={"9. ??La carrera que estas estudiando actualmente es af??n a la que estudiaste en el Bachillerato?"} value={answerData.q9}/>
                        <Element name={"10. Nombre de la empresa donde est??s trabajando"} value={answerData.q10}/>
                        <Element name={"11. Giro de la empresa:"} value={answerData.q11}/>
                        <Element name={"12. ??Cu??l es tu puesto o la actividad principal que realizas en tu trabajo?"} value={answerData.q12}/>
                        <Element name={"13. Esta actividad o puesto ??tiene relaci??n con la carrera que estudiaste en el bachillerato?"} value={answerData.q13}/>
                        <Element name={"14. ??Cu??nto ganas aproximadamente mensualmente?"} value={answerData.q14}/>
                        <Element name={"15. ??Cu??les son las causas por las que actualmente no est??s estudiando o trabajando?"} value={answerData.q15}/>
                        <Element name={"16. Otra raz??n"} value={answerData.q16}/>
                    </>
                  )}                                       
                </div>
            </Loading>
        </Modal>        
    );
}
function Element({ name, value }) {
    return (
      <div className="form-group col-md-12">
        <label style={{ textAlign: "justify"}}>
          <strong>{name}</strong>
          <small style={{color:"#73CAF9"}}>&nbsp;{value}</small>
        </label>
      </div>
    );
  }
function Element2({ name, value }) {
    return (
      <div className="form-group col-md-4">
        <label>
          <strong>{name}:</strong>
          <small style={{color:"#73CAF9",fontsize:"8pt"}}>&nbsp;{value}</small>
        </label>
      </div>  
    );
  }  