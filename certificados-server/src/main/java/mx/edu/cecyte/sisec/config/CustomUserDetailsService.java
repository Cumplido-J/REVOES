package mx.edu.cecyte.sisec.config;

import mx.edu.cecyte.sisec.model.users.User;
import mx.edu.cecyte.sisec.queries.UserQueries;
import mx.edu.cecyte.sisec.shared.UserSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    @Autowired private UserQueries userQueries;

    @Override @Transactional public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userQueries.getUserByUsername(username);
        return UserSession.create(user);
    }

    @Transactional public UserDetails loadUserById(Integer userId) {
        User user = userQueries.getUserById(userId);
        return UserSession.create(user);
    }
}
