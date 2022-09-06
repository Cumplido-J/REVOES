package mx.edu.cecyte.sisec.business.pdfgenerator.degree;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
@Getter
@Setter
@NoArgsConstructor
public class PdfData {
    protected String folioNumber;
    protected String decreeNumber;
    protected String nameState;
    protected String decreeDate;
    protected String technicalDegree;
    protected String nameSchool;
    protected String examinationDate;
    protected String city;
    protected String state;
    protected String supportDate;

    protected String managingDirector;

    protected String nameStudent;
    protected String curp;

    protected String schoolOrigin;
    protected String stateOrigin;
    protected String startDateOrigin;
    protected String endDateOrigin;

    protected String graduationSchool;
    protected String graduationState;
    protected String startDateGraduation;
    protected String endDateGraduation;

    protected String academicDirector;

}
