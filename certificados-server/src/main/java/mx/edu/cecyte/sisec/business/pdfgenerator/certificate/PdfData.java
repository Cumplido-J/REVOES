package mx.edu.cecyte.sisec.business.pdfgenerator.certificate;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import mx.edu.cecyte.sisec.shared.AppCatalogs;

@Getter
@Setter
@NoArgsConstructor
public class PdfData {
    protected String state;
    protected String educationalOption;
    protected String municipality;
    protected String cct;
    protected String curp;
    protected String enrollmentKey;
    protected String careerName;
    protected String careerKey;
    protected String enrollmentStartDate;
    protected String enrollmentEndDate;
    protected String obtainedCredits;
    protected String totalCredits;
    protected String studentName;
    protected String studentFirstLastName;
    protected String studentSecondLastName;
    protected String finalScore;
    protected String letterScore;
    protected String schoolName;
    protected String directorName;
    protected String directorFirstLastName;
    protected String directorSecondLastName;
    protected String certificateNumber;
    protected String digitalStamp;
    protected String sepStamp;
    protected String folioNumber;
    protected String printDate;
    protected String sepDate;
    protected String directorPosition;
    protected String certificateTypeId;
    protected String sinemsDate;
    protected Integer schoolType;
    protected boolean blank;

    public boolean isCecyte() {
        return schoolType.equals(AppCatalogs.SCHOOLTYPE_CECYTE);
    }

    public boolean isEmsad() {
        return schoolType.equals(AppCatalogs.SCHOOLTYPE_EMSAD);
    }

    public String getSchoolName() {
        String formatedSchoolName = this.schoolName;
        // Debido a que al principio en la columna "pdf_nombre" se registraban datos de una manera mal organizada
        formatedSchoolName = formatedSchoolName.replace("Colegio De Estudios Científicos y Tecnológicos", "");
        formatedSchoolName = formatedSchoolName.replace("Plantel CECYTEN", "");
        if (formatedSchoolName.contains("Unidad")) formatedSchoolName = formatedSchoolName.replace("Plantel", "");
        formatedSchoolName = formatedSchoolName.replace("Educación Media Superior a Distancia", "");
        formatedSchoolName = formatedSchoolName.trim();
        if (formatedSchoolName.equals("Plantel")) formatedSchoolName = "";
        return formatedSchoolName;
    }
}
