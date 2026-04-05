package net.javaguides.ems.Config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Getter;
import lombok.Setter;

@Configuration
@ConfigurationProperties(prefix = "app")
@Getter
@Setter
public class AppProperties {

    private final Jwt jwt = new Jwt();
    private final Admin admin = new Admin();

    @Getter
    @Setter
    public static class Jwt {
        private String secret;
    }

    @Getter
    @Setter
    public static class Admin {
        private String email;
        private String masterPin;
        private String defaultPassword;
    }
}
