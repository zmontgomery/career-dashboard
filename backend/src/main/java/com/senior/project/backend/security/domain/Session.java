package com.senior.project.backend.security.domain;

import java.util.Date;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
@Builder
@AllArgsConstructor
public class Session {
    private UUID sessionID;
    private TempUser user;
    private Date signInDate;
}
