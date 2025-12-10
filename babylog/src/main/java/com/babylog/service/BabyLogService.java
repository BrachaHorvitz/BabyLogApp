package com.babylog.service;

import com.babylog.dto.BabyLogRequest;

public interface BabyLogService {
    String analyzeLog(BabyLogRequest request);
}
