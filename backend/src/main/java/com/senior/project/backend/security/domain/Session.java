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

/**
 * A domain object to represent a session in the database
 * 
 * @author Jimmy Logan - jrl9984@rit.edu
 */
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

    /**
     * Checks if a token is expired
     * @return expiry status
     */
    public boolean isExpired() {
        Date now = Date.from(Instant.now());
        return now.after(expiryDate) || now.equals(expiryDate);
    }

    /**
     * Checks if a token can be refreshed
     * @return refresh status
     */
    public boolean isInRefreshRange() {
        Date now = Date.from(Instant.now());
        Date hourBeforeExpiry = Date.from(expiryDate.toInstant().minusSeconds(3600));
        return hourBeforeExpiry.before(now) && expiryDate.after(now);
    }

    /**
     * Updates the date the token was last used
     */
    public void update() {
        lastUsed = Date.from(Instant.now());
    }
}
