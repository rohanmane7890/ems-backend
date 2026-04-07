package net.javaguides.ems.Config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "app")
@lombok.Data
public class AppProperties {

    private Jwt jwt = new Jwt();
    private Admin admin = new Admin();
    private Ai ai = new Ai();
    private Frontend frontend = new Frontend();

    @lombok.Data
    public static class Jwt {
        private String secret;
    }

    @lombok.Data
    public static class Admin {
        private String email;
        private String masterPin;
        private String defaultPassword;
    }

    @lombok.Data
    public static class Ai {
        private String apiKey;
    }

    @lombok.Data
    public static class Frontend {
        private String url;
    }
}
