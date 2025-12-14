package com.babylog.dto;

import com.babylog.enums.LogSubType;
import com.babylog.enums.LogType;
import com.babylog.enums.Side;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateActivityLogRequest {

    private LogType type;

    @JsonProperty("sub_type")
    private LogSubType subType;

    @JsonProperty("amount_ml")
    private Integer amountMl;

    @JsonProperty("duration_seconds")
    private Integer durationSeconds;

    private Side side;

    private String notes;
}
