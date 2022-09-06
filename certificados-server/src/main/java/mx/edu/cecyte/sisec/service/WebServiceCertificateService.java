package mx.edu.cecyte.sisec.service;


import mx.edu.cecyte.sisec.devfunctions.CryptographyAES;
import mx.edu.cecyte.sisec.dto.certificate.CertificateFiel;
import mx.edu.cecyte.sisec.dto.student.StudentSemesters;
import mx.edu.cecyte.sisec.dto.webServiceCertificate.*;
import mx.edu.cecyte.sisec.model.education.CareerModule;
import mx.edu.cecyte.sisec.model.education.SchoolCareer;
import mx.edu.cecyte.sisec.model.education.StudentCareerModule;
import mx.edu.cecyte.sisec.model.mec.Certificate;
import mx.edu.cecyte.sisec.model.mec.MecCredentials;
import mx.edu.cecyte.sisec.model.student.Student;
import mx.edu.cecyte.sisec.model.subjects.StudentSubjectPartial;
import mx.edu.cecyte.sisec.model.users.User;
import mx.edu.cecyte.sisec.queries.*;
import mx.edu.cecyte.sisec.repo.education.SchoolCareerRepository;
import mx.edu.cecyte.sisec.shared.AppCatalogs;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.Messages;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;


@Service
public class WebServiceCertificateService {

    @Autowired
    private WebServiceCertificateQueries webServiceCertificateQueries;

    @Autowired private SchoolCareerRepository schoolCareerRepository;

    @Autowired WebServiceCertificateValidetService validStudentData;

    @Autowired
    private AuditingQueries auditingQueries;

    @Autowired StudentQueries studentQueries;

    @Autowired UserQueries userQueries;

    @Autowired
    CatalogQueries catalogQueries;

    public List<AnswerEndPointPrimary> studentDataByWebService( EndPointPrimary endPointPrimary, Integer adminId ){
        List<AnswerEndPointPrimary> answerEndPoint= new ArrayList<>();
        switch ( endPointPrimary.getEndPointCertificateType().getType() ){
            case AppCatalogs.TYPE_CERTIFICATE_ENDING :
                validStudentData.validStudentDataCertificateTermino(endPointPrimary);
                answerEndPoint = createCertificateENDINGByStudentDataByWebService(endPointPrimary, adminId);
                break;
            case AppCatalogs.TYPE_CERTIFICATE_PARTIAL :
                validStudentData.validStudentDataCertificatePartial(endPointPrimary);
                answerEndPoint = createCertificatePARTIALByStudentDataByWebService(endPointPrimary, adminId);
                break;
            case AppCatalogs.TYPE_CERTIFICATE_ENDING_TEST:
                answerEndPoint=validStudentData.validStudentData_ENDING_Test(endPointPrimary);
                break;
            case AppCatalogs.TYPE_CERTIFICATE_PARTIAL_TEST:
                answerEndPoint=validStudentData.validStudentData_PARTIAL_Test(endPointPrimary);
                break;
            default:
                throw new AppException("EndPointCertificateType -> type = valor fuera de rango");
               // break;
        }

        return answerEndPoint;
    }

    public List<AnswerEndPointPrimary> createCertificateENDINGByStudentDataByWebService(EndPointPrimary endPointPrimary, Integer adminId){
        List<AnswerEndPointPrimary> answerEndPoint= new ArrayList<>();
        endPointPrimary.getEndPointStudents().stream().map(endPointStudents -> {
            Student student = generateStudentData(endPointStudents.getEndPointStudentData(), false, false, false);
            List<StudentCareerModule> studentCareerModules = generateModuleScore( student, endPointStudents.getScoreModules());
            Certificate certificate=validatedStudentCertificate( student, AppCatalogs.TYPE_CERTIFICATE_ENDING);
        return answerEndPoint.add(new AnswerEndPointPrimary(student, studentCareerModules,certificate));
        }
        ).collect(Collectors.toList());
        auditingQueries.saveAudit("WebServiceCertificateService", "createDataWebService", adminId, Student.class, adminId, "Carga de datos por webService certificado termino");
        return answerEndPoint;
    }


