package mx.edu.cecyte.sisec.service;

import mx.edu.cecyte.sisec.dto.catalogs.Catalog;
import mx.edu.cecyte.sisec.model.users.Role;
import mx.edu.cecyte.sisec.repo.users.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoleService {
    @Autowired private RoleRepository roleRepository;

    public List<Catalog> getAllRoles() {
        List<Role> roles = roleRepository.findAll();
        return roles.stream().map(role -> new Catalog(role.getId(), role.getName())).collect(Collectors.toList());
    }
}
