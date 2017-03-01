package com.inconceptio.trs.web.rest;

import com.inconceptio.trs.JtrsApp;

import com.inconceptio.trs.domain.Label;
import com.inconceptio.trs.repository.LabelRepository;
import com.inconceptio.trs.repository.search.LabelSearchRepository;
import com.inconceptio.trs.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the LabelResource REST controller.
 *
 * @see LabelResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = JtrsApp.class)
public class LabelResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    @Autowired
    private LabelRepository labelRepository;

    @Autowired
    private LabelSearchRepository labelSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restLabelMockMvc;

    private Label label;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
            LabelResource labelResource = new LabelResource(labelRepository, labelSearchRepository);
        this.restLabelMockMvc = MockMvcBuilders.standaloneSetup(labelResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Label createEntity(EntityManager em) {
        Label label = new Label()
                .name(DEFAULT_NAME);
        return label;
    }

    @Before
    public void initTest() {
        labelSearchRepository.deleteAll();
        label = createEntity(em);
    }

    @Test
    @Transactional
    public void createLabel() throws Exception {
        int databaseSizeBeforeCreate = labelRepository.findAll().size();

        // Create the Label

        restLabelMockMvc.perform(post("/api/labels")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(label)))
            .andExpect(status().isCreated());

        // Validate the Label in the database
        List<Label> labelList = labelRepository.findAll();
        assertThat(labelList).hasSize(databaseSizeBeforeCreate + 1);
        Label testLabel = labelList.get(labelList.size() - 1);
        assertThat(testLabel.getName()).isEqualTo(DEFAULT_NAME);

        // Validate the Label in Elasticsearch
        Label labelEs = labelSearchRepository.findOne(testLabel.getId());
        assertThat(labelEs).isEqualToComparingFieldByField(testLabel);
    }

    @Test
    @Transactional
    public void createLabelWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = labelRepository.findAll().size();

        // Create the Label with an existing ID
        Label existingLabel = new Label();
        existingLabel.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restLabelMockMvc.perform(post("/api/labels")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(existingLabel)))
            .andExpect(status().isBadRequest());

        // Validate the Alice in the database
        List<Label> labelList = labelRepository.findAll();
        assertThat(labelList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = labelRepository.findAll().size();
        // set the field null
        label.setName(null);

        // Create the Label, which fails.

        restLabelMockMvc.perform(post("/api/labels")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(label)))
            .andExpect(status().isBadRequest());

        List<Label> labelList = labelRepository.findAll();
        assertThat(labelList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllLabels() throws Exception {
        // Initialize the database
        labelRepository.saveAndFlush(label);

        // Get all the labelList
        restLabelMockMvc.perform(get("/api/labels?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(label.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())));
    }

    @Test
    @Transactional
    public void getLabel() throws Exception {
        // Initialize the database
        labelRepository.saveAndFlush(label);

        // Get the label
        restLabelMockMvc.perform(get("/api/labels/{id}", label.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(label.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingLabel() throws Exception {
        // Get the label
        restLabelMockMvc.perform(get("/api/labels/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateLabel() throws Exception {
        // Initialize the database
        labelRepository.saveAndFlush(label);
        labelSearchRepository.save(label);
        int databaseSizeBeforeUpdate = labelRepository.findAll().size();

        // Update the label
        Label updatedLabel = labelRepository.findOne(label.getId());
        updatedLabel
                .name(UPDATED_NAME);

        restLabelMockMvc.perform(put("/api/labels")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedLabel)))
            .andExpect(status().isOk());

        // Validate the Label in the database
        List<Label> labelList = labelRepository.findAll();
        assertThat(labelList).hasSize(databaseSizeBeforeUpdate);
        Label testLabel = labelList.get(labelList.size() - 1);
        assertThat(testLabel.getName()).isEqualTo(UPDATED_NAME);

        // Validate the Label in Elasticsearch
        Label labelEs = labelSearchRepository.findOne(testLabel.getId());
        assertThat(labelEs).isEqualToComparingFieldByField(testLabel);
    }

    @Test
    @Transactional
    public void updateNonExistingLabel() throws Exception {
        int databaseSizeBeforeUpdate = labelRepository.findAll().size();

        // Create the Label

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restLabelMockMvc.perform(put("/api/labels")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(label)))
            .andExpect(status().isCreated());

        // Validate the Label in the database
        List<Label> labelList = labelRepository.findAll();
        assertThat(labelList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteLabel() throws Exception {
        // Initialize the database
        labelRepository.saveAndFlush(label);
        labelSearchRepository.save(label);
        int databaseSizeBeforeDelete = labelRepository.findAll().size();

        // Get the label
        restLabelMockMvc.perform(delete("/api/labels/{id}", label.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean labelExistsInEs = labelSearchRepository.exists(label.getId());
        assertThat(labelExistsInEs).isFalse();

        // Validate the database is empty
        List<Label> labelList = labelRepository.findAll();
        assertThat(labelList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchLabel() throws Exception {
        // Initialize the database
        labelRepository.saveAndFlush(label);
        labelSearchRepository.save(label);

        // Search the label
        restLabelMockMvc.perform(get("/api/_search/labels?query=id:" + label.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(label.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())));
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Label.class);
    }
}