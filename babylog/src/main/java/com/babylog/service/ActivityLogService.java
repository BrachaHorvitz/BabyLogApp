package com.babylog.service;

import com.babylog.dto.ActivityLogResponse;
import com.babylog.dto.CreateActivityLogRequest;

public interface ActivityLogService {
    ActivityLogResponse create(CreateActivityLogRequest request);
}
