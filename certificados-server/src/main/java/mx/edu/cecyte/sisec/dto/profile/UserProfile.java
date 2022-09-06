package mx.edu.cecyte.sisec.dto.profile;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.edu.cecyte.sisec.model.users.User;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfile {
    private String curp;
    private String name;
    private String firstLastName;
    private String secondLastName;

    public UserProfile(User user) {
        this.curp = user.getUsername();
        this.name = user.getName();
        this.firstLastName = user.getFirstLastName();
        this.secondLastName = user.getSecondLastName();
    }
}
