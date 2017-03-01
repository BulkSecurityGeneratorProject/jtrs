package com.inconceptio.trs.repository.search;

import com.inconceptio.trs.domain.Playlist;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Playlist entity.
 */
public interface PlaylistSearchRepository extends ElasticsearchRepository<Playlist, Long> {
}
