package mx.edu.cecyte.sisec.repo.people;

import mx.edu.cecyte.sisec.model.people.Persona;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

///Llamar al modelo
@Repository
public interface PersonaRepository extends JpaRepository<Persona, Integer> {
    @Query("SELECT persona " +
            "FROM Persona persona " +
            "WHERE persona.id IN :availablePersonaIds " +
            "AND persona.state.id = :stateId")
    List<Persona> findAllByIdAndStateId(Integer stateId, Set<Integer> availablePersonaIds);
    //List<Persona>findAllPersona();
    Integer countByCurp(String curp);
    Optional<Persona> findByCurp(String curp);
}
