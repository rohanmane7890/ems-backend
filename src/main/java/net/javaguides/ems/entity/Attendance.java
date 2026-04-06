package net.javaguides.ems.entity;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "attendance")
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long employeeId;
    private LocalDate date;
    @jakarta.persistence.Column(columnDefinition = "TIME")
    private LocalTime checkIn;

    @jakarta.persistence.Column(columnDefinition = "TIME")
    private LocalTime checkOut;
    private String status; // PRESENT, ABSENT, LEAVE, LATE
}