    public Student generateStudentData( EndPointStudentData endPointStudentData,
                                        boolean es_bach_tec, boolean certificado_parcial,boolean isAbrogado
    ){
        SchoolCareer schoolCareer = schoolCareerRepository.getBySchoolIdAndCareerIdByCCTAndClave(endPointStudentData.getCctPlantel(), endPointStudentData.getCarreraClave()).orElseThrow(() -> new AppException(Messages.database_cantFindResource));
        User user = webServiceCertificateQueries.CreateUserStudent( endPointStudentData );
        webServiceCertificateQueries.createRolStudent(user);
        Student student = webServiceCertificateQueries.createStudent(endPointStudentData, user,schoolCareer,es_bach_tec,certificado_parcial,isAbrogado);
        Set< CareerModule > careerModules = schoolCareer.getCareer().getCareerModules();
        webServiceCertificateQueries.generateStudentModules(student,careerModules);

        return student;
    }

    public List<StudentCareerModule> generateModuleScore( Student student, List<ScoreModule> scoreModule){
        List< StudentCareerModule >studentCareerModules= webServiceCertificateQueries.getCareerModule(student,scoreModule);
        return studentCareerModules;
    }

    public Certificate validatedStudentCertificate(Student student, int certificateType){
       Certificate certificate= webServiceCertificateQueries.generateValidetStudentCertificate(student, certificateType);
       return certificate;
    }

    //---------------------------Partial------------------------------------------------------------------
    public List<AnswerEndPointPrimary> createCertificatePARTIALByStudentDataByWebService(EndPointPrimary endPointPrimary, Integer adminId){
        List<AnswerEndPointPrimary> answerEndPoint= new ArrayList<>();

        endPointPrimary.getEndPointStudents().stream()
                .map(endPointStudents -> {
                    Student student = generateStudentData(endPointStudents.getEndPointStudentData(), false ,true,false);
                    List<StudentSubjectPartial> studentSubjectPartials = generateModuleScorePartial( student, endPointStudents.getScoreModulePartials());
                    Certificate certificate=validatedStudentCertificate( student, AppCatalogs.TYPE_CERTIFICATE_PARTIAL);
                    return answerEndPoint.add(new AnswerEndPointPrimary(student, studentSubjectPartials, certificate, true));
                }
        ).collect(Collectors.toList());

        auditingQueries.saveAudit("WebServiceCertificateService", "createDataWebService", adminId, Student.class, adminId, "Carga de datos por webService certificado parcial");
        return answerEndPoint;
    }

    public List< StudentSubjectPartial > generateModuleScorePartial( Student student, List< ScoreModulePartial > scoreModulePartials){
        List< StudentSubjectPartial > studentSubjectPartials = webServiceCertificateQueries.getCareerModulePartial(student,scoreModulePartials);;
        return studentSubjectPartials;
    }

    public boolean isTest(boolean isTest,Integer adminId){
        User userAdmin = userQueries.getUserById(adminId);
        Integer stateId = userAdmin.getAdminUserScope() != null ? catalogQueries.getStateId(userAdmin) : userQueries.getAvailableStateIdsByAdminUser(userAdmin).stream().findFirst().orElse(0);
        MecCredentials mecCredentials = userQueries.getMecCredentialsFromState(stateId);

        boolean test=  mecCredentials.getAuthentificationWS().equals("P") ? isTest : true;
        return test;
    }

    public String DencryptPassword( CertificateFiel certificateFiel ){
        CryptographyLogin resp = CryptographyAES.Dencrypt_Success( certificateFiel.getPassword(), certificateFiel.getSecretKey() ) ;
        return resp.getPassword();
    }
}
