package mx.edu.cecyte.sisec.dto.masiveload.graduates;

import io.swagger.annotations.ApiModel;
import java.util.ArrayList;

@ApiModel(description="MasiveLoadGraduates")
public class MasiveLoadGraduates {

    private ArrayList<GraduadosCarga> graduadosAlumnos;

    public MasiveLoadGraduates() {
    }

    public MasiveLoadGraduates(ArrayList<GraduadosCarga> graduadosAlumnos) {
        this.graduadosAlumnos = graduadosAlumnos;
    }

    public ArrayList<GraduadosCarga> getGraduadosAlumnos() {
        return graduadosAlumnos;
    }

    public void setGraduadosAlumnos(ArrayList<GraduadosCarga> graduadosAlumnos) {
        this.graduadosAlumnos = graduadosAlumnos;
    }

}