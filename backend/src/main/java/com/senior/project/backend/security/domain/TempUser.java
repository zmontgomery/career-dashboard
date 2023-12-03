package com.senior.project.backend.security.domain;

import lombok.*;

/**
 * Temp User, will delete later
 * 
 * @author Jimmy Logan - jrl9984@rit.edu
 */
@Data
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Generated
public class TempUser {
    public String oid;
    public String name;
    public String email;
    public String role;
}
