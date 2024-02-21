package com.senior.project.backend.artifact;
import com.senior.project.backend.domain.Artifact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository to interact with the artifact table
 */
@Repository
public interface ArtifactRepository extends JpaRepository<Artifact, Long> {
    @Query("SELECT a FROM Artifact a WHERE a.fileLocation LIKE %:internalName")
    public Optional<Artifact> findByUniqueIdentifier(@Param("internalName") String internalName);
}
