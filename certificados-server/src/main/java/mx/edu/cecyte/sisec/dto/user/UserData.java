package mx.edu.cecyte.sisec.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.cecyte.sisec.model.people.Persona;
import mx.edu.cecyte.sisec.model.users.User;
import mx.edu.cecyte.sisec.model.users.UserRole;
import mx.edu.cecyte.sisec.shared.AppCatalogs;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.Messages;

import java.util.Objects;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserData {

    private int id;
    private String username;
    private String name;
    private String firstLastName;
    private String secondLastName;
    private String email;
    private int statusId;

    private int cargoId;
    private int cargoIdTitulo;
    private int roleId;
    private int groupId;
    private int scopeId;
    private String rfc;
    private int stateId;
    private String password;
    private int sexo;


    public UserData( User user, Persona persona ){
        this.id = user.getId() != null ? user.getId() : 0;
        this.username = user.getUsername();
        this.name = user.getName();
        this.firstLastName = user.getFirstLastName();
        this.secondLastName = user.getSecondLastName();
        this.email = user.getEmail();
        this.statusId=user.getStatus() == 1 ? 1 : 2;
        this.cargoId = user.getAdminUserScope().getPosition() != null ? user.getAdminUserScope().getPosition().getId() : 0;
        this.roleId = user.getUserRoles().stream().map(userRole -> userRole.getRole().getId()).findFirst().orElseThrow(() -> new AppException(Messages.cantFindResourceMec));
        this.groupId = user.getUserRolesBCS().getRolebcs().getId();
        this.scopeId = user.getAdminUserScope().getCatUserScope().getId();
        this.cargoIdTitulo = persona!=null ? persona.getCargoId(): 0;
        this.rfc = persona!=null ? persona.getRfc() : null;
        this.stateId = persona!=null ? persona.getState().getId(): 0;
        this.sexo = persona!=null ? Objects.equals(persona.getSexo(), "H") ? 1: 2 : 0;

    }

    /*public UserData(User user, int rol){
        if( user.getId() != null){
            this.id = user.getId(); }
        this.username = user.getUsername();
        this.name = user.getName();
        this.firstLastName = user.getFirstLastName();
        this.secondLastName = user.getSecondLastName();
        this.email = user.getEmail();
        this.statusId=user.getStatus() == 1 ? 1 : 2;

        if(rol== AppCatalogs.ROLE_CERTIFICATION_ADMIN) {
            this.stateId = user.getCertificationAdmin().getState().getId();
            this.cargoId=user.getCertificationAdmin().getPosition().getId();
            this.checkAdminNivel = AppCatalogs.CHECK_NIVEL_ESTATAL;
            if ( user.getUserRolesBCS() != null) {
                this.adminSchoolId = user.getUserRolesBCS().getRolebcs().getId() == AppCatalogs. BCS_ROLE_CERTIFICACION
                        ? AppCatalogs.CATALOG_CERTIFY_ESTATAL : AppCatalogs.CATALOG_DIRECTOR_ESTATAL;}
        }
        if(rol == AppCatalogs.ROLE_TITULACION_ADMIN) {
            this.stateId = user.getDegreeAdmim().getState().getId();
            this.cargoId = user.getDegreeAdmim().getPosition().getId();
            this.checkAdminNivel = AppCatalogs.CHECK_NIVEL_ESTATAL;
            if (user.getUserRolesBCS() != null) {
                this.adminSchoolId = user.getUserRolesBCS().getRolebcs().getId() == AppCatalogs.BCS_ROLE_TITULACION
                        ? AppCatalogs.CATALOG_DEGREE_ESTATAL : AppCatalogs.CATALOG_DIRECTOR_ESTATAL;
            }
        }
        if (rol==AppCatalogs.ROLE_SCHOOL_CONTROL) {
            if(user.getSchoolControlAdmin().getState()!=null){
                //if(user.getUserRolesBCS().getRolebcs().getId() == AppCatalogs.BCS_ROLE_CONTROL_ESCOLAR_ESTATAL_SISEC || user.getUserRolesBCS().getRolebcs().getId() == AppCatalogs.BCS_ROLE_CONTROL_ESCOLAR_ESTATAL){
                this.stateId = user.getSchoolControlAdmin().getState().getId();
                if ( user.getUserRolesBCS() != null) {
                    // this.adminSchoolId = user.getUserRolesBCS().getRolebcs().getId() == AppCatalogs.BCS_ROLE_DIRECCION ? 2 : 1;
                    this.adminSchoolId = user.getUserRolesBCS().getRolebcs().getId() == AppCatalogs.BCS_ROLE_CONTROL_ESCOLAR_ESTATAL_SISEC ? AppCatalogs.CATALOG_DOMINIO_VALIDATION_ESTATAL : AppCatalogs.CATALOG_SCHOOL_CONTROL_DOMINIO_VALIDATION_ESTATAL;
                }
                this.checkAdminNivel = AppCatalogs.CHECK_NIVEL_ESTATAL;
            }
            if(user.getSchoolControlAdmin().getSchool()!=null){
                //if(user.getUserRolesBCS().getRolebcs().getId() == AppCatalogs.BCS_ROLE_CONTROL_ESCOLAR_PLANTEL_SISEC || user.getUserRolesBCS().getRolebcs().getId() == AppCatalogs.BCS_ROLE_CONTROL_ESCOLAR_PLANTEL){
                this.stateId = user.getSchoolControlAdmin().getSchool().getCity().getState().getId();
                this.schoolId = user.getSchoolControlAdmin().getSchool().getId();
                //this.adminSchoolId = 1;
                //this.superUserId = 1;
                if ( user.getUserRolesBCS() != null) {
                    this.superUserId = user.getUserRolesBCS().getRolebcs().getId() == AppCatalogs.BCS_ROLE_CONTROL_ESCOLAR_PLANTEL_SISEC ? AppCatalogs.CATALOG_DOMINIO_VALIDATION_PLANTEL : AppCatalogs.CATALOG_SCHOOL_CONTROL_DOMINIO_VALIDATION_PLANTEL;
                }
                this.checkAdminNivel = AppCatalogs.CHECK_NIVEL_PLANTEL;
            }
        }
        if (rol==AppCatalogs.ROLE_TRACING_ADMIN){
            if(user.getGraduateTracingAdmin().getState()!=null) {
                this.stateId = user.getGraduateTracingAdmin().getState().getId();
                this.checkAdminNivel = AppCatalogs.CHECK_NIVEL_ESTATAL;
            }
            if (user.getGraduateTracingAdmin().getSchool()!=null){
                this.stateId=user.getGraduateTracingAdmin().getSchool().getCity().getState().getId();
                this.schoolId=user.getGraduateTracingAdmin().getSchool().getId();
                this.checkAdminNivel = AppCatalogs.CHECK_NIVEL_PLANTEL;
            }
        }
        //this.roleId=rol;
        if (rol == AppCatalogs.ROLE_CERTIFICATION_ADMIN) this.roleId = rol == AppCatalogs.ROLE_CERTIFICATION_ADMIN ? AppCatalogs.ROLE_SCHOOL_CONTROL : rol;
        if (rol == AppCatalogs.ROLE_TITULACION_ADMIN) this.roleId = rol == AppCatalogs.ROLE_TITULACION_ADMIN ?AppCatalogs.ROLE_SCHOOL_CONTROL : rol;
        this.password=user.getPassword();
    }*/
}