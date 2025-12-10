package com.babylog.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LogEntry {

    private String id;

    private LogType type;

    @JsonProperty("sub_type")
    private LogSubType subType;

    @JsonProperty("amount_ml")
    private Integer amountMl;

    @JsonProperty("duration_seconds")
    private Integer durationSeconds;

    private Side side;

    @JsonProperty("created_at")
    private LocalDateTime createdAt;

    private String notes;


    public enum LogType {
        NURSING, BOTTLE, PUMP, DIAPER
    }

    public enum LogSubType {
        WET, DIRTY, BOTH, FORMULA, BREAST_MILK
    }

    public enum Side {
        LEFT, RIGHT
    }
}