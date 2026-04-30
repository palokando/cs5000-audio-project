import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SUPABASE_URL, SUPABASE_ANON } from "./config.js";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

async function rpc(name, params) {
  const { data, error } = await supabase.rpc(name, params);
  if (error) throw new Error(`${name}: ${error.message}`);
  return data;
}

// ---------------------------------------------------------------------------
// Assignment claiming
// ---------------------------------------------------------------------------

export async function claimStudy1Assignment(prolificId) {
  const data = await rpc("claim_study1_assignment", { p_prolific_id: prolificId });
  const row = Array.isArray(data) ? data[0] : data;
  return { assignedSoundCue: row.assigned_sound_cue, snippetUrls: row.snippet_urls };
}

export async function claimStudy2Assignment(prolificId) {
  const data = await rpc("claim_study2_assignment", { p_prolific_id: prolificId });
  const row = Array.isArray(data) ? data[0] : data;
  return {
    assignedCondition: row.assigned_condition,
    podcastFileUrl: row.podcast_file_url,
    podcastFileName: row.podcast_file_name,
    podcastTopic: row.podcast_topic,
  };
}

// ---------------------------------------------------------------------------
// Static audio
// ---------------------------------------------------------------------------

export async function getStaticAudioFiles(keys) {
  const rows = await rpc("get_static_audio_files", { p_keys: keys });
  const out = {};
  for (const { key, url } of rows ?? []) out[key] = url;
  return out;
}

// ---------------------------------------------------------------------------
// Study 1 page submissions
// ---------------------------------------------------------------------------

export function submitStudy1Page2(prolificId, v) {
  return rpc("submit_study1_page2", {
    p_prolific_id: prolificId,
    p_age: v.age,
    p_gender: v.gender,
    p_native_tongue: v.nativeTongue,
  });
}

export function submitStudy1Page3(prolificId, v) {
  return rpc("submit_study1_page3", {
    p_prolific_id: prolificId,
    p_conceptual_mapping: v.conceptualMapping,
    p_elicited_reaction:  v.elicitedReaction,
    p_recognizability:    v.recognizability,
    p_distraction:        v.distraction,
    p_abruptness:         v.abruptness,
    p_interruption:       v.interruption,
    p_task_feedback:      v.taskFeedback,
  });
}

export function finalizeStudy1(prolificId) {
  return rpc("finalize_study1", { p_prolific_id: prolificId });
}

// ---------------------------------------------------------------------------
// Study 2 page submissions
// ---------------------------------------------------------------------------

export function submitStudy2Page2(prolificId, v) {
  return rpc("submit_study2_page2", {
    p_prolific_id: prolificId,
    p_age: v.age,
    p_gender: v.gender,
    p_native_tongue: v.nativeTongue,
    p_listening_frequency: v.listeningFrequency,
    p_listening_amount_yrs: v.listeningAmountYrs,
    p_listening_amount_hrw: v.listeningAmountHrw,
    p_listening_amount_pcm: v.listeningAmountPcm,
    p_topic_familiarity: v.topicFamiliarity,
    p_prior_stance: v.priorStance,
    p_attitude_importance: v.attitudeImportance,
    p_attitude_elaboration: v.attitudeElaboration,
    p_attitude_moralization: v.attitudeMoralization,
    p_nfc_q1: v.nfc[0], p_nfc_q2: v.nfc[1], p_nfc_q3: v.nfc[2],
    p_nfc_q4: v.nfc[3], p_nfc_q5: v.nfc[4], p_nfc_q6: v.nfc[5],
    p_ihs_q1: v.ihs[0],  p_ihs_q2: v.ihs[1],  p_ihs_q3: v.ihs[2],
    p_ihs_q4: v.ihs[3],  p_ihs_q5: v.ihs[4],  p_ihs_q6: v.ihs[5],
    p_ihs_q7: v.ihs[6],  p_ihs_q8: v.ihs[7],  p_ihs_q9: v.ihs[8],
    p_ihs_q10: v.ihs[9], p_ihs_q11: v.ihs[10], p_ihs_q12: v.ihs[11],
  });
}

export function updateStudy2PlaybackStats(prolificId, s) {
  return rpc("update_study2_playback_stats", {
    p_prolific_id: prolificId,
    p_latest_time_reached: s.latestTimeReached,
    p_total_playtime: s.totalPlaytime,
    p_pause_button_clicks: s.pauseClicks,
    p_backtrack_button_clicks: s.backtrackClicks,
  });
}

export function submitStudy2Page4(prolificId, v) {
  const params = {
    p_prolific_id: prolificId,
    p_sound_recognized: v.soundRecognized,
    p_recognition_freq: v.recognitionFreq,
    p_presumed_purpose: v.presumedPurpose,
    p_stats_rationale: v.statsRationale,
    p_podcast_density: v.podcastDensity,
    p_podcast_pace: v.podcastPace,
  };
  for (let i = 1; i <= 15; i++) params[`p_recall_q${i}`] = v.recall[i - 1];
  return rpc("submit_study2_page4", params);
}

export function submitStudy2Page5(prolificId, v) {
  return rpc("submit_study2_page5", {
    p_prolific_id: prolificId,
    p_bm_recognized_b: v.recognizedB,
    p_bm_recognized_m: v.recognizedM,
    p_bm_rationale_b: v.rationaleB,
    p_bm_rationale_m: v.rationaleM,
  });
}

export function submitStudy2Page6(prolificId, v) {
  return rpc("submit_study2_page6", {
    p_prolific_id: prolificId,
    p_conceptual_mapping: v.conceptualMapping,
    p_elicited_reaction: v.elicitedReaction,
    p_acclimate_trend: v.acclimateTrend,
    p_acclimate_rationale: v.acclimateRationale,
    p_recognizability: v.recognizability,
    p_distraction: v.distraction,
    p_abruptness: v.abruptness,
    p_interruption: v.interruption,
  });
}

export function submitStudy2Page7(prolificId, v) {
  return rpc("submit_study2_page7", {
    p_prolific_id: prolificId,
    p_informed_consent: v.informedConsent,
    p_debrief_immediate_reaction: v.immediateReaction,
    p_debrief_downstream_behavior: v.downstreamBehavior,
    p_task_feedback: v.taskFeedback
  });
}

export function finalizeStudy2(prolificId) {
  return rpc("finalize_study2", { p_prolific_id: prolificId });
}

export function abortStudy2(prolificId) {
  return rpc("abort_study2", { p_prolific_id: prolificId });
}
