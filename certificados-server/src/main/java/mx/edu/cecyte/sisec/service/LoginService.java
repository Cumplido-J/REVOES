package mx.edu.cecyte.sisec.service;

import mx.edu.cecyte.sisec.config.JwtTokenProvider;
import mx.edu.cecyte.sisec.devfunctions.CryptographyAES;
import mx.edu.cecyte.sisec.dto.profile.LoginRequest;
import mx.edu.cecyte.sisec.dto.profile.StudentProfile;
import mx.edu.cecyte.sisec.dto.profile.StudentProfileSurveys;
import mx.edu.cecyte.sisec.dto.profile.UserProfile;
import mx.edu.cecyte.sisec.dto.webServiceCertificate.CryptographyLogin;
import mx.edu.cecyte.sisec.model.users.User;
import mx.edu.cecyte.sisec.queries.StudentQueries;
import mx.edu.cecyte.sisec.queries.UserQueries;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.Messages;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class LoginService {

    @Autowired private UserQueries userQueries;
    @Autowired private StudentQueries studentQueries;
    @Autowired private JwtTokenProvider tokenProvider;
    @Autowired private AuthenticationManager authenticationManager;

    public String loginUser(LoginRequest loginRequest) {
        if (!loginRequest.getIsLoginSISEC()){
            CryptographyLogin resp = CryptographyAES.Dencrypt_Success(loginRequest.getUsername(), loginRequest.getPassword(), loginRequest.getSecretKey() ) ;
            loginRequest.setUsername(resp.getUsername());
            loginRequest.setPassword(resp.getPassword());
        }
        boolean usernameExists = userQueries.usernameExists(loginRequest.getUsername());
        if (!usernameExists) throw new AppException(Messages.user_wrongUsername);
        boolean isActive = userQueries.ifUserIsActive(loginRequest.getUsername());
        if (!isActive) throw new AppException("Esta cuenta ha caducado.");

        try {
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword());
            Authentication authentication = authenticationManager.authenticate(authenticationToken);
            SecurityContextHolder.getContext().setAuthentication(authentication);
            return tokenProvider.generateToken(authentication);
        } catch (BadCredentialsException exception) {
            throw new AppException(Messages.user_wrongPassword);
        }
    }

    public Map<String, Object> getUserProfile(String username) {
        Map<String, Object> response = new HashMap<>();
        if (username == null) return response;

        User user = userQueries.getUserByUsername(username);

        UserProfile userProfile = new UserProfile(user);
        Set<Integer> roles = userQueries.getRolesIdByUser(user);

        response.put("userProfile", userProfile);
        response.put("roles", roles);

        if (user.getStudent() != null) {
            StudentProfile studentProfile = new StudentProfile(user.getStudent());
            List<StudentProfileSurveys> surveys = studentQueries.getAvailableSurveys(user.getStudent());
            response.put("studentProfile", studentProfile);
            response.put("surveys", surveys);
        }

        return response;
    }
}
