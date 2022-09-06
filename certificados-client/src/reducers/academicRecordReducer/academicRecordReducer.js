import { SET_ACADEMIC_RECORD_LIST } from "./actions/setAcademicRecordList";
import { SET_SEMESTERS_STUDENT_LIST } from "./actions/setSemestersStudent";

const initialState = {
  academicRecordList: [],
  semestersStudentList: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_ACADEMIC_RECORD_LIST:
      let academicRecord = [];
      action.data.calificacion_uac.forEach(x => {
        if (!(x.carrera_uac?.semestre in academicRecord)) {
          academicRecord[x.carrera_uac?.semestre] = action.data.calificacion_uac.filter(e => e.carrera_uac?.semestre === x.carrera_uac?.semestre);
        }
      });
      academicRecord.map((p, index) => {
        let tempArray = p;
        academicRecord[index] = [];
        tempArray.map(q => {
          if (!(q.carrera_uac?.uac?.nombre in tempArray)) {
            const arrayGrades = tempArray.filter(e => e.carrera_uac?.uac?.nombre === q.carrera_uac?.uac?.nombre);
            const parcial_1 = arrayGrades.filter(p => p.parcial === "1" && p.tipo_calif !== "RS");
            const parcial_2 = arrayGrades.filter(p => p.parcial === "2" && p.tipo_calif !== "RS");
            const parcial_3 = arrayGrades.filter(p => p.parcial === "3" && p.tipo_calif !== "RS");
            const parcial_4 = arrayGrades.filter(p => p.parcial === "4");
            const parcial_5 = arrayGrades.filter(p => p.parcial === "5");
            const parcial_6 = arrayGrades.filter(p => p.parcial === "6");
            academicRecord[q.carrera_uac?.semestre][q.carrera_uac?.uac?.nombre] = tempArray.filter(e => e.carrera_uac?.uac?.nombre === q.carrera_uac?.uac?.nombre);
            academicRecord[q.carrera_uac?.semestre][q.carrera_uac?.uac?.nombre].key = q.carrera_uac_id;
            academicRecord[q.carrera_uac?.semestre][q.carrera_uac?.uac?.nombre].parcial_1 = parcial_1 && parcial_1.length > 1 ? parcial_1[0].calificacion : parcial_1[0] ? parcial_1[0]?.calificacion : "-";
            academicRecord[q.carrera_uac?.semestre][q.carrera_uac?.uac?.nombre].parcial_2 = parcial_2 && parcial_2.length > 1 ? parcial_2[0].calificacion : parcial_2[0] ? parcial_2[0]?.calificacion : "-";
            academicRecord[q.carrera_uac?.semestre][q.carrera_uac?.uac?.nombre].parcial_3 = parcial_3 && parcial_3.length > 1 ? parcial_3[0].calificacion : parcial_3[0] ? parcial_3[0]?.calificacion : "-";
            academicRecord[q.carrera_uac?.semestre][q.carrera_uac?.uac?.nombre].parcial_4 = parcial_4.length && parcial_4.tipo_calif !== "RS" ? parcial_4[0]?.calificacion : "-";
            academicRecord[q.carrera_uac?.semestre][q.carrera_uac?.uac?.nombre].parcial_5 = parcial_5[0]?.calificacion ? parcial_5[0]?.calificacion : "-";
            academicRecord[q.carrera_uac?.semestre][q.carrera_uac?.uac?.nombre].parcial_6 = parcial_6[0]?.calificacion ? parcial_6[0]?.calificacion : "-";
            academicRecord[q.carrera_uac?.semestre][q.carrera_uac?.uac?.nombre].rs = parcial_4 && parcial_4.length > 1 ? parcial_4[parcial_4.length - 1]?.calificacion : "-";
            academicRecord[q.carrera_uac?.semestre][q.carrera_uac?.uac?.nombre].parcial_1_id = parcial_1 && parcial_1.length > 1 ? parcial_1[0].id : parcial_1[0]?.id;
            academicRecord[q.carrera_uac?.semestre][q.carrera_uac?.uac?.nombre].parcial_2_id = parcial_2 && parcial_2.length > 1 ? parcial_2[0].id : parcial_2[0]?.id;
            academicRecord[q.carrera_uac?.semestre][q.carrera_uac?.uac?.nombre].parcial_3_id = parcial_3 && parcial_3.length > 1 ? parcial_3[0].id : parcial_3[0]?.id;
            academicRecord[q.carrera_uac?.semestre][q.carrera_uac?.uac?.nombre].parcial_4_id = parcial_4.length && parcial_4.tipo_calif !== "RS" ? parcial_4[0]?.id : "-";
            academicRecord[q.carrera_uac?.semestre][q.carrera_uac?.uac?.nombre].parcial_5_id = parcial_5[0]?.id ? parcial_5[0]?.id : "-";
            academicRecord[q.carrera_uac?.semestre][q.carrera_uac?.uac?.nombre].parcial_6_id = parcial_6[0]?.id ? parcial_6[0]?.id : "-";
            academicRecord[q.carrera_uac?.semestre][q.carrera_uac?.uac?.nombre].rs_id = parcial_4 && parcial_4.length > 1 ? parcial_4[parcial_4.length - 1]?.id : "-";
          }
        })
      });
      return {
        ...state,
        academicRecordList: academicRecord,
      };

    case SET_SEMESTERS_STUDENT_LIST:
      let semesters = [];

      /* if(action.data.calificacion_uac.length > 0) {
        action.data.calificacion_uac.map(x => {
          const index = semesters.findIndex(s => s.id === x.carrera_uac?.semestre);
          if(index === -1 && x.carrera_uac?.semestre){
            semesters.push({ description: x.carrera_uac?.semestre, id: x.carrera_uac?.semestre });
          }
        });
      } else { */
        for (let x=1; x<=action.data.semestre; x++) {
          semesters.push({ description: x, id: x });
        }
      /* } */

      return {
        ...state,
        semestersStudentList: semesters.sort(function (a, b) {
          return a.id - b.id;
        }),
      };
    default:
      return state;
  }
}
