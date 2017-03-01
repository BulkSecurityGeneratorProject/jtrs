package com.inconceptio.trs.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A Playlist.
 */
@Entity
@Table(name = "playlist")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@Document(indexName = "playlist")
public class Playlist implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "number", nullable = false)
    private String number;

    @Lob
    @Column(name = "theme")
    private String theme;

    @Lob
    @Column(name = "guest")
    private String guest;

    @NotNull
    @Column(name = "date", nullable = false)
    private LocalDate date;

    @NotNull
    @Column(name = "type", nullable = false)
    private String type;

    @Column(name = "record_url")
    private String recordUrl;

    @Column(name = "create_time")
    private ZonedDateTime createTime;

    @Column(name = "update_time")
    private ZonedDateTime updateTime;

    @OneToMany(mappedBy = "playlist")
    @JsonIgnore
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Entry> entries = new HashSet<>();

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "playlist_member",
               joinColumns = @JoinColumn(name="playlists_id", referencedColumnName="id"),
               inverseJoinColumns = @JoinColumn(name="members_id", referencedColumnName="id"))
    private Set<Member> members = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNumber() {
        return number;
    }

    public Playlist number(String number) {
        this.number = number;
        return this;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public String getTheme() {
        return theme;
    }

    public Playlist theme(String theme) {
        this.theme = theme;
        return this;
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }

    public String getGuest() {
        return guest;
    }

    public Playlist guest(String guest) {
        this.guest = guest;
        return this;
    }

    public void setGuest(String guest) {
        this.guest = guest;
    }

    public LocalDate getDate() {
        return date;
    }

    public Playlist date(LocalDate date) {
        this.date = date;
        return this;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getType() {
        return type;
    }

    public Playlist type(String type) {
        this.type = type;
        return this;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getRecordUrl() {
        return recordUrl;
    }

    public Playlist recordUrl(String recordUrl) {
        this.recordUrl = recordUrl;
        return this;
    }

    public void setRecordUrl(String recordUrl) {
        this.recordUrl = recordUrl;
    }

    public ZonedDateTime getCreateTime() {
        return createTime;
    }

    public Playlist createTime(ZonedDateTime createTime) {
        this.createTime = createTime;
        return this;
    }

    public void setCreateTime(ZonedDateTime createTime) {
        this.createTime = createTime;
    }

    public ZonedDateTime getUpdateTime() {
        return updateTime;
    }

    public Playlist updateTime(ZonedDateTime updateTime) {
        this.updateTime = updateTime;
        return this;
    }

    public void setUpdateTime(ZonedDateTime updateTime) {
        this.updateTime = updateTime;
    }

    public Set<Entry> getEntries() {
        return entries;
    }

    public Playlist entries(Set<Entry> entries) {
        this.entries = entries;
        return this;
    }

    public Playlist addEntry(Entry entry) {
        this.entries.add(entry);
        entry.setPlaylist(this);
        return this;
    }

    public Playlist removeEntry(Entry entry) {
        this.entries.remove(entry);
        entry.setPlaylist(null);
        return this;
    }

    public void setEntries(Set<Entry> entries) {
        this.entries = entries;
    }

    public Set<Member> getMembers() {
        return members;
    }

    public Playlist members(Set<Member> members) {
        this.members = members;
        return this;
    }

    public Playlist addMember(Member member) {
        this.members.add(member);
        member.getPlaylists().add(this);
        return this;
    }

    public Playlist removeMember(Member member) {
        this.members.remove(member);
        member.getPlaylists().remove(this);
        return this;
    }

    public void setMembers(Set<Member> members) {
        this.members = members;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Playlist playlist = (Playlist) o;
        if (playlist.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, playlist.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Playlist{" +
            "id=" + id +
            ", number='" + number + "'" +
            ", theme='" + theme + "'" +
            ", guest='" + guest + "'" +
            ", date='" + date + "'" +
            ", type='" + type + "'" +
            ", recordUrl='" + recordUrl + "'" +
            ", createTime='" + createTime + "'" +
            ", updateTime='" + updateTime + "'" +
            '}';
    }
}
