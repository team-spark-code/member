package com.example.demo.service;

import com.example.demo.domain.Member;
import com.example.demo.domain.MemberJob;
import com.example.demo.repository.jpa.MemberJobRepository;
import com.example.demo.repository.jpa.MemberRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class MemberJobService {
    private final MemberJobRepository memberJobRepository;
    private final MemberRepository memberRepository;

    public MemberJobService(MemberJobRepository memberJobRepository, MemberRepository memberRepository) {
        this.memberJobRepository = memberJobRepository;
        this.memberRepository = memberRepository;
    }

    @Transactional
    public void saveOrUpdateJob(String username, String job) {
        Member member = memberRepository.findByUsername(username);
        if (member == null) throw new IllegalArgumentException("회원이 존재하지 않습니다.");
        Optional<MemberJob> existing = memberJobRepository.findByMember(member);
        if (existing.isPresent()) {
            MemberJob mj = existing.get();
            mj.setJob(job);
            memberJobRepository.save(mj);
        } else {
            MemberJob mj = new MemberJob(member, job);
            memberJobRepository.save(mj);
        }
    }

    public Optional<MemberJob> getJobByUsername(String username) {
        Member member = memberRepository.findByUsername(username);
        if (member == null) return Optional.empty();
        return memberJobRepository.findByMember(member);
    }
}

