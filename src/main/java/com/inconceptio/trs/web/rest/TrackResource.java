package com.inconceptio.trs.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.inconceptio.trs.domain.Track;

import com.inconceptio.trs.repository.TrackRepository;
import com.inconceptio.trs.repository.search.TrackSearchRepository;
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
 * REST controller for managing Track.
 */
@RestController
@RequestMapping("/api")
public class TrackResource {

    private final Logger log = LoggerFactory.getLogger(TrackResource.class);

    private static final String ENTITY_NAME = "track";
        
    private final TrackRepository trackRepository;

    private final TrackSearchRepository trackSearchRepository;

    public TrackResource(TrackRepository trackRepository, TrackSearchRepository trackSearchRepository) {
        this.trackRepository = trackRepository;
        this.trackSearchRepository = trackSearchRepository;
    }

    /**
     * POST  /tracks : Create a new track.
     *
     * @param track the track to create
     * @return the ResponseEntity with status 201 (Created) and with body the new track, or with status 400 (Bad Request) if the track has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/tracks")
    @Timed
    public ResponseEntity<Track> createTrack(@Valid @RequestBody Track track) throws URISyntaxException {
        log.debug("REST request to save Track : {}", track);
        if (track.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert(ENTITY_NAME, "idexists", "A new track cannot already have an ID")).body(null);
        }
        Track result = trackRepository.save(track);
        trackSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/tracks/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /tracks : Updates an existing track.
     *
     * @param track the track to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated track,
     * or with status 400 (Bad Request) if the track is not valid,
     * or with status 500 (Internal Server Error) if the track couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/tracks")
    @Timed
    public ResponseEntity<Track> updateTrack(@Valid @RequestBody Track track) throws URISyntaxException {
        log.debug("REST request to update Track : {}", track);
        if (track.getId() == null) {
            return createTrack(track);
        }
        Track result = trackRepository.save(track);
        trackSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, track.getId().toString()))
            .body(result);
    }

    /**
     * GET  /tracks : get all the tracks.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of tracks in body
     */
    @GetMapping("/tracks")
    @Timed
    public List<Track> getAllTracks() {
        log.debug("REST request to get all Tracks");
        List<Track> tracks = trackRepository.findAll();
        return tracks;
    }

    /**
     * GET  /tracks/:id : get the "id" track.
     *
     * @param id the id of the track to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the track, or with status 404 (Not Found)
     */
    @GetMapping("/tracks/{id}")
    @Timed
    public ResponseEntity<Track> getTrack(@PathVariable Long id) {
        log.debug("REST request to get Track : {}", id);
        Track track = trackRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(track));
    }

    /**
     * DELETE  /tracks/:id : delete the "id" track.
     *
     * @param id the id of the track to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/tracks/{id}")
    @Timed
    public ResponseEntity<Void> deleteTrack(@PathVariable Long id) {
        log.debug("REST request to delete Track : {}", id);
        trackRepository.delete(id);
        trackSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/tracks?query=:query : search for the track corresponding
     * to the query.
     *
     * @param query the query of the track search 
     * @return the result of the search
     */
    @GetMapping("/_search/tracks")
    @Timed
    public List<Track> searchTracks(@RequestParam String query) {
        log.debug("REST request to search Tracks for query {}", query);
        return StreamSupport
            .stream(trackSearchRepository.search(queryStringQuery(query)).spliterator(), false)
            .collect(Collectors.toList());
    }


}
