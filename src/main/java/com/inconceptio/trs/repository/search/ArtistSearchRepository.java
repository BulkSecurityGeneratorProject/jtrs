package com.inconceptio.trs.repository.search;

import com.inconceptio.trs.domain.Artist;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Artist entity.
 */
public interface ArtistSearchRepository extends ElasticsearchRepository<Artist, Long> {
}
