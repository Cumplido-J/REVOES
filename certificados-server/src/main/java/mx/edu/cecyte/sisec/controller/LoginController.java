package mx.edu.cecyte.sisec.controller;

import lombok.extern.log4j.Log4j;
import mx.edu.cecyte.sisec.dto.profile.LoginRequest;
import mx.edu.cecyte.sisec.log.LoignLogger;
import mx.edu.cecyte.sisec.service.LoginService;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.CustomResponseEntity;
import mx.edu.cecyte.sisec.shared.LoggedUser;
import mx.edu.cecyte.sisec.shared.UserSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@Log4j
@CrossOrigin
public class LoginController {
    @Autowired private LoginService loginService;

    @PostMapping
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            String jwtToken = loginService.loginUser(loginRequest);
            return CustomResponseEntity.OK(jwtToken);
        } catch (AppException exception) {
            LoignLogger.login(log, exception.getMessage(), loginRequest);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            LoignLogger.login(log, exception.toString(), loginRequest);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/userProfile")
    public ResponseEntity<?> getUserProfile(@LoggedUser UserSession userSession) {
        try {
            String username = null;
            if (userSession != null) username = userSession.getUsername();
            Map<String, Object> userProfile = loginService.getUserProfile(username);
            return CustomResponseEntity.OK(userProfile);
        } catch (AppException exception) {
            LoignLogger.userProfile(log, exception.getMessage(), userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            LoignLogger.userProfile(log, exception.toString(), userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }
}
