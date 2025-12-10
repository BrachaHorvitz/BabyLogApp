package com.babylog.dto;

import lombok.Data;
import java.util.List;

@Data
public class BabyLogRequest {

    private String message;

    private List<LogEntry> logs; // רשימה של האובייקטים שהגדרנו למעלה
}
