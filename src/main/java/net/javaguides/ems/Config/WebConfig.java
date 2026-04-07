package net.javaguides.ems.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@SuppressWarnings("null")
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Map /uploads/** URL to file:C:/ems-uploads/
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:///C:/ems-uploads/");
    }
}
