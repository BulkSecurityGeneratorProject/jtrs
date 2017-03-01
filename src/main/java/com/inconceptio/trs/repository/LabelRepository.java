package com.inconceptio.trs.repository;

import com.inconceptio.trs.domain.Label;

import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the Label entity.
 */
@SuppressWarnings("unused")
public interface LabelRepository extends JpaRepository<Label,Long> {

}
