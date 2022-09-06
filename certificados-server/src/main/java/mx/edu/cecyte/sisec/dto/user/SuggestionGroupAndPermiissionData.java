package mx.edu.cecyte.sisec.dto.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data @NoArgsConstructor @AllArgsConstructor
public class SuggestionGroupAndPermiissionData {

    private String key;

    private String title;

    private List< TransferKeyData > children;

    public SuggestionGroupAndPermiissionData(String key, String title){
        this.key = key;
        this.title = title;
    }
}
