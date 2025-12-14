package com.babylog.dto;

import com.babylog.enums.LogSubType;
import com.babylog.enums.LogType;
import com.babylog.enums.Side;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActivityLogResponse {

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
}
