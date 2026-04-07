package net.javaguides.ems.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SalaryTransactionDTO {

    private Long id;
    private Long employeeId;
    private Double amount;
    private String paymentMonth;
    private LocalDateTime transactionDate;
    private String status;
    private String referenceId;
}
