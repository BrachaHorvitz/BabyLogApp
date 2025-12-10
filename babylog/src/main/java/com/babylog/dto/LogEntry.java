package com.babylog.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data // מייצר אוטומטית Getters, Setters, toString, equals, hashCode
@NoArgsConstructor // מייצר בנאי ריק (חובה עבור Jackson)
@AllArgsConstructor // מייצר בנאי עם כל השדות
public class LogEntry {

    private String id;

    private LogType type; // נשתמש ב-Enum בהמשך

    @JsonProperty("sub_type") // ממפה את השדה sub_type ב-JSON לשדה subType ב-Java
    private LogSubType subType;

    @JsonProperty("amount_ml")
    private Integer amountMl; // שימוש ב-Integer (ולא int) מאפשר ערך null

    @JsonProperty("duration_seconds")
    private Integer durationSeconds;

    private Side side;

    @JsonProperty("created_at")
    private LocalDateTime createdAt; // Jackson יודע להמיר ISO String לתאריך

    private String notes;

    // Enums פנימיים או בקבצים נפרדים
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