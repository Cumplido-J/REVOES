package mx.edu.cecyte.sisec.dto.survey;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import mx.edu.cecyte.sisec.model.student.Student;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SurveyReportStateSchoolAnswer {
    //private int id;
    private String cct;
    private String plantel;
    private String curp;
    private String carrera;
    private String nombre;
    private String apellido_paterno;
    private String apellido_materno;
    private String genero;
    private String q1;
    private String q2;
    private String q3;
    private String q4;
    private String q5;
    private String q6;
    private String q7;
    private String q8;
    private String q9;
    private String q10;
    private String q11;
    private String q12;
    private String q13;
    private String q14;
    private String q15;
    private String q16;
    private String q17;
    private String q18;
    private String q19;
    private String q20;
    private String q21;
    private String q22;
    private String q23;
    private String q24;
    private String q25;
    private String q26;
    private String q27;
    private String q28;
    private String continua_estudios;
    private String discapacidad;
    private String grupo_etnico;
    private String idioma;
    private String lengua;
    private String emprendimiento;
    private String emprendimiento_carrera;
    private String emprendimiento_derivado;
    private String emprendimiento_estatus;
    private String examen;
    private String hogar;
    private String programa;
    public SurveyReportStateSchoolAnswer( Student student ) {
        //this.id = student.getId();
        this.cct =student.getSchool().getCct();
        this.plantel =student.getSchool().getName();
        this.curp =student.getUser().getUsername();
        this.carrera =student.getSchoolCareer().getCareer().getName();
        this.nombre =student.getUser().getName();
        this.apellido_paterno =student.getUser().getFirstLastName();
        this.apellido_materno =student.getUser().getSecondLastName();
        this.genero =student.getUser().getUsername().length() > 10 ? student.getUser().getUsername().charAt(10) == 'H' ? "Hombre" :student.getUser().getUsername().charAt(10) == 'M' ? "Mujer" : "Idefinido" : "Indefinido";
        this.q1 = student.getSurveyIntentions2021()!=null ? student.getSurveyIntentions2021().getQ1(): "";
        this.q2 = student.getSurveyIntentions2021()!=null ? student.getSurveyIntentions2021().getQ2(): "";
        this.q3 = student.getSurveyIntentions2021()!=null ? student.getSurveyIntentions2021().getQ3(): "";
        this.q4 = student.getSurveyIntentions2021()!=null ? student.getSurveyIntentions2021().getQ4(): "";
        this.q5 = student.getSurveyIntentions2021()!=null ? student.getSurveyIntentions2021().getQ5(): "";
        this.q6 = student.getSurveyIntentions2021()!=null ? student.getSurveyIntentions2021().getQ6(): "";
        this.q7 = student.getSurveyIntentions2021()!=null ? student.getSurveyIntentions2021().getQ7(): "";;
        this.q8 = student.getSurveyIntentions2021()!=null ? student.getSurveyIntentions2021().getQ8(): "";
        this.q9 = student.getSurveyIntentions2021()!=null ? student.getSurveyIntentions2021().getQ9(): "";
        this.q10 = student.getSurveyIntentions2021()!=null ? student.getSurveyIntentions2021().getQ10(): "";;
        this.q11 = student.getSurveyIntentions2021()!=null ? student.getSurveyIntentions2021().getQ11(): "";
        this.q12 = student.getSurveyIntentions2021()!=null ? student.getSurveyIntentions2021().getQ12(): "";
        this.q13 = student.getSurveyIntentions2021()!=null ? student.getSurveyIntentions2021().getQ13(): "";
        this.q14 = student.getSurveyIntentions2021()!=null ? student.getSurveyIntentions2021().getQ14(): "";
        this.q15 = student.getSurveyIntentions2021()!=null ? student.getSurveyIntentions2021().getQ15(): "";
        this.q16 = student.getSurveyIntentions2021()!=null ? student.getSurveyIntentions2021().getQ16(): "";
        this.q17 = student.getSurveyIntentions2021()!=null ? student.getSurveyIntentions2021().getQ17(): "";
        this.q18 = student.getSurveyIntentions2021()!=null ? student.getSurveyIntentions2021().getQ18(): "";
        this.q19 = student.getSurveyIntentions2021()!=null ? student.getSurveyIntentions2021().getQ19(): "";
        this.q20 = student.getSurveyIntentions2021()!=null ? student.getSurveyIntentions2021().getQ20(): "";
        this.q21 = student.getSurveyIntentions2021()!=null ? student.getSurveyIntentions2021().getQ21(): "";
        this.q22 = student.getSurveyIntentions2021()!=null ? student.getSurveyIntentions2021().getQ22(): "";
        this.q23 = student.getSurveyIntentions2021()!=null ? student.getSurveyIntentions2021().getQ23(): "";
        this.q24 = student.getSurveyIntentions2021()!=null ? student.getSurveyIntentions2021().getQ24(): "";
        this.q25 = student.getSurveyIntentions2021()!=null ? student.getSurveyIntentions2021().getQ25(): "";
        this.q26 = student.getSurveyIntentions2021()!=null ? student.getSurveyIntentions2021().getQ26(): "";
        this.q27 = student.getSurveyIntentions2021()!=null ? student.getSurveyIntentions2021().getQ27(): "";
        this.q28 = student.getSurveyIntentions2021()!=null ? student.getSurveyIntentions2021().getQ28(): "";

        this.continua_estudios = student.getStudentInfo().getContinueStudies() ? "Si" : "No";
        this.discapacidad = student.getStudentInfo().getDisability() != null ? student.getStudentInfo().getDisability() : "No";
        this.grupo_etnico = student.getStudentInfo().getEthnicGroup()!=null ? student.getStudentInfo().getEthnicGroup() : "No" ;
        this.idioma = student.getStudentInfo().getLanguage()!=null ? student.getStudentInfo().getLanguage() : "No";
        this.lengua = student.getStudentInfo().getIndigenousLangage()!=null ? student.getStudentInfo().getIndigenousLangage() : "No";
        this.emprendimiento = student.getStudentInfo().getEntrepreneurship() != null ? student.getStudentInfo().getEntrepreneurship() == true ? "Si" : "No" : "No";
        this.emprendimiento_carrera = student.getStudentInfo().getEntrepreneurshipCareer() != null ? student.getStudentInfo().getEntrepreneurshipCareer() == true ? "Si" : "No" : "No";
        this.emprendimiento_derivado = student.getStudentInfo().getEntrepreneurshipDerivated() != null? student.getStudentInfo().getEntrepreneurshipDerivated() == true? "Si" : "No" : "No";
        this.emprendimiento_estatus = student.getStudentInfo()!= null ? student.getStudentInfo().getEntrepreneurshipStatus() : "";
        this.examen = student.getStudentInfo()!= null ? student.getStudentInfo().getExam() : "";
        this.hogar = student.getStudentInfo()!= null ? student.getStudentInfo().getHome() : "";
        this.programa = student.getStudentInfo()!= null ? student.getStudentInfo().getProgram() : "";

    }
}
