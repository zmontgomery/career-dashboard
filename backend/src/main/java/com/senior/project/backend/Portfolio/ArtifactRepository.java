package com.senior.project.backend.Portfolio;
import com.senior.project.backend.domain.Artifact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArtifactRepository extends JpaRepository<Artifact, Long> {
    // additional query methods if needed
}
