package mx.edu.cecyte.sisec.dto.masiveload;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;

public class AlumnoCarga {
    private  String curp;
    private  String nombre;
    private  String primer_apellido;
    private  String segundo_apellido;
    private  String matricula;
    private  String cct;
    private  String clave_carrera;
    private  String nombre_carrera;
    private  Double promedio;
    private String entidad;
    private String generacion;
    private String fechaTermino;
    private ArrayList<Competencia> competencias;

    public AlumnoCarga() {
    }

    public AlumnoCarga(String curp, String nombre, String primer_apellido, String segundo_apellido, String matricula, String cct, String clave_carrera, String nombre_carrera, Double promedio, String entidad, String generacion, String fechaTermino, ArrayList<Competencia> competencias) {
        this.curp = curp;
        this.nombre = nombre;
        this.primer_apellido = primer_apellido;
        this.segundo_apellido = segundo_apellido;
        this.matricula = matricula;
        this.cct = cct;
        this.clave_carrera = clave_carrera;
        this.nombre_carrera = nombre_carrera;
        this.promedio = promedio;
        this.entidad = entidad;
        this.generacion = generacion;
        this.fechaTermino = fechaTermino;
        this.competencias = competencias;
    }

    public String getCurp() {
        return curp;
    }

    public void setCurp(String curp) {
        this.curp = curp;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getPrimer_apellido() {
        return primer_apellido;
    }

    public void setPrimer_apellido(String primer_apellido) {
        this.primer_apellido = primer_apellido;
    }

    public String getSegundo_apellido() {
        return segundo_apellido;
    }

    public void setSegundo_apellido(String segundo_apellido) {
        this.segundo_apellido = segundo_apellido;
    }

    public String getMatricula() {
        return matricula;
    }

    public void setMatricula(String matricula) {
        this.matricula = matricula;
    }

    public String getCct() {
        return cct;
    }

    public void setCct(String cct) {
        this.cct = cct;
    }

    public String getClave_carrera() {
        return clave_carrera;
    }

    public void setClave_carrera(String clave_carrera) {
        this.clave_carrera = clave_carrera;
    }

    public String getNombre_carrera() {
        return nombre_carrera;
    }

    public void setNombre_carrera(String nombre_carrera) {
        this.nombre_carrera = nombre_carrera;
    }

    public Double getPromedio() {
        return promedio;
    }

    public void setPromedio(Double promedio) {
        this.promedio = promedio;
    }

    public String getEntidad() {
        return entidad;
    }

    public void setEntidad(String entidad) {
        this.entidad = entidad;
    }

    public String getGeneracion() {
        return generacion;
    }

    public void setGeneracion(String generacion) {
        this.generacion = generacion;
    }

    public String getFechaTermino() { return fechaTermino; }

    public void setFechaTermino(String fechaTermino) { this.fechaTermino = fechaTermino; }

    public ArrayList<Competencia> getCompetencias() {
        return competencias;
    }

    public void setCompetencias(ArrayList<Competencia> competencias) {
        this.competencias = competencias;
    }

    @Override
    public String toString() {
        return "AlumnoCarga{" +
                "curp='" + curp + '\'' +
                ", nombre='" + nombre + '\'' +
                ", primer_apellido='" + primer_apellido + '\'' +
                ", segundo_apellido='" + segundo_apellido + '\'' +
                ", matricula='" + matricula + '\'' +
                ", cct='" + cct + '\'' +
                ", clave_carrera='" + clave_carrera + '\'' +
                ", nombre_carrera='" + nombre_carrera + '\'' +
                ", promedio=" + promedio +
                ", entidad='" + entidad + '\'' +
                ", generacion='" + generacion + '\'' +
                ", fechaTermino='" + fechaTermino + '\'' +
                ", competencias=" + competencias +
                '}';
    }
}
