package com.babylog.controller;

import com.babylog.dto.BabyLogRequest;
import com.babylog.service.BabyLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/analyze")
@RequiredArgsConstructor
public class BabyLogController {

    private final BabyLogService babyLogService;

    @PostMapping
    public ResponseEntity<String> analyzeLog(@RequestBody BabyLogRequest request) {
        String result = babyLogService.analyzeLog(request);
        return ResponseEntity.ok(result);
    }
}