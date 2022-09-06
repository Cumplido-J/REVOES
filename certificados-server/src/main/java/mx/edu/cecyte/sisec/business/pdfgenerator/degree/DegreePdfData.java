package mx.edu.cecyte.sisec.business.pdfgenerator.degree;

import lombok.Getter;
import lombok.Setter;
import mx.edu.cecyte.sisec.dto.degree.DegreeComplementDoc;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.AppFunctions;
import mx.edu.cecyte.sisec.shared.Messages;
import mx.edu.cecyte.titulo.TituloElectronico;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

@Getter
@Setter
public class DegreePdfData extends PdfData {
    protected String periodOrigin;
    protected String graduationPeriod;
    protected String nameMunicipality;
    protected String nameLogoState;
    protected String gender;
    protected Integer stateId;
    protected String cityName;
    private String genderAcademic;

    public DegreePdfData(TituloElectronico dec, DegreeComplementDoc complementDoc) {
        super();
        String DecreeDate = complementDoc.getDateDecree();

        this.nameLogoState = AppFunctions.returnStateName(complementDoc.getStateId())+".png";
        this.genderAcademic = (complementDoc.getCurpAcademic().length() > 10 && complementDoc.getCurpAcademic() != null) ? complementDoc.getCurpAcademic().substring(10, 11) : "O";
        this.folioNumber = dec.getFolioControl();
        this.cityName = complementDoc.getCityName();
        this.decreeDate = AppFunctions.dateConvertLetter(DecreeDate);
        this.decreeNumber = complementDoc.getNumberDecree().toString();
        this.technicalDegree = dec.getCarrera().getNombreCarrera();
        this.nameSchool = complementDoc.getNameSchool();
        if (dec.getExpedicion().getFechaExamenProfesional() != null) {
            this.examinationDate = AppFunctions.dateLetterDegree(dec.getExpedicion().getFechaExamenProfesional());;
        } else {
            this.examinationDate = AppFunctions.dateLetterDegree(dec.getExpedicion().getFechaExencionExamenProfesional());
        }
        this.state = complementDoc.getNameState();
        this.city = complementDoc.getNameCity();
        this.nameMunicipality = complementDoc.getNameMunicipality();
        this.supportDate = AppFunctions.dateLetterDegree(dec.getExpedicion().getFechaExpedicion());
        this.managingDirector = AppFunctions.fullName(complementDoc.getNameDirector(), complementDoc.getFirstLastNameDirector(), complementDoc.getSecondLastNameDirector());
        this.nameStudent = AppFunctions.fullName(dec.getProfesionista().getNombre(), dec.getProfesionista().getPrimerApellido(), dec.getProfesionista().getSegundoApellido());
        this.curp = dec.getProfesionista().getCurp();
        this.schoolOrigin = dec.getAntecedente().getInstitucionProcedencia();
        this.stateOrigin = dec.getAntecedente().getEntidadFederativa();
        this.startDateOrigin = dec.getAntecedente().getFechaInicio();
        this.endDateOrigin = dec.getAntecedente().getFechaTerminacion();
        this.graduationSchool = dec.getInstitucion().getNombreInstitucion();
        this.graduationState = dec.getExpedicion().getEntidadFederativa();
        this.startDateGraduation = dec.getCarrera().getFechaInicio();
        this.endDateGraduation = dec.getCarrera().getFechaTerminacion();
        this.academicDirector = AppFunctions.fullName(complementDoc.getNameAcademic(), complementDoc.getFirstLastNameAcademic(), complementDoc.getSecondLastNameAcademic());
        if (dec.getAntecedente().getFechaInicio() != null && dec.getAntecedente().getFechaTerminacion() != null) {
            this.periodOrigin = AppFunctions.dateOriginPeriod(dec.getAntecedente().getFechaInicio(), dec.getAntecedente().getFechaTerminacion());
        }
        this.graduationPeriod = AppFunctions.dateGraduationPeriod(dec.getCarrera().getFechaInicio(), dec.getCarrera().getFechaTerminacion());
        this.gender = complementDoc.getGender();
        this.stateId = complementDoc.getStateId();
    }
}
