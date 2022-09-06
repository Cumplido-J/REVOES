package mx.edu.cecyte.sisec.dto.webServiceCertificate;

import mx.edu.cecyte.sisec.model.subjects.StudentSubjectPartial;
import mx.edu.cecyte.sisec.model.subjects.Subject;
import java.util.List;
import java.util.Objects;
import java.util.function.Predicate;

public class SemesterUtilFilter {

    public static boolean isNotSemester( Subject subject, List< Integer > semester, Integer position ){

        Predicate <Subject> SB =  ( Subject S ) -> Objects.equals(S.getSemester(), position);

        if (semester.contains( position )) SB = ( Subject S ) -> !Objects.equals(S.getSemester(), position);

        Predicate <Subject> SR = SB;

        return SR.test(subject);
    }

    public static boolean isNotSemesterByStudentSubject( StudentSubjectPartial studentSubjectPartial, List< Integer > semester, Integer position ){

        Predicate <StudentSubjectPartial> SB =  ( StudentSubjectPartial S ) -> Objects.equals(S.getPeriodNumber(), position);

        if (semester.contains( position )) SB = ( StudentSubjectPartial S ) -> !Objects.equals(S.getPeriodNumber(), position);

        Predicate <StudentSubjectPartial> SR = SB;

        return SR.test(studentSubjectPartial);
    }

    public static boolean isNotSemesterByStudentSubjectTEST( ScoreModulePartial scoreModulePartial, List< Integer > semester, Integer position ){

        Predicate < ScoreModulePartial > SB =  ( ScoreModulePartial S ) -> Objects.equals(S.getSemestre(), position);

        if (semester.contains( position )) SB = ( ScoreModulePartial S ) -> !Objects.equals(S.getSemestre(), position);

        Predicate < ScoreModulePartial > SR = SB;

        return SR.test( scoreModulePartial );
    }

}