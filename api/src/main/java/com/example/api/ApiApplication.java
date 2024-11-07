package com.example.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import javax.sql.DataSource;
import java.sql.Connection;

@SpringBootApplication
public class ApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiApplication.class, args);
    }

    @Bean
    public CommandLineRunner testConnection(DataSource dataSource) {
        return args -> {
            Connection connection = dataSource.getConnection();

            try (connection) {
                System.out.println("Database connected successfully!");
            } catch (Exception e) {
                System.err.println("Failed to connect to the database:");
                e.printStackTrace();
            }
        };
    }

}
