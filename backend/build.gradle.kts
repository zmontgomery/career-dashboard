plugins {
    java
    id("jacoco")
    id("org.springframework.boot") version "3.1.4"
    id("io.spring.dependency-management") version "1.1.3"
}

group = "com.senior.project"
version = "0.0.1"

java {
    sourceCompatibility = JavaVersion.VERSION_17
}

repositories {
    mavenCentral()
}

dependencies {
    developmentOnly("org.springframework.boot:spring-boot-devtools")

    implementation("org.springframework.boot:spring-boot-starter-webflux")

    // Lombok
    compileOnly("org.projectlombok:lombok:1.18.20")
    annotationProcessor("org.projectlombok:lombok:1.18.20")
    implementation("org.projectlombok:lombok:1.18.28")

    // Security
    implementation("org.bitbucket.b_c:jose4j:0.6.0")
    implementation("com.google.api-client:google-api-client:1.32.1")
    implementation("com.google.code.gson:gson:2.10.1")
    implementation("org.springframework.boot:spring-boot-starter-security")

    // Spring Boot Starter Data JPA
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    // Database driver
    implementation("mysql:mysql-connector-java:8.0.33")
    // Flyway
    implementation("org.flywaydb:flyway-mysql")
    implementation("org.flywaydb:flyway-core")

    // Test dependecies
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("io.projectreactor:reactor-test")
    testImplementation("org.mockito:mockito-core")
}

tasks.withType<Test> {
    useJUnitPlatform()
}

tasks.test {
    finalizedBy(tasks.jacocoTestReport) // Generate the report after running tests
}

// tasks.jacocoTestReport {
//     group = "Reporting"
//     description = "Generate Jacoco coverage reports"

//     classDirectories.setFrom(
//             fileTree("${buildDir}/src/main/java/com/senior/project/backend") {
//                 setExcludes(setOf(
//                     "/util"
//                 ))
//             }
//     ) 
// }


tasks.register("setupEnvironmentVariables") {
    if (System.getenv("CRD_DB_PASSWORD") == null) {
        throw IllegalStateException("Required environment variable is not defined: CRD_DB_PASSWORD")
    }
}

tasks.named("bootRun") {
    dependsOn("setupEnvironmentVariables")
}
