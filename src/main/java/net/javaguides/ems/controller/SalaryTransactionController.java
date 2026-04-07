package net.javaguides.ems.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;
import net.javaguides.ems.dto.SalaryTransactionDTO;
import net.javaguides.ems.service.SalaryTransactionService;

@RestController
@RequestMapping("/api/salaries")
@AllArgsConstructor
public class SalaryTransactionController {

    private final SalaryTransactionService service;

    @PostMapping("/pay")
    public ResponseEntity<SalaryTransactionDTO> recordPayment(@RequestBody SalaryTransactionDTO dto) {
        return ResponseEntity.ok(service.recordPayment(dto));
    }

    @GetMapping("/history/{employeeId}")
    public ResponseEntity<List<SalaryTransactionDTO>> getHistory(@PathVariable Long employeeId) {
        return ResponseEntity.ok(service.getPaymentHistory(employeeId));
    }
}
