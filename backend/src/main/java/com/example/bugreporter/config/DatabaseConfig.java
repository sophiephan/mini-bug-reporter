package com.example.bugreporter.config;

import org.springframework.boot.autoconfigure.flyway.FlywayMigrationStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Configuration
public class DatabaseConfig {
    private static final Logger logger = LoggerFactory.getLogger(DatabaseConfig.class);

    /**
     * Custom Flyway migration strategy that logs migration information
     */
    @Bean
    public FlywayMigrationStrategy flywayMigrationStrategy() {
        return flyway -> {
            // Log migration information
            logger.info("Running Flyway migrations");
            flyway.migrate();
            logger.info("Flyway migrations completed successfully");
        };
    }
    
    /**
     * Development-only configuration
     */
    @Configuration
    @Profile("dev")
    public static class DevDatabaseConfig {
        private static final Logger logger = LoggerFactory.getLogger(DevDatabaseConfig.class);
        
        @Bean
        public FlywayMigrationStrategy devFlywayMigrationStrategy() {
            return flyway -> {
                // Clean database in development for fresh start
                logger.info("Development mode: cleaning database before migration");
                flyway.clean();
                flyway.migrate();
            };
        }
    }
} 