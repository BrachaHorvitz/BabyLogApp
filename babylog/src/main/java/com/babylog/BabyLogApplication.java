package com.babylog;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication // זו האנוטציה שעושה את כל הקסם של הסריקה
public class BabyLogApplication {

    public static void main(String[] args) {
        SpringApplication.run(BabyLogApplication.class, args);
    }

}