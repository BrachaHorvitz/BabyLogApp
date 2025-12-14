package com.babylog.controller;

import com.babylog.dto.ActivityLogResponse;
import com.babylog.dto.CreateActivityLogRequest;
import com.babylog.service.ActivityLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/logs")
@RequiredArgsConstructor
public class ActivityLogController {

    private final ActivityLogService activityLogService;

    @PostMapping
    public ResponseEntity<ActivityLogResponse> create(@RequestBody CreateActivityLogRequest request) {
        ActivityLogResponse created = activityLogService.create(request);
        return ResponseEntity.ok(created);
    }
}
