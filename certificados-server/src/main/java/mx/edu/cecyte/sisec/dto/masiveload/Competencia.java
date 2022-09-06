package mx.edu.cecyte.sisec.dto.masiveload;

import java.text.DecimalFormat;

public class Competencia {

    private String competencia;
    private Double calificacion;

    public Competencia() {
    }

    public Competencia(String competencia, Double calificacion) {
        this.competencia = competencia;
        this.calificacion = calificacion;
    }

    public String getCompetencia() {
        return competencia;
    }

    public void setCompetencia(String competencia) {
        this.competencia = competencia;
    }

    public Double getCalificacion() {
        return calificacion;
    }

    public void setCalificacion(Double calificacion) {
        //new DecimalFormat("#.##").format(dblVar);
        this.calificacion = calificacion;
    }

    @Override
    public String toString() {
        return "{" +
                "competencia='" + competencia + '\'' +
                ", calificacion=" + calificacion +
                '}';
    }
}
