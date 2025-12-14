package com.babylog.service;

import com.babylog.dto.ActivityLogResponse;
import com.babylog.dto.CreateActivityLogRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.babylog.repository.ActivityLogRepository;

@Service
@RequiredArgsConstructor
public class ActivityLogServiceImpl implements ActivityLogService {

    private final ActivityLogRepository activityLogRepository;

    @Override
    public ActivityLogResponse create(CreateActivityLogRequest request) {

        var entity = com.babylog.entity.ActivityLog.builder()
                .type(request.getType())
                .subType(request.getSubType())
                .amountMl(request.getAmountMl())
                .durationSeconds(request.getDurationSeconds())
                .side(request.getSide())
                .notes(request.getNotes())
                .build();

        var saved = activityLogRepository.save(entity);

        return new ActivityLogResponse(
                saved.getId(),
                saved.getType(),
                saved.getSubType(),
                saved.getAmountMl(),
                saved.getDurationSeconds(),
                saved.getSide(),
                saved.getCreatedAt(),
                saved.getNotes()
        );
    }

}
