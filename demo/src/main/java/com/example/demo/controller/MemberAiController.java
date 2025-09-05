package com.example.demo.controller;

import com.example.demo.service.MemberAiService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai-company")
public class MemberAiController {
    private final MemberAiService memberAiService;

    public MemberAiController(MemberAiService memberAiService) {
        this.memberAiService = memberAiService;
    }

    // AI기업 저장/수정
    @PostMapping
    public void saveAiCompany(@RequestBody Map<String, String> body, Authentication authentication) {
        String username = authentication.getName();
        String aiCompany = body.get("aiCompany");
        memberAiService.saveOrUpdateAiCompany(username, aiCompany);
    }

    // AI기업 조회
    @GetMapping
    public Map<String, String> getAiCompany(Authentication authentication) {
        String username = authentication.getName();
        return memberAiService.getAiCompanyByUsername(username)
                .map(ai -> Map.of("aiCompany", ai.getAiCompany()))
                .orElse(Map.of());
    }
}

