package mx.edu.cecyte.sisec.config;

import io.jsonwebtoken.*;
import lombok.extern.log4j.Log4j;
import mx.edu.cecyte.sisec.shared.UserSession;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.Calendar;
import java.util.Date;

@Log4j
@Component
public class JwtTokenProvider {

    @Value("${app.jwtSecret}") private String jwtSecret;

    @Value("${app.jwtExpirationInMs}") private int jwtExpirationInMs;

    public String generateToken(Authentication authentication) {
        UserSession userSession = (UserSession) authentication.getPrincipal();

        Date now = Calendar.getInstance().getTime();
        Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);

        return Jwts.builder()
                .setSubject(String.valueOf(userSession.getId()))
                .setIssuedAt(new Date())
                .setExpiration(expiryDate)
                .signWith(SignatureAlgorithm.HS512, jwtSecret.getBytes())
                .compact();
    }

    public Integer getUserIdFromJWT(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(jwtSecret.getBytes())
                .parseClaimsJws(token)
                .getBody();

        return Integer.valueOf((claims.getSubject()));
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parser().setSigningKey(jwtSecret.getBytes()).parseClaimsJws(authToken);
            return true;
        } catch (SignatureException ex) {
//            log.error("Invalid JWT signature");
        } catch (MalformedJwtException ex) {
//            log.error("Invalid JWT token");
        } catch (ExpiredJwtException ex) {
            log.error("Expired JWT token");
        } catch (UnsupportedJwtException ex) {
            log.error("Unsupported JWT token");
        } catch (IllegalArgumentException ex) {
            log.error("JWT claims string is empty.");
        }
        return false;
    }
}
