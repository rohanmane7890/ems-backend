package net.javaguides.ems.service;

import java.util.List;
import net.javaguides.ems.dto.SalaryTransactionDTO;

public interface SalaryTransactionService {
    SalaryTransactionDTO recordPayment(SalaryTransactionDTO transactionDTO);
    List<SalaryTransactionDTO> getPaymentHistory(Long employeeId);
}
