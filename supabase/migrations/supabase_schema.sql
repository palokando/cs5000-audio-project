-- Schema for the two-study crowdsourcing web app.
-- See specs/crowdsourcing-web-app-schema-spec.md for the driving requirements.

BEGIN;

-- =============================================================================
-- 1. Enums
-- =============================================================================

CREATE TYPE age_bracket AS ENUM (
    '18-24', '25-34', '35-44', '45-54', '55-64', '65+', 'Unspecified'
);

CREATE TYPE gender AS ENUM (
    'Male', 'Female', 'Non-Binary', 'Unspecified'
);

CREATE TYPE sound_cue AS ENUM (
    'cue_01', 'cue_02', 'cue_03', 'cue_04', 'cue_05',
    'cue_06', 'cue_07', 'cue_08', 'cue_09', 'cue_10',
    'cue_11', 'cue_12', 'cue_13', 'cue_14', 'cue_15'
);

CREATE TYPE study2_condition AS ENUM (
    'without', 'before', 'after', 'enclosing', 'concurrent'
);


-- =============================================================================
-- 2. Study 1 tables
-- =============================================================================

CREATE TABLE study1_assignments (
    participant_prolific_id   text        PRIMARY KEY,
    assigned_sound_cue        sound_cue   NOT NULL,
    assigned_at               timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX study1_assignments_cue_idx ON study1_assignments (assigned_sound_cue);

CREATE TABLE study1_audio_files (
    cue            sound_cue NOT NULL,
    snippet_index  smallint  NOT NULL CHECK (snippet_index BETWEEN 1 AND 3),
    url            text      NOT NULL,
    PRIMARY KEY (cue, snippet_index)
);

CREATE TABLE study1_responses (
    participant_prolific_id  text PRIMARY KEY
        REFERENCES study1_assignments(participant_prolific_id) ON DELETE CASCADE,
    age                      age_bracket,
    gender                   gender,
    native_tongue            text     CHECK (native_tongue IS NULL OR char_length(native_tongue) <= 25),
    conceptual_mapping       text,
    elicited_reaction        text,
    recognizability          smallint CHECK (recognizability BETWEEN 1 AND 5),
    distraction              smallint CHECK (distraction     BETWEEN 1 AND 5),
    abruptness               smallint CHECK (abruptness      BETWEEN 1 AND 5),
    interruption             smallint CHECK (interruption    BETWEEN 1 AND 5),
    task_feedback            text,
    created_at               timestamptz NOT NULL DEFAULT now(),
    updated_at               timestamptz NOT NULL DEFAULT now(),
    completed_at             timestamptz
);


-- =============================================================================
-- 3. Study 2 tables
-- =============================================================================

CREATE TABLE study2_assignments (
    participant_prolific_id   text             PRIMARY KEY,
    assigned_condition        study2_condition NOT NULL,
    podcast_file_url          text             NOT NULL,
    assigned_at               timestamptz      NOT NULL DEFAULT now()
);
CREATE INDEX study2_assignments_condition_idx ON study2_assignments (assigned_condition);

CREATE TABLE study2_podcast_files (
    condition  study2_condition NOT NULL,
    topic      text             NOT NULL,
    name       text             PRIMARY KEY,
    url        text             NOT NULL
);

CREATE TABLE static_audio_files (
    key  text PRIMARY KEY,
    url  text NOT NULL
);

CREATE TABLE study2_responses (
    participant_prolific_id  text PRIMARY KEY
        REFERENCES study2_assignments(participant_prolific_id) ON DELETE CASCADE,

    -- Page 2: Profiling
    age                      age_bracket,
    gender                   gender,
    native_tongue            text     CHECK (native_tongue IS NULL OR char_length(native_tongue) <= 25),
    listening_frequency      smallint CHECK (listening_frequency BETWEEN 1 AND 4),
    listening_amount_yrs     integer  CHECK (listening_amount_yrs >= 0),
    listening_amount_hrw     integer  CHECK (listening_amount_hrw >= 0),
    listening_amount_pcm     integer  CHECK (listening_amount_pcm >= 0),
    topic_familiarity        smallint CHECK (topic_familiarity BETWEEN 1 AND 7),
    prior_stance             smallint CHECK (prior_stance      BETWEEN 1 AND 7),
    attitude_importance      smallint CHECK (attitude_importance   BETWEEN 1 AND 7),
    attitude_elaboration     smallint CHECK (attitude_elaboration  BETWEEN 1 AND 7),
    attitude_moralization    smallint CHECK (attitude_moralization BETWEEN 1 AND 7),
    nfc_q1  smallint CHECK (nfc_q1  BETWEEN 1 AND 5),
    nfc_q2  smallint CHECK (nfc_q2  BETWEEN 1 AND 5),
    nfc_q3  smallint CHECK (nfc_q3  BETWEEN 1 AND 5),
    nfc_q4  smallint CHECK (nfc_q4  BETWEEN 1 AND 5),
    nfc_q5  smallint CHECK (nfc_q5  BETWEEN 1 AND 5),
    nfc_q6  smallint CHECK (nfc_q6  BETWEEN 1 AND 5),
    ihs_q1  smallint CHECK (ihs_q1  BETWEEN 1 AND 9),
    ihs_q2  smallint CHECK (ihs_q2  BETWEEN 1 AND 9),
    ihs_q3  smallint CHECK (ihs_q3  BETWEEN 1 AND 9),
    ihs_q4  smallint CHECK (ihs_q4  BETWEEN 1 AND 9),
    ihs_q5  smallint CHECK (ihs_q5  BETWEEN 1 AND 9),
    ihs_q6  smallint CHECK (ihs_q6  BETWEEN 1 AND 9),
    ihs_q7  smallint CHECK (ihs_q7  BETWEEN 1 AND 9),
    ihs_q8  smallint CHECK (ihs_q8  BETWEEN 1 AND 9),
    ihs_q9  smallint CHECK (ihs_q9  BETWEEN 1 AND 9),
    ihs_q10 smallint CHECK (ihs_q10 BETWEEN 1 AND 9),
    ihs_q11 smallint CHECK (ihs_q11 BETWEEN 1 AND 9),
    ihs_q12 smallint CHECK (ihs_q12 BETWEEN 1 AND 9),

    -- Page 3: Podcast Listening (audio tracking, written by the heartbeat)
    latest_time_reached      integer CHECK (latest_time_reached     >= 0),
    total_playtime           integer CHECK (total_playtime          >= 0),
    pause_button_clicks      integer CHECK (pause_button_clicks     >= 0),
    backtrack_button_clicks  integer CHECK (backtrack_button_clicks >= 0),

    -- Page 4: Recall Assessment
    recall_q1  char(1) CHECK (recall_q1  IN ('A','B','C','D')),
    recall_q2  char(1) CHECK (recall_q2  IN ('A','B','C','D')),
    recall_q3  char(1) CHECK (recall_q3  IN ('A','B','C','D')),
    recall_q4  char(1) CHECK (recall_q4  IN ('A','B','C','D')),
    recall_q5  char(1) CHECK (recall_q5  IN ('A','B','C','D')),
    recall_q6  char(1) CHECK (recall_q6  IN ('A','B','C','D')),
    recall_q7  char(1) CHECK (recall_q7  IN ('A','B','C','D')),
    recall_q8  char(1) CHECK (recall_q8  IN ('A','B','C','D')),
    recall_q9  char(1) CHECK (recall_q9  IN ('A','B','C','D')),
    recall_q10 char(1) CHECK (recall_q10 IN ('A','B','C','D')),
    recall_q11 char(1) CHECK (recall_q11 IN ('A','B','C','D')),
    recall_q12 char(1) CHECK (recall_q12 IN ('A','B','C','D')),
    recall_q13 char(1) CHECK (recall_q13 IN ('A','B','C','D')),
    recall_q14 char(1) CHECK (recall_q14 IN ('A','B','C','D')),
    recall_q15 char(1) CHECK (recall_q15 IN ('A','B','C','D')),
    sound_recognized         boolean,
    recognition_freq         smallint CHECK (recognition_freq IS NULL OR recognition_freq BETWEEN 1 AND 3),
    presumed_purpose         text,
    stats_rationale          text,
    podcast_density          smallint CHECK (podcast_density BETWEEN 1 AND 5),
    podcast_pace             smallint CHECK (podcast_pace    BETWEEN 1 AND 5),

    -- Page 5: Misinformation Recognition
    bm_recognized_1          boolean,
    bm_recognized_2          boolean,
    bm_rationale_1           text,
    bm_rationale_2           text,

    -- Page 6: Warning Evaluation
    conceptual_mapping       text,
    elicited_reaction        text,
    acclimate_trend          smallint CHECK (acclimate_trend BETWEEN 1 AND 3),
    acclimate_rationale      text,
    recognizability          smallint CHECK (recognizability BETWEEN 1 AND 5),
    distraction              smallint CHECK (distraction     BETWEEN 1 AND 5),
    abruptness               smallint CHECK (abruptness      BETWEEN 1 AND 5),
    interruption             smallint CHECK (interruption    BETWEEN 1 AND 5),

    -- Page 7: Debrief
    informed_consent             boolean,
    debrief_immediate_reaction   text,
    debrief_downstream_behavior  text,
    task_feedback            text,

    -- Lifecycle
    created_at               timestamptz NOT NULL DEFAULT now(),
    updated_at               timestamptz NOT NULL DEFAULT now(),
    completed_at             timestamptz,
    exited_prematurely_at    timestamptz,
    CHECK (completed_at IS NULL OR exited_prematurely_at IS NULL)
);


-- =============================================================================
-- 4. updated_at trigger
-- =============================================================================

CREATE OR REPLACE FUNCTION touch_updated_at() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at := now();
    RETURN NEW;
END;
$$;

CREATE TRIGGER study1_responses_touch
    BEFORE UPDATE ON study1_responses
    FOR EACH ROW EXECUTE FUNCTION touch_updated_at();

CREATE TRIGGER study2_responses_touch
    BEFORE UPDATE ON study2_responses
    FOR EACH ROW EXECUTE FUNCTION touch_updated_at();


-- =============================================================================
-- 5. Row-Level Security
-- =============================================================================
-- Enabling RLS with zero policies denies all direct access to anon/authenticated.
-- Writes and reads flow exclusively through the SECURITY DEFINER RPCs below.

ALTER TABLE study1_assignments   ENABLE ROW LEVEL SECURITY;
ALTER TABLE study1_audio_files   ENABLE ROW LEVEL SECURITY;
ALTER TABLE study1_responses     ENABLE ROW LEVEL SECURITY;
ALTER TABLE study2_assignments   ENABLE ROW LEVEL SECURITY;
ALTER TABLE study2_podcast_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE static_audio_files   ENABLE ROW LEVEL SECURITY;
ALTER TABLE study2_responses     ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON
    study1_assignments, study1_audio_files, study1_responses,
    study2_assignments, study2_podcast_files, static_audio_files, study2_responses
FROM anon, authenticated;


-- =============================================================================
-- 6. RPC functions (SECURITY DEFINER, granted to anon)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 6.1 Assignment claiming
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION claim_study1_assignment(p_prolific_id text)
RETURNS TABLE (assigned_sound_cue sound_cue, snippet_urls text[])
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    picked_cue  sound_cue;
    picked_urls text[];
BEGIN
    SELECT a.assigned_sound_cue INTO picked_cue
      FROM study1_assignments a
     WHERE a.participant_prolific_id = p_prolific_id;

    IF NOT FOUND THEN
        WITH counts AS (
            SELECT c.cue, COALESCE(a.n, 0) AS n
              FROM unnest(enum_range(NULL::sound_cue)) AS c(cue)
              LEFT JOIN (
                  SELECT s.assigned_sound_cue AS cue, count(*) AS n
                    FROM study1_assignments s
                   GROUP BY s.assigned_sound_cue
              ) a USING (cue)
        )
        SELECT cue INTO picked_cue
          FROM counts
         WHERE n < 10
         ORDER BY n ASC, random()
         LIMIT 1
         FOR UPDATE;

        IF picked_cue IS NULL THEN
            RAISE EXCEPTION 'study1 full' USING ERRCODE = 'check_violation';
        END IF;

        INSERT INTO study1_assignments (participant_prolific_id, assigned_sound_cue)
        VALUES (p_prolific_id, picked_cue);

        INSERT INTO study1_responses (participant_prolific_id)
        VALUES (p_prolific_id);
    END IF;

    SELECT array_agg(url ORDER BY snippet_index) INTO picked_urls
      FROM study1_audio_files
     WHERE cue = picked_cue;

    IF picked_urls IS NULL OR array_length(picked_urls, 1) <> 3 THEN
        RAISE EXCEPTION 'expected 3 snippet URLs for cue %, found %',
                        picked_cue, COALESCE(array_length(picked_urls, 1), 0);
    END IF;

    assigned_sound_cue := picked_cue;
    snippet_urls       := picked_urls;
    RETURN NEXT;
END;
$$;

GRANT EXECUTE ON FUNCTION claim_study1_assignment(text) TO anon;


CREATE OR REPLACE FUNCTION claim_study2_assignment(p_prolific_id text)
RETURNS TABLE (assigned_condition study2_condition, podcast_file_url text, podcast_file_name text, podcast_topic text)
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    picked_condition study2_condition;
    picked_url       text;
    picked_name      text;
    picked_topic     text;
BEGIN
    SELECT a.assigned_condition, a.podcast_file_url, f.name, f.topic
      INTO picked_condition, picked_url, picked_name, picked_topic
      FROM study2_assignments a
      JOIN study2_podcast_files f
        ON f.condition = a.assigned_condition AND f.url = a.podcast_file_url
     WHERE a.participant_prolific_id = p_prolific_id;

    IF FOUND THEN
        assigned_condition := picked_condition;
        podcast_file_url   := picked_url;
        podcast_file_name  := picked_name;
        podcast_topic      := picked_topic;
        RETURN NEXT;
        RETURN;
    END IF;

    WITH counts AS (
        SELECT c.cond, COALESCE(a.n, 0) AS n
          FROM unnest(enum_range(NULL::study2_condition)) AS c(cond)
          LEFT JOIN (
              SELECT s.assigned_condition AS cond, count(*) AS n
                FROM study2_assignments s
               GROUP BY s.assigned_condition
          ) a USING (cond)
    )
    SELECT cond INTO picked_condition
      FROM counts
     WHERE n < 20
     ORDER BY n ASC, random()
     LIMIT 1
     FOR UPDATE;

    IF picked_condition IS NULL THEN
        RAISE EXCEPTION 'study2 full' USING ERRCODE = 'check_violation';
    END IF;

    SELECT f.url, f.name, f.topic INTO picked_url, picked_name, picked_topic
      FROM study2_podcast_files f
     WHERE f.condition = picked_condition
     ORDER BY random()
     LIMIT 1;

    IF picked_url IS NULL THEN
        RAISE EXCEPTION 'no podcast file seeded for condition %', picked_condition;
    END IF;

    INSERT INTO study2_assignments (participant_prolific_id, assigned_condition, podcast_file_url)
    VALUES (p_prolific_id, picked_condition, picked_url);

    INSERT INTO study2_responses (participant_prolific_id)
    VALUES (p_prolific_id);

    assigned_condition := picked_condition;
    podcast_file_url   := picked_url;
    podcast_file_name  := picked_name;
    podcast_topic      := picked_topic;
    RETURN NEXT;
END;
$$;

GRANT EXECUTE ON FUNCTION claim_study2_assignment(text) TO anon;


-- -----------------------------------------------------------------------------
-- 6.1b Static audio URL fetch
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION get_static_audio_files(p_keys text[])
RETURNS TABLE (key text, url text)
LANGUAGE sql SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
    SELECT s.key, s.url
      FROM static_audio_files s
     WHERE s.key = ANY(p_keys);
$$;

GRANT EXECUTE ON FUNCTION get_static_audio_files(text[]) TO anon;


-- -----------------------------------------------------------------------------
-- 6.2 Per-page progressive upserts
-- -----------------------------------------------------------------------------

-- Study 1 Page 2 --------------------------------------------------------------
CREATE OR REPLACE FUNCTION submit_study1_page2(
    p_prolific_id   text,
    p_age           age_bracket,
    p_gender        gender,
    p_native_tongue text
) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    UPDATE study1_responses
       SET age           = p_age,
           gender        = p_gender,
           native_tongue = p_native_tongue
     WHERE participant_prolific_id = p_prolific_id
       AND completed_at IS NULL;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'no active study1 session for %', p_prolific_id;
    END IF;
END;
$$;
GRANT EXECUTE ON FUNCTION submit_study1_page2(text, age_bracket, gender, text) TO anon;


-- Study 1 Page 3 --------------------------------------------------------------
CREATE OR REPLACE FUNCTION submit_study1_page3(
    p_prolific_id         text,
    p_conceptual_mapping  text,
    p_elicited_reaction   text,
    p_recognizability     smallint,
    p_distraction         smallint,
    p_abruptness          smallint,
    p_interruption        smallint,
    p_task_feedback       text
) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    UPDATE study1_responses
       SET conceptual_mapping = p_conceptual_mapping,
           elicited_reaction  = p_elicited_reaction,
           recognizability    = p_recognizability,
           distraction        = p_distraction,
           abruptness         = p_abruptness,
           interruption       = p_interruption,
           task_feedback      = p_task_feedback
     WHERE participant_prolific_id = p_prolific_id
       AND completed_at IS NULL;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'no active study1 session for %', p_prolific_id;
    END IF;
END;
$$;
GRANT EXECUTE ON FUNCTION submit_study1_page3(text, text, text, smallint, smallint, smallint, smallint, text) TO anon;


-- Study 1 finalize (Page 4) ---------------------------------------------------
CREATE OR REPLACE FUNCTION finalize_study1(
    p_prolific_id text
) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    UPDATE study1_responses
       SET completed_at = now()
     WHERE participant_prolific_id = p_prolific_id
       AND completed_at IS NULL;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'no active study1 session for %', p_prolific_id;
    END IF;
END;
$$;
GRANT EXECUTE ON FUNCTION finalize_study1(text) TO anon;


-- Study 2 Page 2 --------------------------------------------------------------
CREATE OR REPLACE FUNCTION submit_study2_page2(
    p_prolific_id            text,
    p_age                    age_bracket,
    p_gender                 gender,
    p_native_tongue          text,
    p_listening_frequency    smallint,
    p_listening_amount_yrs   integer,
    p_listening_amount_hrw   integer,
    p_listening_amount_pcm   integer,
    p_topic_familiarity      smallint,
    p_prior_stance           smallint,
    p_attitude_importance    smallint,
    p_attitude_elaboration   smallint,
    p_attitude_moralization  smallint,
    p_nfc_q1  smallint, p_nfc_q2  smallint, p_nfc_q3  smallint,
    p_nfc_q4  smallint, p_nfc_q5  smallint, p_nfc_q6  smallint,
    p_ihs_q1  smallint, p_ihs_q2  smallint, p_ihs_q3  smallint,
    p_ihs_q4  smallint, p_ihs_q5  smallint, p_ihs_q6  smallint,
    p_ihs_q7  smallint, p_ihs_q8  smallint, p_ihs_q9  smallint,
    p_ihs_q10 smallint, p_ihs_q11 smallint, p_ihs_q12 smallint
) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    UPDATE study2_responses
       SET age                   = p_age,
           gender                = p_gender,
           native_tongue         = p_native_tongue,
           listening_frequency   = p_listening_frequency,
           listening_amount_yrs  = p_listening_amount_yrs,
           listening_amount_hrw  = p_listening_amount_hrw,
           listening_amount_pcm  = p_listening_amount_pcm,
           topic_familiarity     = p_topic_familiarity,
           prior_stance          = p_prior_stance,
           attitude_importance   = p_attitude_importance,
           attitude_elaboration  = p_attitude_elaboration,
           attitude_moralization = p_attitude_moralization,
           nfc_q1 = p_nfc_q1, nfc_q2 = p_nfc_q2, nfc_q3 = p_nfc_q3,
           nfc_q4 = p_nfc_q4, nfc_q5 = p_nfc_q5, nfc_q6 = p_nfc_q6,
           ihs_q1 = p_ihs_q1, ihs_q2 = p_ihs_q2, ihs_q3 = p_ihs_q3,
           ihs_q4 = p_ihs_q4, ihs_q5 = p_ihs_q5, ihs_q6 = p_ihs_q6,
           ihs_q7 = p_ihs_q7, ihs_q8 = p_ihs_q8, ihs_q9 = p_ihs_q9,
           ihs_q10 = p_ihs_q10, ihs_q11 = p_ihs_q11, ihs_q12 = p_ihs_q12
     WHERE participant_prolific_id = p_prolific_id
       AND completed_at IS NULL
       AND exited_prematurely_at IS NULL;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'no active study2 session for %', p_prolific_id;
    END IF;
END;
$$;
GRANT EXECUTE ON FUNCTION submit_study2_page2(
    text, age_bracket, gender, text,
    smallint, integer, integer, integer,
    smallint, smallint, smallint, smallint, smallint,
    smallint, smallint, smallint, smallint, smallint, smallint,
    smallint, smallint, smallint, smallint, smallint, smallint,
    smallint, smallint, smallint, smallint, smallint, smallint
) TO anon;


-- Study 2 Page 3 heartbeat ----------------------------------------------------
CREATE OR REPLACE FUNCTION update_study2_playback_stats(
    p_prolific_id              text,
    p_latest_time_reached      integer,
    p_total_playtime           integer,
    p_pause_button_clicks      integer,
    p_backtrack_button_clicks  integer
) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    UPDATE study2_responses
       SET latest_time_reached     = GREATEST(COALESCE(latest_time_reached,     0), p_latest_time_reached),
           total_playtime          = GREATEST(COALESCE(total_playtime,          0), p_total_playtime),
           pause_button_clicks     = GREATEST(COALESCE(pause_button_clicks,     0), p_pause_button_clicks),
           backtrack_button_clicks = GREATEST(COALESCE(backtrack_button_clicks, 0), p_backtrack_button_clicks)
     WHERE participant_prolific_id = p_prolific_id
       AND completed_at IS NULL
       AND exited_prematurely_at IS NULL;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'no active study2 session for %', p_prolific_id;
    END IF;
END;
$$;
GRANT EXECUTE ON FUNCTION update_study2_playback_stats(text, integer, integer, integer, integer) TO anon;


-- Study 2 Page 4 --------------------------------------------------------------
CREATE OR REPLACE FUNCTION submit_study2_page4(
    p_prolific_id       text,
    p_recall_q1  char, p_recall_q2  char, p_recall_q3  char,
    p_recall_q4  char, p_recall_q5  char, p_recall_q6  char,
    p_recall_q7  char, p_recall_q8  char, p_recall_q9  char,
    p_recall_q10 char, p_recall_q11 char, p_recall_q12 char,
    p_recall_q13 char, p_recall_q14 char, p_recall_q15 char,
    p_sound_recognized  boolean,
    p_recognition_freq  smallint,
    p_presumed_purpose  text,
    p_stats_rationale   text,
    p_podcast_density   smallint,
    p_podcast_pace      smallint
) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    UPDATE study2_responses
       SET recall_q1 = p_recall_q1, recall_q2 = p_recall_q2, recall_q3 = p_recall_q3,
           recall_q4 = p_recall_q4, recall_q5 = p_recall_q5, recall_q6 = p_recall_q6,
           recall_q7 = p_recall_q7, recall_q8 = p_recall_q8, recall_q9 = p_recall_q9,
           recall_q10 = p_recall_q10, recall_q11 = p_recall_q11, recall_q12 = p_recall_q12,
           recall_q13 = p_recall_q13, recall_q14 = p_recall_q14, recall_q15 = p_recall_q15,
           sound_recognized  = p_sound_recognized,
           recognition_freq  = p_recognition_freq,
           presumed_purpose  = p_presumed_purpose,
           stats_rationale   = p_stats_rationale,
           podcast_density   = p_podcast_density,
           podcast_pace      = p_podcast_pace
     WHERE participant_prolific_id = p_prolific_id
       AND completed_at IS NULL
       AND exited_prematurely_at IS NULL;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'no active study2 session for %', p_prolific_id;
    END IF;
END;
$$;
GRANT EXECUTE ON FUNCTION submit_study2_page4(
    text,
    char, char, char, char, char, char, char, char, char,
    char, char, char, char, char, char,
    boolean, smallint, text, text, smallint, smallint
) TO anon;


-- Study 2 Page 5 --------------------------------------------------------------
CREATE OR REPLACE FUNCTION submit_study2_page5(
    p_prolific_id       text,
    p_bm_recognized_1   boolean,
    p_bm_recognized_2   boolean,
    p_bm_rationale_1    text,
    p_bm_rationale_2    text
) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    UPDATE study2_responses
       SET bm_recognized_1 = p_bm_recognized_1,
           bm_recognized_2 = p_bm_recognized_2,
           bm_rationale_1  = p_bm_rationale_1,
           bm_rationale_2  = p_bm_rationale_2
     WHERE participant_prolific_id = p_prolific_id
       AND completed_at IS NULL
       AND exited_prematurely_at IS NULL;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'no active study2 session for %', p_prolific_id;
    END IF;
END;
$$;
GRANT EXECUTE ON FUNCTION submit_study2_page5(text, boolean, boolean, text, text) TO anon;


-- Study 2 Page 6 --------------------------------------------------------------
CREATE OR REPLACE FUNCTION submit_study2_page6(
    p_prolific_id          text,
    p_conceptual_mapping   text,
    p_elicited_reaction    text,
    p_acclimate_trend      smallint,
    p_acclimate_rationale  text,
    p_recognizability      smallint,
    p_distraction          smallint,
    p_abruptness           smallint,
    p_interruption         smallint
) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    UPDATE study2_responses
       SET conceptual_mapping  = p_conceptual_mapping,
           elicited_reaction   = p_elicited_reaction,
           acclimate_trend     = p_acclimate_trend,
           acclimate_rationale = p_acclimate_rationale,
           recognizability     = p_recognizability,
           distraction         = p_distraction,
           abruptness          = p_abruptness,
           interruption        = p_interruption
     WHERE participant_prolific_id = p_prolific_id
       AND completed_at IS NULL
       AND exited_prematurely_at IS NULL;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'no active study2 session for %', p_prolific_id;
    END IF;
END;
$$;
GRANT EXECUTE ON FUNCTION submit_study2_page6(
    text, text, text, smallint, text, smallint, smallint, smallint, smallint
) TO anon;


-- Study 2 Page 7 --------------------------------------------------------------
CREATE OR REPLACE FUNCTION submit_study2_page7(
    p_prolific_id                  text,
    p_informed_consent             boolean,
    p_debrief_immediate_reaction   text,
    p_debrief_downstream_behavior  text,
    p_task_feedback                text
) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    UPDATE study2_responses
       SET informed_consent            = p_informed_consent,
           debrief_immediate_reaction  = p_debrief_immediate_reaction,
           debrief_downstream_behavior = p_debrief_downstream_behavior,
           task_feedback               = p_task_feedback
     WHERE participant_prolific_id = p_prolific_id
       AND completed_at IS NULL
       AND exited_prematurely_at IS NULL;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'no active study2 session for %', p_prolific_id;
    END IF;
END;
$$;
GRANT EXECUTE ON FUNCTION submit_study2_page7(text, boolean, text, text, text) TO anon;


-- Study 2 finalize (Page 8) ---------------------------------------------------
CREATE OR REPLACE FUNCTION finalize_study2(
    p_prolific_id text
) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    UPDATE study2_responses
       SET completed_at = now()
     WHERE participant_prolific_id = p_prolific_id
       AND completed_at IS NULL
       AND exited_prematurely_at IS NULL;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'no active study2 session for %', p_prolific_id;
    END IF;
END;
$$;
GRANT EXECUTE ON FUNCTION finalize_study2(text) TO anon;


-- Study 2 premature exit ------------------------------------------------------
CREATE OR REPLACE FUNCTION abort_study2(
    p_prolific_id text
) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    UPDATE study2_responses
       SET exited_prematurely_at = now()
     WHERE participant_prolific_id = p_prolific_id
       AND completed_at IS NULL
       AND exited_prematurely_at IS NULL;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'no active study2 session for %', p_prolific_id;
    END IF;
END;
$$;
GRANT EXECUTE ON FUNCTION abort_study2(text) TO anon;


COMMIT;
