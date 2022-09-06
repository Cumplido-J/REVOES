package mx.edu.cecyte.sisec.dto.webServiceCertificate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.cecyte.sisec.dto.certificate.CertificateCurpsFiel;
import mx.edu.cecyte.sisec.model.mec.MecCredentials;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnswerCertificate {
    private String message;
    private String status;

    public  AnswerCertificate( MecCredentials mecCredentials, CertificateCurpsFiel certificateCurpsFiel){
        System.out.println("->"+mecCredentials.getAuthentificationWS());
        if (mecCredentials.getAuthentificationWS().equals("P")){
            if (certificateCurpsFiel.getIsTest()){ this.status="Certificación de unicamente de prueba1";}
            else{
                this.status="Certificación en producción";
            }
        }else{
            this.status="Certificación de unicamente de prueba2";
        }
        this.message="Los alumnos han sido cargados. Ejecutar el servicio de sincronización.";
    }
}
