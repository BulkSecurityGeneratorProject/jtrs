package com.inconceptio.trs.web.rest;

import com.inconceptio.trs.JtrsApp;

import com.inconceptio.trs.domain.Playlist;
import com.inconceptio.trs.repository.PlaylistRepository;
import com.inconceptio.trs.repository.search.PlaylistSearchRepository;
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
import org.springframework.util.Base64Utils;

import javax.persistence.EntityManager;
import java.time.LocalDate;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.ZoneOffset;
import java.time.ZoneId;
import java.util.List;

import static com.inconceptio.trs.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the PlaylistResource REST controller.
 *
 * @see PlaylistResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = JtrsApp.class)
public class PlaylistResourceIntTest {

    private static final String DEFAULT_NUMBER = "AAAAAAAAAA";
    private static final String UPDATED_NUMBER = "BBBBBBBBBB";

    private static final String DEFAULT_THEME = "AAAAAAAAAA";
    private static final String UPDATED_THEME = "BBBBBBBBBB";

    private static final String DEFAULT_GUEST = "AAAAAAAAAA";
    private static final String UPDATED_GUEST = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_TYPE = "BBBBBBBBBB";

    private static final String DEFAULT_RECORD_URL = "AAAAAAAAAA";
    private static final String UPDATED_RECORD_URL = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_CREATE_TIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATE_TIME = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_UPDATE_TIME = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_UPDATE_TIME = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    @Autowired
    private PlaylistRepository playlistRepository;

    @Autowired
    private PlaylistSearchRepository playlistSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restPlaylistMockMvc;

    private Playlist playlist;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
            PlaylistResource playlistResource = new PlaylistResource(playlistRepository, playlistSearchRepository);
        this.restPlaylistMockMvc = MockMvcBuilders.standaloneSetup(playlistResource)
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
    public static Playlist createEntity(EntityManager em) {
        Playlist playlist = new Playlist()
                .number(DEFAULT_NUMBER)
                .theme(DEFAULT_THEME)
                .guest(DEFAULT_GUEST)
                .date(DEFAULT_DATE)
                .type(DEFAULT_TYPE)
                .recordUrl(DEFAULT_RECORD_URL)
                .createTime(DEFAULT_CREATE_TIME)
                .updateTime(DEFAULT_UPDATE_TIME);
        return playlist;
    }

    @Before
    public void initTest() {
        playlistSearchRepository.deleteAll();
        playlist = createEntity(em);
    }

    @Test
    @Transactional
    public void createPlaylist() throws Exception {
        int databaseSizeBeforeCreate = playlistRepository.findAll().size();

        // Create the Playlist

        restPlaylistMockMvc.perform(post("/api/playlists")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(playlist)))
            .andExpect(status().isCreated());

        // Validate the Playlist in the database
        List<Playlist> playlistList = playlistRepository.findAll();
        assertThat(playlistList).hasSize(databaseSizeBeforeCreate + 1);
        Playlist testPlaylist = playlistList.get(playlistList.size() - 1);
        assertThat(testPlaylist.getNumber()).isEqualTo(DEFAULT_NUMBER);
        assertThat(testPlaylist.getTheme()).isEqualTo(DEFAULT_THEME);
        assertThat(testPlaylist.getGuest()).isEqualTo(DEFAULT_GUEST);
        assertThat(testPlaylist.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testPlaylist.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testPlaylist.getRecordUrl()).isEqualTo(DEFAULT_RECORD_URL);
        assertThat(testPlaylist.getCreateTime()).isEqualTo(DEFAULT_CREATE_TIME);
        assertThat(testPlaylist.getUpdateTime()).isEqualTo(DEFAULT_UPDATE_TIME);

