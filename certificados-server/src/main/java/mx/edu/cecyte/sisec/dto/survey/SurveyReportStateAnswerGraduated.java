package mx.edu.cecyte.sisec.dto.survey;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.cecyte.sisec.model.student.Student;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SurveyReportStateAnswerGraduated {
    private int id;
    private String cct;
    private String plantel;
    private String curp;
    private String carrera;
    private String nombre;
    private String apellido_paterno;
    private String apellido_materno;
    private String genero;
    private String correo;
    private String numeroTelefonico;
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
    private String shareInformation;
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

    public SurveyReportStateAnswerGraduated(Student student){
        this.id = student.getId();
        this.cct =student.getSchool().getCct();
        this.plantel =student.getSchool().getName();
        this.curp =student.getUser().getUsername();
        this.carrera =student.getSchoolCareer().getCareer().getName();
        this.nombre =student.getUser().getName();
        this.apellido_paterno =student.getUser().getFirstLastName();
        this.apellido_materno =student.getUser().getSecondLastName();
        //this.genero =student.getUser().getUsername().length() > 10 ? student.getUser().getUsername().charAt(10) == 'H' ? "Hombre" :student.getUser().getUsername().charAt(10) == 'M' ? "Mujer" : "Idefinido" : "Indefinido";
        this.q1 = student.getSurveyGraduated2021()!=null ? student.getSurveyGraduated2021().getQ1(): "";
        this.q2 = student.getSurveyGraduated2021()!=null ? student.getSurveyGraduated2021().getQ2(): "";
        this.q3 = student.getSurveyGraduated2021()!=null ? student.getSurveyGraduated2021().getQ3(): "";
        this.q4 = student.getSurveyGraduated2021()!=null ? student.getSurveyGraduated2021().getQ4(): "";
        this.q5 = student.getSurveyGraduated2021()!=null ? student.getSurveyGraduated2021().getQ5(): "No Aplica";
        this.q6 = student.getSurveyGraduated2021()!=null ? student.getSurveyGraduated2021().getQ6(): "No Aplica";
        this.q7 = student.getSurveyGraduated2021()!=null ? student.getSurveyGraduated2021().getQ7(): "No Aplica";
        this.q8 = student.getSurveyGraduated2021()!=null ? student.getSurveyGraduated2021().getQ8(): "No Aplica";
        this.q9 = student.getSurveyGraduated2021()!=null ? student.getSurveyGraduated2021().getQ9(): "No Aplica";
        this.q10 = student.getSurveyGraduated2021()!=null ? student.getSurveyGraduated2021().getQ10(): "No Aplica";
        this.q11 = student.getSurveyGraduated2021()!=null ? student.getSurveyGraduated2021().getQ11(): "No Aplica";
        this.q12 = student.getSurveyGraduated2021()!=null ? student.getSurveyGraduated2021().getQ12(): "No Aplica";
        this.q13 = student.getSurveyGraduated2021()!=null ? student.getSurveyGraduated2021().getQ13(): "No Aplica";
        this.q14 = student.getSurveyGraduated2021()!=null ? student.getSurveyGraduated2021().getQ14(): "No Aplica";
        this.q15 = student.getSurveyGraduated2021()!=null ? student.getSurveyGraduated2021().getQ15(): "No Aplica";
        this.q16 = student.getSurveyGraduated2021()!=null ? student.getSurveyGraduated2021().getQ16(): "No Aplica";
        /*this.continua_estudios = student.getStudentInfo()!= null ? student.getStudentInfo().getContinueStudies()!=null ? student.getStudentInfo().getContinueStudies() == true ? "Si": "No" : "" :"";
        this.discapacidad = student.getStudentInfo()!= null ? student.getStudentInfo().getDisability()!=null ? student.getStudentInfo().getDisability() : "" : "";
        this.grupo_etnico = student.getStudentInfo()!= null ? student.getStudentInfo().getEthnicGroup()!=null ? student.getStudentInfo().getEthnicGroup() : "" : "";
        this.idioma = student.getStudentInfo()!= null ? student.getStudentInfo().getLanguage()!=null ? student.getStudentInfo().getLanguage() : "" : "";
        this.lengua = student.getStudentInfo()!= null ? student.getStudentInfo().getIndigenousLangage()!=null ? student.getStudentInfo().getIndigenousLangage() : "" : "";
        this.emprendimiento = student.getStudentInfo()!= null ? student.getStudentInfo().getEntrepreneurship() != null ? student.getStudentInfo().getEntrepreneurship() == true ? "Si" : "No" : "" : "";
        this.emprendimiento_carrera = student.getStudentInfo()!= null ? student.getStudentInfo().getEntrepreneurshipCareer() != null ? student.getStudentInfo().getEntrepreneurshipCareer() == true ? "Si" : "No" : "" : "";
        this.emprendimiento_derivado = student.getStudentInfo()!= null ? student.getStudentInfo().getEntrepreneurshipDerivated() != null? student.getStudentInfo().getEntrepreneurshipDerivated() == true? "Si" : "No" : "" : "";
        this.emprendimiento_estatus = student.getStudentInfo()!= null ? student.getStudentInfo().getEntrepreneurshipStatus() : "";
        this.examen = student.getStudentInfo()!= null ? student.getStudentInfo().getExam() : "";
        this.hogar = student.getStudentInfo()!= null ? student.getStudentInfo().getHome() : "";
        this.programa = student.getStudentInfo()!= null ? student.getStudentInfo().getProgram() : "";*/
    }
}
