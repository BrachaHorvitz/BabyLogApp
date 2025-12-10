package com.babylog.service;

import com.babylog.dto.BabyLogRequest;
import org.springframework.stereotype.Service;

@Service
public class BabyLogServiceImpl implements BabyLogService {

    @Override
    public String analyzeLog(BabyLogRequest request) {
        // כרגע רק נחזיר הודעה פשוטה כדי לוודא שהכל עובד
        return "Log received. Processing logic will be implemented here.";
    }
}