package com.inconceptio.trs.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.inconceptio.trs.domain.Label;

import com.inconceptio.trs.repository.LabelRepository;
import com.inconceptio.trs.repository.search.LabelSearchRepository;
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
 * REST controller for managing Label.
 */
@RestController
@RequestMapping("/api")
public class LabelResource {

    private final Logger log = LoggerFactory.getLogger(LabelResource.class);

    private static final String ENTITY_NAME = "label";
        
    private final LabelRepository labelRepository;

    private final LabelSearchRepository labelSearchRepository;

    public LabelResource(LabelRepository labelRepository, LabelSearchRepository labelSearchRepository) {
        this.labelRepository = labelRepository;
        this.labelSearchRepository = labelSearchRepository;
    }

    /**
     * POST  /labels : Create a new label.
     *
     * @param label the label to create
     * @return the ResponseEntity with status 201 (Created) and with body the new label, or with status 400 (Bad Request) if the label has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/labels")
    @Timed
    public ResponseEntity<Label> createLabel(@Valid @RequestBody Label label) throws URISyntaxException {
        log.debug("REST request to save Label : {}", label);
        if (label.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new label cannot already have an ID")).body(null);
        }
        Label result = labelRepository.save(label);
        labelSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/labels/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /labels : Updates an existing label.
     *
     * @param label the label to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated label,
     * or with status 400 (Bad Request) if the label is not valid,
     * or with status 500 (Internal Server Error) if the label couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/labels")
    @Timed
    public ResponseEntity<Label> updateLabel(@Valid @RequestBody Label label) throws URISyntaxException {
        log.debug("REST request to update Label : {}", label);
        if (label.getId() == null) {
            return createLabel(label);
        }
        Label result = labelRepository.save(label);
        labelSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, label.getId().toString()))
            .body(result);
    }

    /**
     * GET  /labels : get all the labels.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of labels in body
     */
    @GetMapping("/labels")
    @Timed
    public List<Label> getAllLabels() {
        log.debug("REST request to get all Labels");
        List<Label> labels = labelRepository.findAll();
        return labels;
    }

    /**
     * GET  /labels/:id : get the "id" label.
     *
     * @param id the id of the label to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the label, or with status 404 (Not Found)
     */
    @GetMapping("/labels/{id}")
    @Timed
    public ResponseEntity<Label> getLabel(@PathVariable Long id) {
        log.debug("REST request to get Label : {}", id);
        Label label = labelRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(label));
    }

    /**
     * DELETE  /labels/:id : delete the "id" label.
     *
     * @param id the id of the label to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/labels/{id}")
    @Timed
    public ResponseEntity<Void> deleteLabel(@PathVariable Long id) {
        log.debug("REST request to delete Label : {}", id);
        labelRepository.delete(id);
        labelSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/labels?query=:query : search for the label corresponding
     * to the query.
     *
     * @param query the query of the label search 
     * @return the result of the search
     */
    @GetMapping("/_search/labels")
    @Timed
    public List<Label> searchLabels(@RequestParam String query) {
        log.debug("REST request to search Labels for query {}", query);
        return StreamSupport
            .stream(labelSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }


}