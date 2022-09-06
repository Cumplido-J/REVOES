package mx.edu.cecyte.sisec.dto.certificate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class CertificateCurps {
    private Integer certificateTypeId;
    private List<String> curps;
}
