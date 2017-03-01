package com.inconceptio.trs.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.inconceptio.trs.domain.Member;

import com.inconceptio.trs.repository.MemberRepository;
import com.inconceptio.trs.repository.search.MemberSearchRepository;
import com.inconceptio.trs.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing Member.
 */
@RestController
@RequestMapping("/api")
public class MemberResource {

    private final Logger log = LoggerFactory.getLogger(MemberResource.class);

    private static final String ENTITY_NAME = "member";
        
    private final MemberRepository memberRepository;

    private final MemberSearchRepository memberSearchRepository;

    public MemberResource(MemberRepository memberRepository, MemberSearchRepository memberSearchRepository) {
        this.memberRepository = memberRepository;
        this.memberSearchRepository = memberSearchRepository;
    }

    /**
     * POST  /members : Create a new member.
     *
     * @param member the member to create
     * @return the ResponseEntity with status 201 (Created) and with body the new member, or with status 400 (Bad Request) if the member has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/members")
    @Timed
    public ResponseEntity<Member> createMember(@Valid @RequestBody Member member) throws URISyntaxException {
        log.debug("REST request to save Member : {}", member);
        if (member.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new member cannot already have an ID")).body(null);
        }
        Member result = memberRepository.save(member);
        memberSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/members/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /members : Updates an existing member.
     *
     * @param member the member to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated member,
     * or with status 400 (Bad Request) if the member is not valid,
     * or with status 500 (Internal Server Error) if the member couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/members")
    @Timed
    public ResponseEntity<Member> updateMember(@Valid @RequestBody Member member) throws URISyntaxException {
        log.debug("REST request to update Member : {}", member);
        if (member.getId() == null) {
            return createMember(member);
        }
        Member result = memberRepository.save(member);
        memberSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, member.getId().toString()))
            .body(result);
    }

    /**
     * GET  /members : get all the members.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of members in body
     */
    @GetMapping("/members")
    @Timed
    public List<Member> getAllMembers() {
        log.debug("REST request to get all Members");
        List<Member> members = memberRepository.findAll();
        return members;
    }

    /**
     * GET  /members/:id : get the "id" member.
     *
     * @param id the id of the member to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the member, or with status 404 (Not Found)
     */
    @GetMapping("/members/{id}")
    @Timed
    public ResponseEntity<Member> getMember(@PathVariable Long id) {
        log.debug("REST request to get Member : {}", id);
        Member member = memberRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(member));
    }

    /**
     * DELETE  /members/:id : delete the "id" member.
     *
     * @param id the id of the member to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/members/{id}")
    @Timed
    public ResponseEntity<Void> deleteMember(@PathVariable Long id) {
        log.debug("REST request to delete Member : {}", id);
        memberRepository.delete(id);
        memberSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/members?query=:query : search for the member corresponding
     * to the query.
     *
     * @param query the query of the member search 
     * @return the result of the search
     */
    @GetMapping("/_search/members")
    @Timed
    public List<Member> searchMembers(@RequestParam String query) {
        log.debug("REST request to search Members for query {}", query);
        return StreamSupport
            .stream(memberSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }


}
