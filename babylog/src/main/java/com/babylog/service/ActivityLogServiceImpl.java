package com.babylog.service;

import com.babylog.dto.ActivityLogResponse;
import com.babylog.dto.CreateActivityLogRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ActivityLogServiceImpl implements ActivityLogService {

    @Override
    public ActivityLogResponse create(CreateActivityLogRequest request) {
        // TODO: next step - map request -> entity, save via repository, map entity -> response
        return new ActivityLogResponse();
    }
}
