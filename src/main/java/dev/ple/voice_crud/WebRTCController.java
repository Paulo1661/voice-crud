package dev.ple.voice_crud;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Controller
public class WebRTCController {
    private static final String OPENAI_API_URL = "https://api.openai.com/v1/realtime/sessions";
    @Value("${spring.ai.openai.api-key}")
    private String OPENAI_API_KEY;
    private static final HttpClient client = HttpClient.newHttpClient();


    @GetMapping("/api/rtc-create-ephemeral-token")
    public ResponseEntity<String> connectRTC() {
        return ResponseEntity.ok(createEphemeralToken());
    }

    private String createEphemeralToken() {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(OPENAI_API_URL))
                    .header("Authorization", "Bearer " + OPENAI_API_KEY)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString("""
                    {
                        "model": "gpt-4o-realtime-preview-2025-06-03",
                        "voice": "shimmer"
                    }
                """))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            return response.body();
        } catch (Exception e) {
            throw new RuntimeException("Failed to create ephemeral token", e);
        }
    }
}
