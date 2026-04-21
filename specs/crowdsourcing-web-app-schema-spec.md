# Web App for Two Crowdsourcing Studies on Podcast-Integrated Sound Cues

## Task Overview
- The product is a web application housing the functionality for two crowdsourcing studies to-be-launched on the Prolific platform
- The studies are centered around the integration of auditory misinformation warnings into podcasts, assessing the impact of these sound cues on the listening experience and exploring how they are perceived by users
- Both studies will require participants to listen to several audio recordings (ranging from podcasts to short excerpts, all these files are already prepared separately) and provide answers in the form of Likert scales, multiple-choice questions, and short free-text responses (response-length of at most 2 sentences)
- The studies will be launched consecutively as results from the first will be taken into account prior to the second one's execution: despite this, the deployed web application is still only one, internally housing two configurations that can be switched once the time comes to carry out the second study

## Technology Stack
- Cloudflare R2 for storage and content delivery of all M4A audio files used throughout the studies
- Supabase for persistence of all research data collected in the studies
- GitHub Pages for web app deployment (frontend itself written using HTML, CSS, JavaScript)

## Study 1

### Participant Pool
- 150 participants from the US
- 15 sound cues are being examined, meaning that each of them should be evaluated by 10 randomly assigned crowdworkers

### Required Materials
- Each sound cue has been integrated into 3 short excerpts that a participant will listen to during the study
- A short conversation snippet will also be included at the start of the study for volume calibration: it is the same for all participants
- In total, this makes 46 audio files stored on R2 for Study 1

### Enforcement of Random-Assignment Constraints (`assignments`)
Constraints for the random assignment of participants will be enforced atomically in Supabase: each sound cue must have 10 evaluators assigned. The following fields could help capture these assignments:
- `participant_prolific_id`: unique alphanumeric string
- `assigned_sound_cue`: one of 15 options

### Persistence of Worker-Submitted Data (`responses`)
The following fields, accompanied by their value types, all represent data obtained during the study:
- `participant_prolific_id`: unique alphanumeric string
- `age`: options of (18-24), (25-34), (35-44), (45-54), (55-64), (65+), or Unspecified
- `gender`: options of Male, Female, Non-Binary, or Unspecified
- `native_tongue`: free text
- `conceptual_mapping`: free text
- `elicited_reaction`: free text
- `recognizability`: 5-point Likert scale, (Not at all) to (Extremely)
- `distraction`: 5-point Likert scale, (Not at all) to (Extremely)
- `abruptness`: 5-point Likert scale, (Not at all) to (Extremely)
- `interruption`: 5-point Likert scale, (Not at all) to (Extremely)
- `task_feedback`: free text

## Study 2

### Participant Pool
- 100 participants from the US
- 4 alternatives for the placement of sound cues are examined (before, after, enclosing, or concurrent with a misinformation segment), and a control group (without podcast-integrated sound cues) is also included, making a total of 5 experimental conditions, each of which should therefore be randomly assigned 20 crowdworkers

### Required Materials
- 3 podcasts on distinct topics, alongside versions of them overlayed with auditory warnings according to the 4 placement-alternatives, have all been prepared
- These 15 audio files are the largest ones stored on R2 for Study 2, additional smaller files including volume calibration samples and extracted misinformation segments

### Enforcement of Random-Assignment Constraints (`assignments`)
Constraints for the random assignment of participants will be enforced atomically in Supabase: each experimental condition must have 20 crowdworkers assigned. Importantly, each participant is only presented with one podcast (namely, one of its 5 versions) during the study: three podcast topics have simply been considered for diversity, meaning no additional minimal-assignment constraints are required for a topic to be picked. The following fields could help capture participant-assignments:
- `participant_prolific_id`: unique alphanumeric string
- `assigned_condition`: one of 5 options (without, before, after, enclosing, concurrent)
- `podcast_file_url`: URL-formatted string

### Persistence of Worker-Submitted Data (`responses`)
The following fields, accompanied by their value types, all represent data obtained during the study:
- `participant_prolific_id`: unique alphanumeric string
- `age`: options of (18-24), (25-34), (35-44), (45-54), (55-64), (65+), or Unspecified
- `gender`: options of Male, Female, Non-Binary, or Unspecified
- `native_tongue`: free text
- `listening_frequency`: integer in the range 1 to 4, inclusive
- `listening_amount_yrs`: integer
- `listening_amount_hrw`: integer
- `listening_amount_pcm`: integer
- `topic_familiarity`: 7-point Likert scale, (Non-existent) to (Excellent)
- `prior_stance`: 7-point Likert scale, (Strongly disagree) to (Strongly agree)
- `attitude_importance`: 7-point Likert scale, (Not important at all) to (Extremely important)
- `attitude_elaboration`: 7-point Likert scale, (Strongly disagree) to (Strongly agree)
- `attitude_moralization`: 7-point Likert scale, (Strongly disagree) to (Strongly agree)
- `nfc_q{i}` (where `i` specifies one of 6 answered questions): 5-point Likert scale, (Extremely uncharacteristic of me) to (Extremely characteristic of me)
- `ihs_q{i}` (where `i` specifies one of 12 answered questions): 9-point Likert scale, (Strongly disagree) to (Strongly agree)
- `latest_time_reached`: integer represening seconds
- `total_playtime`: integer representing seconds
- `pause_button_clicks`: integer
- `backtrack_button_clicks`: integer
- `recall_q{i}` (where `i` specifies one of 15 answered questions): single character representing one of four answer-options, A/B/C/D
- `sound_recognized`: boolean
- `recognition_freq`: integer in the range 1 to 3, inclusive
- `presumed_purpose`: free text
- `stats_rationale`: free text
- `podcast_density`: 5-point Likert scale, (Too sparse) to (Too cluttered)
- `podcast_pace`: 5-point Likert scale, (Very slow) to (Very fast)
- `bm_recognized_1`: boolean
- `bm_recognized_2`: boolean
- `bm_rationale_1`: free text
- `bm_rationale_2`: free text
- `conceptual_mapping`: free text
- `elicited_reaction`: free text
- `acclimate_trend`: integer in the range 1 to 3, inclusive
- `acclimate_rationale`: free text
- `recognizability`: 5-point Likert scale, (Not at all) to (Extremely)
- `distraction`: 5-point Likert scale, (Not at all) to (Extremely)
- `abruptness`: 5-point Likert scale, (Not at all) to (Extremely)
- `interruption`: 5-point Likert scale, (Not at all) to (Extremely)
- `informed_consent`: boolean
- `debrief_immediate_reaction`: free text
- `debrief_downstream_behavior`: free text
- `task_feedback`: free text
