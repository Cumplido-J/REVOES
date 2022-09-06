package mx.edu.cecyte.sisec.dto.masiveload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;
@Data
@Builder
@AllArgsConstructor
public class MasiveContentScore {
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
    private List<Competencia> competencias;
}
