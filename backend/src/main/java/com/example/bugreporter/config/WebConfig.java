package com.example.bugreporter.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {
    
    @Value("${cors.allowed-origins:*}")
    private String allowedOrigins;
    
    @Value("${cors.allowed-methods:GET,POST,PUT,DELETE}")
    private String allowedMethods;
    
    @Value("${cors.max-age:3600}")
    private long maxAge;
    
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                if ("*".equals(allowedOrigins)) {
                    // When using wildcard origin, we cannot use allowCredentials(true)
                    registry.addMapping("/api/**")
                            .allowedOrigins(allowedOrigins)
                            .allowedMethods(allowedMethods.split(","))
                            .allowCredentials(false)
                            .maxAge(maxAge);
                } else {
                    // When using specific origins, we can use allowCredentials(true)
                    registry.addMapping("/api/**")
                            .allowedOrigins(allowedOrigins.split(","))
                            .allowedMethods(allowedMethods.split(","))
                            .allowCredentials(true)
                            .maxAge(maxAge);
                }
            }
        };
    }
} 