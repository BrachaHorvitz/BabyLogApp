package com.babylog.entity;

import com.babylog.enums.LogType;
import com.babylog.enums.LogSubType;
import com.babylog.enums.Side;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.time.LocalDateTime;

@Entity
@Table(name = "logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LogEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Enumerated(EnumType.STRING)
    private LogType type;

    @Enumerated(EnumType.STRING)
    private LogSubType subType;

    private Integer amountMl;

    private Integer durationSeconds;

    @Enumerated(EnumType.STRING)
    private Side side;

    private LocalDateTime createdAt;

    private String notes;
}