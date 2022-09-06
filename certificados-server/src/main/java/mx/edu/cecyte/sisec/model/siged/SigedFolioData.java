package mx.edu.cecyte.sisec.model.siged;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SigedFolioData {
    private Integer certificadoId;
    private String folio;
    private String curp;
    private String nombres;
    private String primerApellido;
    private String segundoApellido;
    private String institucion;
    private String fechaCertificado;
    private String estatus;
    private String tipoCertificado;
    private String promedio;
    private String promedioTexto;
    private String carrera;
    private String tipo;
    private String idEntidadFederativa;
    private String entidadFederativa;
    private String fechaEmision;
}
