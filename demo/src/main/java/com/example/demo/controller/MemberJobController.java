package com.example.demo.controller;

import com.example.demo.service.MemberJobService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/job-interest")
public class MemberJobController {
    private final MemberJobService memberJobService;

    public MemberJobController(MemberJobService memberJobService) {
        this.memberJobService = memberJobService;
    }

    // 직업 저장/수정
    @PostMapping
    public void saveJob(@RequestBody Map<String, String> body, Authentication authentication) {
        String username = authentication.getName();
        String job = body.get("interest");
        memberJobService.saveOrUpdateJob(username, job);
    }

    // 직업 조회
    @GetMapping
    public Map<String, String> getJob(Authentication authentication) {
        String username = authentication.getName();
        return memberJobService.getJobByUsername(username)
                .map(j -> Map.of("interest", j.getJob()))
                .orElse(Map.of());
    }
}

