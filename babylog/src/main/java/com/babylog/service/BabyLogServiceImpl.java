package com.babylog.service;

import com.babylog.dto.AnalyzeLogItem;
import com.babylog.dto.BabyLogRequest;
import com.babylog.entity.ActivityLog;
import com.babylog.repository.ActivityLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BabyLogServiceImpl implements BabyLogService {

    private final ActivityLogRepository  repository;

    @Override
    public String analyzeLog(BabyLogRequest request) {
        List<ActivityLog> entitiesToSave = request.getLogs().stream()
                .map(this::mapToEntity)
                .collect(Collectors.toList());

        repository.saveAll(entitiesToSave);

        return "Successfully saved " + entitiesToSave.size() + " logs to the database!";
    }


    private ActivityLog mapToEntity(AnalyzeLogItem dto) {
        return ActivityLog.builder()
                .type(dto.getType())
                .subType(dto.getSubType())
                .amountMl(dto.getAmountMl())
                .durationSeconds(dto.getDurationSeconds())
                .side(dto.getSide())
                .notes(dto.getNotes())
                .build();
    }
}