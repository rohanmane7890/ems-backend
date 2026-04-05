package net.javaguides.ems.Security;

import io.jsonwebtoken.*;
import net.javaguides.ems.entity.Employee;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtils {

    @org.springframework.beans.factory.annotation.Value("${app.jwt.secret}")
    private String jwtSecret;
    private final long expirationMs = 86400000; // 24 hours

    private SecretKey getSigningKey() {
        return io.jsonwebtoken.security.Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    public String generateToken(Employee employee) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", employee.getRole().name());
        claims.put("id", employee.getId());

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(employee.getEmail())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(getSigningKey())
                .compact();
    }

    public String getEmailFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public String getRoleFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("role", String.class);
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
