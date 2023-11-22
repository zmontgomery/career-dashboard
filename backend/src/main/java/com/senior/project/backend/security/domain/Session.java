package com.senior.project.backend.security.domain;

import java.time.Instant;
import java.util.Date;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.Builder.Default;

@Data
@Entity
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Session {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    // FIXME replace with user id
    private String email;

    @Temporal(value = TemporalType.TIMESTAMP)
    private Date signInDate;

    @Temporal(value = TemporalType.TIMESTAMP)
    private Date expiryDate;

    @Temporal(value = TemporalType.TIMESTAMP)
    private Date lastUsed;

    @Default()
    private boolean valid = true;

    public boolean isExpired() {
        // Date now = Date.from(Instant.now());
        // return now.after(expiryDate) || now.equals(expiryDate);
        // return true;
        return false;
    }

    public boolean isInRefreshRange() {
        // Date now = Date.from(Instant.now());
        // Date hourBeforeExpiry = Date.from(expiryDate.toInstant().minusSeconds(3600));
        // return hourBeforeExpiry.before(now) && expiryDate.after(now);
        return true;
    }

    public void update() {
        lastUsed = Date.from(Instant.now());
    }
}
