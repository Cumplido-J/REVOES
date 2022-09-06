package mx.edu.cecyte.sisec.dto.school;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class SchoolDto{
    private Integer schoolcareerId;
    private Integer careerId;
}