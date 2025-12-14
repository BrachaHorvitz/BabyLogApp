package com.babylog.service;

import com.babylog.dto.BabyLogRequest;
import com.babylog.entity.LogEntry;
import com.babylog.repository.LogEntryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BabyLogServiceImpl implements BabyLogService {

    private final LogEntryRepository repository;

    @Override
    public String analyzeLog(BabyLogRequest request) {
        List<LogEntry> entitiesToSave = request.getLogs().stream()
                .map(this::mapToEntity)
                .collect(Collectors.toList());

        repository.saveAll(entitiesToSave);

        return "Successfully saved " + entitiesToSave.size() + " logs to the database!";
    }


    private LogEntry mapToEntity(com.babylog.dto.LogEntry dto) {
        return LogEntry.builder()
                .type(dto.getType())
                .subType(dto.getSubType())
                .amountMl(dto.getAmountMl())
                .durationSeconds(dto.getDurationSeconds())
                .side(dto.getSide())
                .createdAt(dto.getCreatedAt())
                .notes(dto.getNotes())
                .build();
    }
}