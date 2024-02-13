package com.senior.project.backend.artifact;
import com.senior.project.backend.domain.Artifact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ArtifactRepository extends JpaRepository<Artifact, Long> {
    // additional query methods if needed

    @Query("SELECT a FROM Artifact a WHERE a.fileLocation LIKE %:internalName")
    public Artifact findByUniqueIdentifier(@Param("internalName") String internalName);
}
