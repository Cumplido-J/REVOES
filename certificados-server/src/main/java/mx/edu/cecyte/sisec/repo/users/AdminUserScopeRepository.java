package mx.edu.cecyte.sisec.repo.users;

import mx.edu.cecyte.sisec.dto.UserSearchResult;
import mx.edu.cecyte.sisec.model.users.AdminUserScope;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdminUserScopeRepository extends JpaRepository < AdminUserScope, Integer> {
    @Query(value = "SELECT usuario.username, usuario.nombre, usuario.primer_apellido, usuario.segundo_apellido, detalle_alcance.estado_id, detalle_alcance.plantel_id" +
            " FROM administrador_alcance_usuario, usuario_rol, rol, usuario, cat_alcance_usuario, detalle_alcance, cat_estado, plantel\n" +
            " WHERE administrador_alcance_usuario.usuario_id=usuario_rol.usuario_id\n" +
            " AND usuario_rol.rol_id=rol.id\n" +
            " AND administrador_alcance_usuario.usuario_id=usuario.id\n" +
            " AND administrador_alcance_usuario.catalcance_id=cat_alcance_usuario.id\n" +
            " AND cat_alcance_usuario.id=detalle_alcance.catalcanceusuario_id \n" +
            " AND rol.id=:adminType ", nativeQuery = true)
    List<UserSearchResult> searchAdminUser(Integer adminType);
}
