package com.example.api.model;

import jakarta.persistence.*;

@Entity
@Table(name = "history_sidebar")
public class HistorySideBar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(unique = true)
    private String userId;

    @Column(name = "months_years_id", nullable = false)
    private Long monthsYearsId;

    // Getters and setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Long getMonthsYearsId() {
        return monthsYearsId;
    }

    public void setMonthsYearsId(Long monthsYearsId) {
        this.monthsYearsId = monthsYearsId;
    }

    // toString method for easy printing
    @Override
    public String toString() {
        return "HistorySideBar{" +
                "id=" + id +
                ", userId='" + userId + '\'' +
                ", monthsYearsId=" + monthsYearsId +
                '}';
    }
}
