package mx.edu.cecyte.sisec.dto.user;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ListGroupData {

    private Integer idGroup;
    private List<Integer> idPermission;
}
