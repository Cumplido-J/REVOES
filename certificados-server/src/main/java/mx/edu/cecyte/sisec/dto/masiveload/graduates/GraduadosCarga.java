package mx.edu.cecyte.sisec.dto.masiveload.graduates;

public class GraduadosCarga {
    private String colegio;
    private String cct;
    private String turno;
    private String cve_carrera;
    private String nombre_carrera;
    private String matricula;
    private String nombre;
    private String ap_paterno;
    private String ap_materno;
    private String curp;
    private String genero;
    private String correo;
    private String grupo;
    private String generacion;

    public GraduadosCarga(String colegio, String cct, String turno, String cve_carrera, String nombre_carrera, String matricula, String nombre, String ap_paterno, String ap_materno, String curp, String genero, String correo, String grupo, String generacion) {
        this.colegio = colegio;
        this.cct = cct;
        this.turno = turno;
        this.cve_carrera = cve_carrera;
        this.nombre_carrera = nombre_carrera;
        this.matricula = matricula;
        this.nombre = nombre;
        this.ap_paterno = ap_paterno;
        this.ap_materno = ap_materno;
        this.curp = curp;
        this.genero = genero;
        this.correo = correo;
        this.grupo = grupo;
        this.generacion = generacion;
    }

    public GraduadosCarga() {
    }

    public String getColegio() {
        return colegio;
    }

    public void setColegio(String colegio) {
        this.colegio = colegio;
    }

    public String getCct() {
        return cct;
    }

    public void setCct(String cct) {
        this.cct = cct;
    }

    public String getTurno() {
        return turno;
    }

    public void setTurno(String turno) {
        this.turno = turno;
    }

    public String getCve_carrera() {
        return cve_carrera;
    }

    public void setCve_carrera(String cve_carrera) {
        this.cve_carrera = cve_carrera;
    }

    public String getNombre_carrera() {
        return nombre_carrera;
    }

    public void setNombre_carrera(String nombre_carrera) {
        this.nombre_carrera = nombre_carrera;
    }

    public String getMatricula() {
        return matricula;
    }

    public void setMatricula(String matricula) {
        this.matricula = matricula;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getAp_paterno() {
        return ap_paterno;
    }

    public void setAp_paterno(String ap_paterno) {
        this.ap_paterno = ap_paterno;
    }

    public String getAp_materno() {
        return ap_materno;
    }

    public void setAp_materno(String ap_materno) {
        this.ap_materno = ap_materno;
    }

    public String getCurp() {
        return curp;
    }

    public void setCurp(String curp) {
        this.curp = curp;
    }

    public String getGenero() {
        return genero;
    }

    public void setGenero(String genero) {
        this.genero = genero;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getGrupo() {
        return grupo;
    }

    public void setGrupo(String grupo) {
        this.grupo = grupo;
    }

    public String getGeneracion() {
        return generacion;
    }

    public void setGeneracion(String generacion) {
        this.generacion = generacion;
    }

    @Override
    public String toString() {
        return "GraduadosCarga{" +
                "colegio='" + colegio + '\'' +
                ", cct='" + cct + '\'' +
                ", turno='" + turno + '\'' +
                ", cve_carrera='" + cve_carrera + '\'' +
                ", nombre_carrera='" + nombre_carrera + '\'' +
                ", matricula='" + matricula + '\'' +
                ", nombre='" + nombre + '\'' +
                ", ap_paterno='" + ap_paterno + '\'' +
                ", ap_materno='" + ap_materno + '\'' +
                ", curp='" + curp + '\'' +
                ", genero='" + genero + '\'' +
                ", correo='" + correo + '\'' +
                ", grupo='" + grupo + '\'' +
                ", generacion='" + generacion + '\'' +
                '}';
    }
}
