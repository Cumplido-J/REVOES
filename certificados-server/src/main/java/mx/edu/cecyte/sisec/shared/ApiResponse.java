package mx.edu.cecyte.sisec.shared;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse {
    private Boolean success;
    private String message;

    public static ApiResponse Success(String message) {
        return new ApiResponse(true, message);
    }
}
