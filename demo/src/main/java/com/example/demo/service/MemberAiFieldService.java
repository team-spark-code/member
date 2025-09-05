package com.example.demo.service;

import com.example.demo.domain.Member;
import com.example.demo.domain.MemberAiField;
import com.example.demo.repository.jpa.MemberAiFieldRepository;
import com.example.demo.repository.jpa.MemberRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class MemberAiFieldService {
    private final MemberAiFieldRepository memberAiFieldRepository;
    private final MemberRepository memberRepository;

    public MemberAiFieldService(MemberAiFieldRepository memberAiFieldRepository, MemberRepository memberRepository) {
        this.memberAiFieldRepository = memberAiFieldRepository;
        this.memberRepository = memberRepository;
    }

    @Transactional
    public void saveOrUpdateAiField(String username, String aiField) {
        Member member = memberRepository.findByUsername(username);
        if (member == null) throw new IllegalArgumentException("회원이 존재하지 않습니다.");
        Optional<MemberAiField> existing = memberAiFieldRepository.findByMember(member);
        if (existing.isPresent()) {
            MemberAiField field = existing.get();
            field.setAiField(aiField);
            memberAiFieldRepository.save(field);
        } else {
            MemberAiField field = new MemberAiField(member, aiField);
            memberAiFieldRepository.save(field);
        }
    }

    public Optional<MemberAiField> getAiFieldByUsername(String username) {
        Member member = memberRepository.findByUsername(username);
        if (member == null) return Optional.empty();
        return memberAiFieldRepository.findByMember(member);
    }
}

