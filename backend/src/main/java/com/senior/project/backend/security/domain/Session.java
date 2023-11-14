package com.senior.project.backend.security.domain;

import java.time.Instant;
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
    private Date expiryDate;
    private Date lastUsed;

    public boolean isExpired() {
        Date now = Date.from(Instant.now());
        return now.after(expiryDate) || now.equals(expiryDate);
    }

    public boolean isInRefreshRange() {
        Date now = Date.from(Instant.now());
        Date hourBeforeExpiry = Date.from(expiryDate.toInstant().minusSeconds(3600));
        return hourBeforeExpiry.before(now) && expiryDate.after(now);
    }

    public void update() {
        lastUsed = Date.from(Instant.now());
    }
}
