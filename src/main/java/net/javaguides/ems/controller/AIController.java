package net.javaguides.ems.controller;

import net.javaguides.ems.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/ai")
public class AIController {

    @Autowired
    private AIService aiService;

    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, String> request) {
        String message = request.get("message");
        String role = request.get("role"); // ADMIN or EMPLOYEE
        String name = request.get("name"); // Name of the logged in user
        
        String response = aiService.generateResponse(message, role, name);
        return ResponseEntity.ok(Map.of("response", response));
    }
}
