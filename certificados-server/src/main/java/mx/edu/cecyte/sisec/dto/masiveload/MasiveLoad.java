package mx.edu.cecyte.sisec.dto.masiveload;
import java.util.ArrayList;

import io.swagger.annotations.ApiModel;

@ApiModel(description="MasiveLoad")
public class MasiveLoad {

    private ArrayList<AlumnoCarga> cargaAlumnos;

    public MasiveLoad() {
    }

    public MasiveLoad(ArrayList<AlumnoCarga> cargaAlumnos) {
        this.cargaAlumnos = cargaAlumnos;
    }

    public ArrayList<AlumnoCarga> getCargaAlumnos() {
        return cargaAlumnos;
    }

    public void setCargaAlumnos(ArrayList<AlumnoCarga> cargaAlumnos) {
        this.cargaAlumnos = cargaAlumnos;
    }

    @Override
    public String toString() {
        return "MasiveLoad{" +
                "cargaAlumnos=" + cargaAlumnos +
                '}';
    }
}