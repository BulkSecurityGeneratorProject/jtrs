package com.inconceptio.trs.repository;

import com.inconceptio.trs.domain.Playlist;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Spring Data JPA repository for the Playlist entity.
 */
@SuppressWarnings("unused")
public interface PlaylistRepository extends JpaRepository<Playlist,Long> {

    @Query("select distinct playlist from Playlist playlist left join fetch playlist.members")
    List<Playlist> findAllWithEagerRelationships();

    @Query("select playlist from Playlist playlist left join fetch playlist.members where playlist.id =:id")
    Playlist findOneWithEagerRelationships(@Param("id") Long id);

}
