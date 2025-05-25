package com.example.bugreporter;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BugRepository extends JpaRepository<Bug, Long> {
    List<Bug> findByStatusOrderByCreatedAtDesc(Bug.Status status);
    List<Bug> findAllByOrderByCreatedAtDesc();
}