package mx.edu.cecyte.sisec.dto.student;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class StudentPasswordDto {
    private String password;
    private String passwordConfirm;

}
