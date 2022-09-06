package mx.edu.cecyte.sisec.model.siged;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SigedFolioApiResponse {
    private List<SigedFolioData> datos;
}
