package com.example.api.repository;

import com.example.api.model.HistorySideBar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistorySideBarRepository extends JpaRepository<HistorySideBar, Integer> {

        /**
         * Find all HistorySideBar records for a given userId.
         *
         * @param userId the user ID to search for
         * @return a list of HistorySideBar objects associated with the given userId
         */
        List<HistorySideBar> findAllByUserId(String userId);
}