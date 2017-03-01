package com.inconceptio.trs.repository;

import com.inconceptio.trs.domain.Track;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the Track entity.
 */
@SuppressWarnings("unused")
public interface TrackRepository extends JpaRepository<Track,Long> {

}
