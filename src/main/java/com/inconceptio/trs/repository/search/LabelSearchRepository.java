package com.inconceptio.trs.repository.search;

import com.inconceptio.trs.domain.Label;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the Label entity.
 */
public interface LabelSearchRepository extends ElasticsearchRepository<Label, Long> {
}
