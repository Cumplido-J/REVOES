package mx.edu.cecyte.sisec.dto.webServiceCertificate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.cecyte.sisec.model.catalogs.CatDisciplinaryField;
import mx.edu.cecyte.sisec.model.education.SchoolCareer;
import mx.edu.cecyte.sisec.model.student.Student;
import mx.edu.cecyte.sisec.model.users.User;
import org.springframework.util.StringUtils;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EndPointStudentData {

    String curp;
    String nombre;
    String apellidoPaterno;
    String apellidoMaterno;
    String email;
    String matricula;
    Integer estadoId;
    String cctPlantel;
    String carreraClave;
    Boolean estatus;
    String generacion;
    Date fechaIngreso;
    Date fechaEgreso;
    Integer campoDisciplinar;
    double promedio;
    Integer creditosObtenidos;


    public User createUser( EndPointStudentData endPointStudentData, String password){
        User user =new User();
        user.setUsername(endPointStudentData.getCurp());
        user.setPassword(password);
        user.setName(endPointStudentData.getNombre());
        user.setFirstLastName(endPointStudentData.getApellidoPaterno());
        user.setStatus(endPointStudentData.getEstatus() ? 1 : 0 );
        if (!StringUtils.isEmpty(endPointStudentData.getApellidoMaterno())) user.setSecondLastName(endPointStudentData.getApellidoMaterno());
        if (!StringUtils.isEmpty(endPointStudentData.getEmail())) user.setEmail( endPointStudentData.getEmail() );
        return user;
    }

    public Student createStudent( EndPointStudentData endPointStudentData, User user, SchoolCareer schoolCareer, CatDisciplinaryField disciplinaryField,
                                  boolean es_bach_tec, boolean certificado_parcial, boolean isAbrogado ){
        Student student = new Student();
        student.setUser( user );
        student.setEnrollmentKey( endPointStudentData.getMatricula() );
        student.setEnrollmentStartDate( endPointStudentData.fechaIngreso );
        student.setEnrollmentEndDate( endPointStudentData.fechaEgreso );
        student.setGeneration( ""+endPointStudentData.getGeneracion() );
        student.setReprobate( false );
        student.setIsPortability( es_bach_tec );
        student.setSemester(6);
        student.setNoticeOfPrivacyAccepted( false );
        student.setStatus( endPointStudentData.getEstatus() );
        student.setSchoolCareer( schoolCareer );
        student.setPartialCertificate( certificado_parcial );
        if (disciplinaryField != null) {student.setDisciplinaryField(disciplinaryField);}
        student.setFinalScore( endPointStudentData.getPromedio() );
        student.setReprobate(false);
        student.setAbrogadoCertificate(isAbrogado);
        if (certificado_parcial){
            student.setObtainedCredits(endPointStudentData.getCreditosObtenidos());
        }
        return student;
    }

    public Student updateStudent( EndPointStudentData endPointStudentData, User user, SchoolCareer schoolCareer, CatDisciplinaryField disciplinaryField,
                                  boolean es_bach_tec, boolean certificado_parcial, boolean isAbrogado, Student student ){
        //Student student = new Student();
        student.setUser( user );
        //student.setEnrollmentKey( endPointStudentData.getMatricula() );
        //student.setEnrollmentStartDate( endPointStudentData.fechaIngreso );
        //student.setEnrollmentEndDate( endPointStudentData.fechaEgreso );
        //student.setGeneration( ""+endPointStudentData.getGeneracion() );
        student.setReprobate( false );
        student.setIsPortability( es_bach_tec );
        student.setSemester(6);
        student.setNoticeOfPrivacyAccepted( false );
        //student.setStatus( endPointStudentData.getEstatus() );
        student.setSchoolCareer( schoolCareer );
        student.setPartialCertificate( certificado_parcial );
        if (disciplinaryField != null) {student.setDisciplinaryField(disciplinaryField);}
        student.setFinalScore( endPointStudentData.getPromedio() );
        student.setReprobate(false);
        student.setAbrogadoCertificate(isAbrogado);
        if (certificado_parcial){
            student.setObtainedCredits(endPointStudentData.getCreditosObtenidos());
        }
        return student;
    }

}
