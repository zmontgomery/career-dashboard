package com.senior.project.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@SpringBootApplication
@EnableScheduling
public class BackendApplication {

    public static void main(String[] args) {

        List<String> envVars = Arrays.asList("CRD_DB_PASSWORD", "EMAIL_PASSWORD");

        List<String> missingVars = new ArrayList<>();
        for (String var : envVars) {
            if (System.getenv(var) == null) {
                missingVars.add(var);
            }
        }

        if (!missingVars.isEmpty()) {
            System.out.println("Required environment variables are not defined: " + missingVars);
            return;
        }
        SpringApplication.run(BackendApplication.class, args);
    }
}