        // Validate the Playlist in Elasticsearch
        Playlist playlistEs = playlistSearchRepository.findOne(testPlaylist.getId());
        assertThat(playlistEs).isEqualToComparingFieldByField(testPlaylist);
    }

    @Test
    @Transactional
    public void createPlaylistWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = playlistRepository.findAll().size();

        // Create the Playlist with an existing ID
        Playlist existingPlaylist = new Playlist();
        existingPlaylist.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restPlaylistMockMvc.perform(post("/api/playlists")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(existingPlaylist)))
            .andExpect(status().isBadRequest());

        // Validate the Alice in the database
        List<Playlist> playlistList = playlistRepository.findAll();
        assertThat(playlistList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNumberIsRequired() throws Exception {
        int databaseSizeBeforeTest = playlistRepository.findAll().size();
        // set the field null
        playlist.setNumber(null);

        // Create the Playlist, which fails.

        restPlaylistMockMvc.perform(post("/api/playlists")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(playlist)))
            .andExpect(status().isBadRequest());

        List<Playlist> playlistList = playlistRepository.findAll();
        assertThat(playlistList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = playlistRepository.findAll().size();
        // set the field null
        playlist.setDate(null);

        // Create the Playlist, which fails.

        restPlaylistMockMvc.perform(post("/api/playlists")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(playlist)))
            .andExpect(status().isBadRequest());

        List<Playlist> playlistList = playlistRepository.findAll();
        assertThat(playlistList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkTypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = playlistRepository.findAll().size();
        // set the field null
        playlist.setType(null);

        // Create the Playlist, which fails.

        restPlaylistMockMvc.perform(post("/api/playlists")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(playlist)))
            .andExpect(status().isBadRequest());

        List<Playlist> playlistList = playlistRepository.findAll();
        assertThat(playlistList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllPlaylists() throws Exception {
        // Initialize the database
        playlistRepository.saveAndFlush(playlist);

        // Get all the playlistList
        restPlaylistMockMvc.perform(get("/api/playlists?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(playlist.getId().intValue())))
            .andExpect(jsonPath("$.[*].number").value(hasItem(DEFAULT_NUMBER.toString())))
            .andExpect(jsonPath("$.[*].theme").value(hasItem(DEFAULT_THEME.toString())))
            .andExpect(jsonPath("$.[*].guest").value(hasItem(DEFAULT_GUEST.toString())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())))
            .andExpect(jsonPath("$.[*].recordUrl").value(hasItem(DEFAULT_RECORD_URL.toString())))
            .andExpect(jsonPath("$.[*].createTime").value(hasItem(sameInstant(DEFAULT_CREATE_TIME))))
            .andExpect(jsonPath("$.[*].updateTime").value(hasItem(sameInstant(DEFAULT_UPDATE_TIME))));
    }

    @Test
    @Transactional
    public void getPlaylist() throws Exception {
        // Initialize the database
        playlistRepository.saveAndFlush(playlist);

        // Get the playlist
        restPlaylistMockMvc.perform(get("/api/playlists/{id}", playlist.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(playlist.getId().intValue()))
            .andExpect(jsonPath("$.number").value(DEFAULT_NUMBER.toString()))
            .andExpect(jsonPath("$.theme").value(DEFAULT_THEME.toString()))
            .andExpect(jsonPath("$.guest").value(DEFAULT_GUEST.toString()))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE.toString()))
            .andExpect(jsonPath("$.recordUrl").value(DEFAULT_RECORD_URL.toString()))
            .andExpect(jsonPath("$.createTime").value(sameInstant(DEFAULT_CREATE_TIME)))
            .andExpect(jsonPath("$.updateTime").value(sameInstant(DEFAULT_UPDATE_TIME)));
    }

    @Test
    @Transactional
    public void getNonExistingPlaylist() throws Exception {
        // Get the playlist
        restPlaylistMockMvc.perform(get("/api/playlists/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updatePlaylist() throws Exception {
        // Initialize the database
        playlistRepository.saveAndFlush(playlist);
        playlistSearchRepository.save(playlist);
        int databaseSizeBeforeUpdate = playlistRepository.findAll().size();

        // Update the playlist
        Playlist updatedPlaylist = playlistRepository.findOne(playlist.getId());
        updatedPlaylist
                .number(UPDATED_NUMBER)
                .theme(UPDATED_THEME)
                .guest(UPDATED_GUEST)
                .date(UPDATED_DATE)
                .type(UPDATED_TYPE)
                .recordUrl(UPDATED_RECORD_URL)
                .createTime(UPDATED_CREATE_TIME)
                .updateTime(UPDATED_UPDATE_TIME);

        restPlaylistMockMvc.perform(put("/api/playlists")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedPlaylist)))
            .andExpect(status().isOk());

        // Validate the Playlist in the database
        List<Playlist> playlistList = playlistRepository.findAll();
        assertThat(playlistList).hasSize(databaseSizeBeforeUpdate);
        Playlist testPlaylist = playlistList.get(playlistList.size() - 1);
        assertThat(testPlaylist.getNumber()).isEqualTo(UPDATED_NUMBER);
        assertThat(testPlaylist.getTheme()).isEqualTo(UPDATED_THEME);
        assertThat(testPlaylist.getGuest()).isEqualTo(UPDATED_GUEST);
        assertThat(testPlaylist.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testPlaylist.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testPlaylist.getRecordUrl()).isEqualTo(UPDATED_RECORD_URL);
        assertThat(testPlaylist.getCreateTime()).isEqualTo(UPDATED_CREATE_TIME);
        assertThat(testPlaylist.getUpdateTime()).isEqualTo(UPDATED_UPDATE_TIME);

        // Validate the Playlist in Elasticsearch
        Playlist playlistEs = playlistSearchRepository.findOne(testPlaylist.getId());
        assertThat(playlistEs).isEqualToComparingFieldByField(testPlaylist);
    }

    @Test
    @Transactional
    public void updateNonExistingPlaylist() throws Exception {
        int databaseSizeBeforeUpdate = playlistRepository.findAll().size();

        // Create the Playlist

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restPlaylistMockMvc.perform(put("/api/playlists")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(playlist)))
            .andExpect(status().isCreated());

        // Validate the Playlist in the database
        List<Playlist> playlistList = playlistRepository.findAll();
        assertThat(playlistList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deletePlaylist() throws Exception {
        // Initialize the database
        playlistRepository.saveAndFlush(playlist);
        playlistSearchRepository.save(playlist);
        int databaseSizeBeforeDelete = playlistRepository.findAll().size();

        // Get the playlist
        restPlaylistMockMvc.perform(delete("/api/playlists/{id}", playlist.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean playlistExistsInEs = playlistSearchRepository.exists(playlist.getId());
        assertThat(playlistExistsInEs).isFalse();

        // Validate the database is empty
        List<Playlist> playlistList = playlistRepository.findAll();
        assertThat(playlistList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void searchPlaylist() throws Exception {
        // Initialize the database
        playlistRepository.saveAndFlush(playlist);
        playlistSearchRepository.save(playlist);

        // Search the playlist
        restPlaylistMockMvc.perform(get("/api/_search/playlists?query=id:" + playlist.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(playlist.getId().intValue())))
            .andExpect(jsonPath("$.[*].number").value(hasItem(DEFAULT_NUMBER.toString())))
            .andExpect(jsonPath("$.[*].theme").value(hasItem(DEFAULT_THEME.toString())))
            .andExpect(jsonPath("$.[*].guest").value(hasItem(DEFAULT_GUEST.toString())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())))
            .andExpect(jsonPath("$.[*].recordUrl").value(hasItem(DEFAULT_RECORD_URL.toString())))
            .andExpect(jsonPath("$.[*].createTime").value(hasItem(sameInstant(DEFAULT_CREATE_TIME))))
            .andExpect(jsonPath("$.[*].updateTime").value(hasItem(sameInstant(DEFAULT_UPDATE_TIME))));
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Playlist.class);
    }
}
