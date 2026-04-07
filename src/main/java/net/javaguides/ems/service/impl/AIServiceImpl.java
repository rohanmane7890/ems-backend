package net.javaguides.ems.service.impl;

import net.javaguides.ems.repository.AttendanceRepository;
import net.javaguides.ems.repository.EmployeeRepository;
import net.javaguides.ems.repository.LeaveRequestRepository;
import net.javaguides.ems.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
public class AIServiceImpl implements AIService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Value("${app.ai.api-key:}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=";

    @Override
    public String generateResponse(String message, String role, String name) {
        long totalEmployees = employeeRepository.count();
        long presentToday = attendanceRepository.countByDate(LocalDate.now());
        long pendingLeaves = leaveRequestRepository.findAll().stream()
                .filter(l -> "PENDING".equals(l.getStatus()))
                .count();

        String systemContext = String.format(
            "You are 'NexGen AI', a professional HR assistant for NexGen Elite. " +
            "CONTEXT: Total Employees: %d, Present Today: %d, Pending Leaves: %d. " +
            "Instructions: Be professional and futuristic. Use the data above for stats.",
            totalEmployees, presentToday, pendingLeaves
        );

        if (apiKey != null && !apiKey.isEmpty() && !apiKey.equals("REPLACE_WITH_YOUR_KEY")) {
            try {
                return callGeminiAPI(systemContext, message);
            } catch (Exception e) {
                System.err.println("AI Error: " + e.getMessage());
            }
        }

        return runPrototypeEngine(message, role, name, totalEmployees, presentToday, pendingLeaves);
    }

    private String callGeminiAPI(String context, String userMessage) {
        String url = GEMINI_URL + apiKey;
        Map<String, Object> body = Map.of("contents", List.of(Map.of("parts", List.of(Map.of("text", context + "\n\nUser: " + userMessage)))));
        
        try {
            ResponseEntity<GeminiResponse> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                new HttpEntity<>(body),
                GeminiResponse.class
            );
            
            GeminiResponse responseBody = response.getBody();
            if (responseBody == null || responseBody.candidates == null || responseBody.candidates.isEmpty()) {
                return "AI link disrupted.";
            }

            return responseBody.candidates.get(0).content.parts.get(0).text;
        } catch (Exception e) {
            return "Neural link instability detected. Continuing in Prototype Hub Mode.";
        }
    }

    // Type-safe DTOs for Gemini API Response
    private static class GeminiResponse {
        public List<Candidate> candidates;
        static class Candidate { public Content content; }
        static class Content { public List<Part> parts; }
        static class Part { public String text; }
    }

    private String runPrototypeEngine(String message, String role, String name, long totalEmployees, long presentToday, long pendingLeaves) {
        String msg = message.toLowerCase();
        if (msg.contains("hi") || msg.contains("hello")) return "Greeting acknowledged, " + name + ". How can I assist with your mission?";
        if (msg.contains("total employees") || msg.contains("staff count")) return "The current workforce consists of " + totalEmployees + " personnel.";
        if (msg.contains("absent") || msg.contains("presence")) return "Today's report shows " + presentToday + " personnel present.";
        return "Command received. I am NexGen AI, ready to monitor your workspace.";
    }
}
