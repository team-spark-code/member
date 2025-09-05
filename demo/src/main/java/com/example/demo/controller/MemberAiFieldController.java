package com.example.demo.controller;

import com.example.demo.service.MemberAiFieldService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai-field")
public class MemberAiFieldController {
    private final MemberAiFieldService memberAiFieldService;

    public MemberAiFieldController(MemberAiFieldService memberAiFieldService) {
        this.memberAiFieldService = memberAiFieldService;
    }

    // 관심분야 저장/수정
    @PostMapping
    public void saveAiField(@RequestBody Map<String, String> body, Authentication authentication) {
        String username = authentication.getName();
        String aiField = body.get("aiField");
        memberAiFieldService.saveOrUpdateAiField(username, aiField);
    }

    // 관심분야 조회
    @GetMapping
    public Map<String, String> getAiField(Authentication authentication) {
        String username = authentication.getName();
        return memberAiFieldService.getAiFieldByUsername(username)
                .map(field -> Map.of("aiField", field.getAiField()))
                .orElse(Map.of());
    }
}

