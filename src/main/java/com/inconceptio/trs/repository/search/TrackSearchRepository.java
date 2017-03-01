package com.inconceptio.trs.repository.search;

import com.inconceptio.trs.domain.Track;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Track entity.
 */
public interface TrackSearchRepository extends ElasticsearchRepository<Track, Long> {
}
