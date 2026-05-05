// Page 4 — Recall Assessment.

import { submitStudy2Page4 } from "../../supabase.js";
import { radioGroup, textArea, likert } from "../../form-helpers.js";

const LOREM = "<h1>Page 3: Recall Assessment</h1><p>Based on what you remember from the podcast you just listened to, complete the questionnaire below. Each of the 15 content-related multiple-choice questions has one unique correct answer: please read both the question-text and the answer-options carefully before making your selection.</p>";

const YES_NO = [["true", "Yes"], ["false", "No"]];
const FREQ_OPTS = [["1", "Once"], ["2", "Twice"], ["3", "Three times or more"]];
const DENSITY_LABELS = ["Too sparse", "Sparse", "Moderate", "Cluttered", "Too cluttered"];
const PACE_LABELS = ["Very slow", "Slow", "Moderate", "Fast", "Very fast"];

let fields = null;
let setReadyCb = null;

function recheck() { setReadyCb?.(validate().ok); }

function validate() {
  if (!fields) return { ok: false };
  if (fields.recall.some((r) => r.getValue() === null)) return { ok: false };
  if (fields.recognized.getValue() === null && !fields.recognized.element.hidden) return { ok: false };

  const recognizedFlag = fields.recognized.getValue() === "true";
  if (recognizedFlag && fields.freq.getValue() === null) return { ok: false };
  if (recognizedFlag && !fields.purpose.isFilled()) return { ok: false };

  if (!fields.statsRationale.isFilled() && !fields.statsRationale.element.hidden) return { ok: false };
  if (fields.density.getValue() === null) return { ok: false };
  if (fields.pace.getValue() === null) return { ok: false };
  return { ok: true };
}

export default {
  id: 4,
  showQuit: true,
  showContinue: true,
  instructions: LOREM,

  mount(container, state, ctx) {
    setReadyCb = ctx.setReady;
    fields = {};

    if (state.podcastTopic === "ne") {
      fields.recall = [
        radioGroup(container, "Which of the following is <mark>NOT</mark> a step in the nuclear fission chain reaction described in the podcast?", [
          ["A", "<strong>A.</strong> An unstable atom splits and releases an immense amount of heat."],
          ["B", "<strong>B.</strong> Splitting atoms shoot out two or three additional neutrons."],
          ["C", "<strong>C.</strong> Newly released neutrons strike other nearby uranium atoms."],
          ["D", "<strong>D.</strong> Two uranium atoms merge together to form a heavier nucleus."]
        ]),
        radioGroup(container, "Why is nuclear fuel considered more attractive than burning fossil fuels according to the hosts?", [
          ["A", "<strong>A.</strong> Because chemical reactions like burning are very difficult to control safely."],
          ["B", "<strong>B.</strong> Because nuclear reactions only rearrange surface-level electrons."],
          ["C", "<strong>C.</strong> Because only a small amount of fuel is needed to make a lot of power."],
          ["D", "<strong>D.</strong> Because fossil fuels require more expensive turbine technology."]
        ]),
        radioGroup(container, "Which of the following is <mark>NOT</mark> a characteristic of commercial nuclear fuel pellets?", [
          ["A", "<strong>A.</strong> They are produced from a malleable metallic ore."],
          ["B", "<strong>B.</strong> They are processed into small, hard, black units."],
          ["C", "<strong>C.</strong> They are roughly the size of a marshmallow."],
          ["D", "<strong>D.</strong> They are composed of a solid ceramic material."]
        ]),
        radioGroup(container, "How did the hosts characterize the scale of a reactor meltdown and a nuclear explosion?", [
          ["A", "<strong>A.</strong> A meltdown is more dangerous because it cannot be seen."],
          ["B", "<strong>B.</strong> A meltdown is a financial disaster but not a nuclear explosion."],
          ["C", "<strong>C.</strong> Meltdowns are only a potential risk in older 1970s reactor designs."],
          ["D", "<strong>D.</strong> An explosion is a mechanical failure, while a meltdown is chemical."]
        ]),
        radioGroup(container, "Which of the following is <mark>NOT</mark> true regarding weapons-grade uranium compared to reactor fuel?", [
          ["A", "<strong>A.</strong> Weapons-grade uranium is enriched with about 90% U235."],
          ["B", "<strong>B.</strong> Reactor fuel lacks the concentration of energy required to detonate."],
          ["C", "<strong>C.</strong> High enrichment is a physical requirement for a nuclear explosion."],
          ["D", "<strong>D.</strong> Reactor fuel and weapons-grade uranium are of comparable purity."]
        ]),
        radioGroup(container, "What is the primary safety function of control rods made from materials like silver, indium, or boron?", [
          ["A", "<strong>A.</strong> To absorb neutrons and instantly stop the nuclear chain reaction."],
          ["B", "<strong>B.</strong> To provide structural support for the heavy steel pressure vessel."],
          ["C", "<strong>C.</strong> To filter out radioactive isotopes from the steam before it hits the turbine."],
          ["D", "<strong>D.</strong> To act as a heat sink that melts before the uranium fuel itself would."]
        ]),
        radioGroup(container, "What is the primary safety function of the steel-reinforced containment building in the 'defense in depth' philosophy?", [
          ["A", "<strong>A.</strong> To serve as a weather shelter for the turbines and other sensitive equipment."],
          ["B", "<strong>B.</strong> To ensure that even if fuel melts, it remains inside a secure concrete box."],
          ["C", "<strong>C.</strong> To enclose a vacuum-sealed chamber that increases electrical output."],
          ["D", "<strong>D.</strong> To provide the insulation needed to maintain a consistent reactor temperature."]
        ]),
        radioGroup(container, "What comparison did the hosts make regarding the safety of the US nuclear industry versus fossil fuels?", [
          ["A", "<strong>A.</strong> Nuclear energy causes fewer workplace accidents than wind turbine maintenance."],
          ["B", "<strong>B.</strong> Fossil fuels are far safer because they do not produce long-term radioactive waste."],
          ["C", "<strong>C.</strong> Nuclear is safer as it avoids the respiratory issues caused by fossil fuel pollution."],
          ["D", "<strong>D.</strong> The safety of nuclear energy is currently identical to that of natural gas."]
        ]),
        radioGroup(container, "What substance is primarily emitted from the large towers of a nuclear power plant during standard operation?", [
          ["A", "<strong>A.</strong> Carbon dioxide."],
          ["B", "<strong>B.</strong> Pure water vapor."],
          ["C", "<strong>C.</strong> Nitrogen oxide."],
          ["D", "<strong>D.</strong> Sulfur dioxide."]
        ]),
        radioGroup(container, "According to the podcast, what is the key reason nuclear energy is described as the 'workhorse' of the energy grid?", [
          ["A", "<strong>A.</strong> It has a high capacity factor of over 92%, providing constant baseload power."],
          ["B", "<strong>B.</strong> It uses a simplified turbine system that requires less maintenance than solar."],
          ["C", "<strong>C.</strong> It produces more energy per square mile than all other resources in the US."],
          ["D", "<strong>D.</strong> It can be turned on and off more quickly than wind or solar power."]
        ]),
        radioGroup(container, "Which of the following statements was <mark>NOT</mark> made in the podcast regarding the volume of nuclear waste produced?", [
          ["A", "<strong>A.</strong> One person's lifetime of nuclear energy waste would fit in a soda can."],
          ["B", "<strong>B.</strong> It is small enough that the entire US industry's waste fits on one football field."],
          ["C", "<strong>C.</strong> It is significantly smaller than the volume of coal ash produced in a year."],
          ["D", "<strong>D.</strong> It would take up the full depth of two Olympic-size swimming pools."]
        ]),
        radioGroup(container, "What is the standard two-step process for managing spent fuel once it is removed from a nuclear reactor?", [
          ["A", "<strong>A.</strong> Storage in deep water pools for cooling, followed by transfer to dry casks."],
          ["B", "<strong>B.</strong> Immediate burial in salt mines, followed by surface-level encasement."],
          ["C", "<strong>C.</strong> Grinding into solid powder, followed by storage in reinforced metal drums."],
          ["D", "<strong>D.</strong> Chemical neutralization in specialized vats, followed by deep sea disposal."]
        ]),
        radioGroup(container, "What is the primary hurdle preventing the US from following Finland's lead on geological repositories?", [
          ["A", "<strong>A.</strong> The lack of scientific knowledge on how to build one."],
          ["B", "<strong>B.</strong> The lower funding compared to European nations."],
          ["C", "<strong>C.</strong> The lack of political consensus on a suitable location."],
          ["D", "<strong>D.</strong> The higher radioactivity of US-designed fuel pellets."]
        ]),
        radioGroup(container, "Which of the following is <mark>NOT</mark> a characteristic of the 'passive safety' systems in modern SMR (Small Modular Reactor) designs?", [
          ["A", "<strong>A.</strong> They rely on gravity and natural convection for cooling."],
          ["B", "<strong>B.</strong> They are designed to be 'walk-away safe' to reduce human error."],
          ["C", "<strong>C.</strong> They do not face the risk of electric pump failure if power is cut."],
          ["D", "<strong>D.</strong> They are outfitted with a dome that automatically covers the core."]
        ]),
        radioGroup(container, "Which of the following is <mark>NOT</mark> a benefit of nuclear fusion that the hosts highlighted while contrasting it with fission?", [
          ["A", "<strong>A.</strong> Nearly limitless energy production."],
          ["B", "<strong>B.</strong> Zero risk of a reactor meltdown."],
          ["C", "<strong>C.</strong> Present-day commercial availability."],
          ["D", "<strong>D.</strong> No long-term leftover radioactive waste."]
        ])
      ];
    } else if (state.podcastTopic === "cpr") {
      fields.recall = [
        radioGroup(container, "What is the primary physical difference between ionizing and non-ionizing radiation?", [
          ["A", "<strong>A.</strong> Ionizing radiation is used by home Wi-Fi routers, while non-ionizing is used for medical X-rays."],
          ["B", "<strong>B.</strong> Ionizing radiation carries enough energy to knock electrons out of orbit, while non-ionizing does not."],
          ["C", "<strong>C.</strong> Ionizing radiation generates surface heat, while non-ionizing radiation alters matter at the atomic level."],
          ["D", "<strong>D.</strong> Ionizing radiation is low frequency and low energy, while non-ionizing radiation is high frequency."]
        ]),
        radioGroup(container, "As stated in the podcast, how does radio frequency (RF) energy cause the biological effect of tissue heating?", [
          ["A", "<strong>A.</strong> It physically breaks chemical bonds, which releases thermal energy into the bloodstream."],
          ["B", "<strong>B.</strong> It triggers a chemical reaction between the skin's surface and the phone's metallic casing."],
          ["C", "<strong>C.</strong> It causes nearby water molecules to vibrate, which creates friction that in turn generates heat."],
          ["D", "<strong>D.</strong> It interacts with the immune system, which reacts to the waves by raising internal temperature."]
        ]),
        radioGroup(container, "What physical constraint of RF waves did the hosts highlight regarding immune system interaction?", [
          ["A", "<strong>A.</strong> The waves are blocked by the outermost layer of skin."],
          ["B", "<strong>B.</strong> RF energy is absorbed by bone marrow before hitting T cells."],
          ["C", "<strong>C.</strong> 5G wavelengths are too short to reach and alter immune cells."],
          ["D", "<strong>D.</strong> The properties of the waves inherently restrict them to vibration."]
        ]),
        radioGroup(container, "Which of the following was <mark>NOT</mark> a purpose of the $30 million National Toxicology Program (NTP) rodent study?", [
          ["A", "<strong>A.</strong> To test the biological boundaries of long-term, low-level RF exposure."],
          ["B", "<strong>B.</strong> To see if non-thermal biological effects were theoretically possible."],
          ["C", "<strong>C.</strong> To simulate the daily usage levels of current cellular technology."],
          ["D", "<strong>D.</strong> To move the scientific debate beyond just immediate DNA damage."]
        ]),
        radioGroup(container, "Which of the following was <mark>NOT</mark> a characteristic of the rodent exposure in the NTP study?", [
          ["A", "<strong>A.</strong> It lasted for up to 9 hours every day for 2 years."],
          ["B", "<strong>B.</strong> It utilized intervals of 10 minutes on and 10 minutes off."],
          ["C", "<strong>C.</strong> The rats and mice were kept in glass cages in an open laboratory."],
          ["D", "<strong>D.</strong> The rodents received whole-body exposure to 2G and 3G radiation."]
        ]),
        radioGroup(container, "What crucial detail did the hosts point out when discussing the significance of the NTP study's findings?", [
          ["A", "<strong>A.</strong> The rodents were exposed to levels four times the human limit."],
          ["B", "<strong>B.</strong> The tumors were found to be benign rather than malignant."],
          ["C", "<strong>C.</strong> The animals that were affected only developed cancer of the brain."],
          ["D", "<strong>D.</strong> The RF exposure equally impacted rats and mice of either sex."]
        ]),
        radioGroup(container, "Which of the following is <mark>NOT</mark> a reason given for why RF energy cannot replicate inside the body?", [
          ["A", "<strong>A.</strong> The energy simply dissipates as heat as it travels through tissue."],
          ["B", "<strong>B.</strong> Human cells lack the biological machinery required to emit RF waves."],
          ["C", "<strong>C.</strong> The energy does not behave like a biological pathogen, such as a virus."],
          ["D", "<strong>D.</strong> The human body's high salt content ensures external waves are reflected."]
        ]),
        radioGroup(container, "Why does a 10-year-old child absorb up to 153% more radiation than an adult when holding a phone to their head?", [
          ["A", "<strong>A.</strong> Their brain tissue has a higher water and ion content, making it more conductive."],
          ["B", "<strong>B.</strong> Their ears are larger and thus serve as more efficient collectors for radio frequency energy."],
          ["C", "<strong>C.</strong> Their more abundant fatty tissue acts as an insulator, trapping the energy beneath the skin."],
          ["D", "<strong>D.</strong> Their higher metabolism accelerates the rate at which incoming waves are absorbed."]
        ]),
        radioGroup(container, "Which of the following is <mark>NOT</mark> a criticism leveled against current FCC safety guidelines for cellular technology?", [
          ["A", "<strong>A.</strong> They represent a world that no longer exists based on the infancy of the modern telecom era."],
          ["B", "<strong>B.</strong> They rely on tools outright incapable of measuring the molecular vibration that causes heating."],
          ["C", "<strong>C.</strong> They fail to account for the unique anatomical vulnerabilities of children and pregnant women."],
          ["D", "<strong>D.</strong> They were derived using a model of a fully-grown elite soldier from more than three decades ago."]
        ]),
        radioGroup(container, "According to environmental agencies like the Audubon Society, what is the observed impact of cellular networks on birds and bees?", [
          ["A", "<strong>A.</strong> 5G frequencies are the primary cause of migratory bird confusion."],
          ["B", "<strong>B.</strong> Waves from 5G networks do not disrupt the biology of birds or bees."],
          ["C", "<strong>C.</strong> Modern cell towers cause significant declines in bee population fertility."],
          ["D", "<strong>D.</strong> The denser 5G towers attract more predatory birds to residential areas."]
        ]),
        radioGroup(container, "Regarding the discussion of the inverse square law, which of the following is <mark>NOT</mark> true?", [
          ["A", "<strong>A.</strong> Energy intensity drops off significantly the further a wave travels from its source."],
          ["B", "<strong>B.</strong> Doubling the distance from an emitter results in receiving only a quarter of the radiation."],
          ["C", "<strong>C.</strong> Moving the phone next to the head minimizes the measured Specific Absorption Rate."],
          ["D", "<strong>D.</strong> Distance is the best available scientifically-backed defense against RF exposure."]
        ]),
        radioGroup(container, "Which of the following is <mark>NOT</mark> a prevalent distance-based safety guideline mentioned in the podcast?", [
          ["A", "<strong>A.</strong> Carry the device in a backpack or purse instead of against the body."],
          ["B", "<strong>B.</strong> Leave the phone off the mattress and across the room while sleeping."],
          ["C", "<strong>C.</strong> Keep the phone at least five inches away from the head even with Airplane Mode on."],
          ["D", "<strong>D.</strong> Use the speaker-phone function or a wired headset during a call whenever possible."]
        ]),
        radioGroup(container, "As stated in the podcast, what mechanism triggered by weak signals (1-2 bars) makes them problematic for radiation exposure?", [
          ["A", "<strong>A.</strong> The phone amplifier ramps up its power output to the allowed maximum to reach the tower."],
          ["B", "<strong>B.</strong> Ambient signal noise at the user's location forces the phone to use more battery voltage."],
          ["C", "<strong>C.</strong> The cell tower itself sends a high-voltage pulse to the device to force a one-way digital pairing."],
          ["D", "<strong>D.</strong> The phone antenna extends its channel bandwidth to capture incoming waves that overlap."]
        ]),
        radioGroup(container, "Which of the following is <mark>NOT</mark> a reason cited for the failure of radiation shield and sticker products?", [
          ["A", "<strong>A.</strong> The radiation shield tricks the device into assuming it is in a bad coverage area."],
          ["B", "<strong>B.</strong> Internal sensors detect a drop in the signal-to-noise ratio due to the blockage."],
          ["C", "<strong>C.</strong> The phone is trapped in a maximal-power feedback loop, increasing RF exposure."],
          ["D", "<strong>D.</strong> Stickers interfere with GPS sensors, which start emitting high-frequency pings."]
        ]),
        radioGroup(container, "Which of the following was <mark>NOT</mark> considered by the hosts as a cause of power spikes during phone usage in a moving vehicle?", [
          ["A", "<strong>A.</strong> The car's metal frame acts as a Faraday cage, blocking the outgoing signal."],
          ["B", "<strong>B.</strong> A Bluetooth connection to the car itself creates interference, draining the signal."],
          ["C", "<strong>C.</strong> The phone must constantly perform digital handshakes with new towers."],
          ["D", "<strong>D.</strong> The device operates at peak power levels to maintain the shifting connection."]
        ])
      ];
    } else {
      fields.recall = [
        radioGroup(container, "How does recombinant DNA technology differ from traditional crossbreeding in its approach to transferring desirable traits?", [
          ["A", "<strong>A.</strong> It uses radiation to force random mutations in the entire plant genome."],
          ["B", "<strong>B.</strong> It involves the precise and targeted transfer of a specific beneficial gene."],
          ["C", "<strong>C.</strong> It relies on mixing tens of thousands of genes to find a lucky combination."],
          ["D", "<strong>D.</strong> It uses broad and unpredictable crosses between two unrelated species."]
        ]),
        radioGroup(container, "Which of the following was <mark>NOT</mark> part of the genetic solution used to save the Hawaiian papaya?", [
          ["A", "<strong>A.</strong> Inserting a harmless fragment of the virus's own genetic code."],
          ["B", "<strong>B.</strong> Engineering the plant to produce a small amount of viral protein."],
          ["C", "<strong>C.</strong> Modifying the plant to thrive in alkaline soil where the virus cannot survive."],
          ["D", "<strong>D.</strong> Building up the plant's defenses similarly to an immune response from a vaccine."]
        ]),
        radioGroup(container, "Which of the following is <mark>NOT</mark> a characteristic of the Arctic apple's genetic modification?", [
          ["A", "<strong>A.</strong> It prevents the fruit from turning brown after it has been sliced or bruised."],
          ["B", "<strong>B.</strong> It aims to solve environmental and logistical problems related to food waste."],
          ["C", "<strong>C.</strong> It works by silencing the specific gene responsible for the oxidative enzyme."],
          ["D", "<strong>D.</strong> It introduces a gene from a tomato to increase the apple's lycopene levels."]
        ]),
        radioGroup(container, "Why was rice chosen as the target for the nutritional modification that yielded Golden rice?", [
          ["A", "<strong>A.</strong> Rice is the only grain that can naturally hold beta carotene."],
          ["B", "<strong>B.</strong> It is the primary diet in regions suffering from vitamin A deficiency."],
          ["C", "<strong>C.</strong> Its genome is easiest to alter with sequences targeting childhood blindness."],
          ["D", "<strong>D.</strong> Its color change was the side-effect with the least pushback from the general public."]
        ]),
        radioGroup(container, "Which popular physiological concern did one of the hosts raise regarding the prominence of GM crops in animal feed?", [
          ["A", "<strong>A.</strong> Whether livestock eating edited crops might reproduce at a much faster rate."],
          ["B", "<strong>B.</strong> Whether the pH level of cows' stomachs might drop further due to the GM diet."],
          ["C", "<strong>C.</strong> Whether modified DNA might transfer into the meat, eggs, or milk consumers eat."],
          ["D", "<strong>D.</strong> Whether cows might develop cellular receptors that make them immune to antibiotics."]
        ]),
        radioGroup(container, "Which of the following does <mark>NOT</mark> happen during the digestion of GM proteins in an animal's body?", [
          ["A", "<strong>A.</strong> Hydrochloric acid in the stomach environment breaks down complex biological structures."],
          ["B", "<strong>B.</strong> Aggressive digestive enzymes unwind the DNA and chop proteins into building blocks."],
          ["C", "<strong>C.</strong> The animal's stomach recognizes the protein as a special-purpose biological blueprint."],
          ["D", "<strong>D.</strong> The modified genetic material is completely degraded in the process of digestion."]
        ]),
        radioGroup(container, "According to the podcast, what is <mark>NOT</mark> an environmental disadvantage of traditional farmland tilling?", [
          ["A", "<strong>A.</strong> It increases the nutritional toxicity of the resulting crop harvest."],
          ["B", "<strong>B.</strong> It releases trapped carbon from the earth into the atmosphere."],
          ["C", "<strong>C.</strong> It destroys the soil structure and causes massive topsoil erosion."],
          ["D", "<strong>D.</strong> It requires the consumption of significant amounts of diesel fuel."]
        ]),
        radioGroup(container, "The crystalline protein produced by Bt corn (pronounced as 'boot' in the podcast) becomes toxic only when it dissolves in what specific type of environment?", [
          ["A", "<strong>A.</strong> A highly acidic environment like a mammal's stomach."],
          ["B", "<strong>B.</strong> A highly alkaline environment like an insect pest's gut."],
          ["C", "<strong>C.</strong> A carbon-rich environment like the soil of a tilled field."],
          ["D", "<strong>D.</strong> A tailored environment like soil treated with insecticide."]
        ]),
        radioGroup(container, "Which argument did the hosts present to explain why Bt protein is safe for beneficial insects like ladybugs and bees?", [
          ["A", "<strong>A.</strong> The protein only activates when it enters a pest's open circulatory system."],
          ["B", "<strong>B.</strong> Ladybugs and bees have highly acidic guts that neutralize the crystalline protein akin to mammals' stomachs."],
          ["C", "<strong>C.</strong> The protein is only harmful to the European cornborer caterpillar as a pest."],
          ["D", "<strong>D.</strong> Ladybugs and bees lack the specific cellular receptors necessary for the Bt protein to bind and become toxic."]
        ]),
        radioGroup(container, "What is the primary cause for the emergence of superbugs and superweeds in the environment?", [
          ["A", "<strong>A.</strong> The accidental cross-pollination of Bt corn with local wildflower species."],
          ["B", "<strong>B.</strong> The immense selective pressure from the continuous reliance on a single agricultural tool."],
          ["C", "<strong>C.</strong> The accidental transfer of Bt genes into the soil's native bacterial population."],
          ["D", "<strong>D.</strong> The lack of mass spectrometry analysis during the initial stages of GM seed development."]
        ]),
        radioGroup(container, "Which measurement is <mark>NOT</mark> the focus of a GM crop's substantial equivalence analysis (against its conventional counterpart)?", [
          ["A", "<strong>A.</strong> The levels of every known amino acid."],
          ["B", "<strong>B.</strong> The presence of naturally occurring toxins."],
          ["C", "<strong>C.</strong> The speed and durability of gene insertion."],
          ["D", "<strong>D.</strong> The full vitamin and biochemical profile."]
        ]),
        radioGroup(container, "What is <mark>NOT</mark> part of the scientific consensus from global health authorities regarding GMOs and cancer?", [
          ["A", "<strong>A.</strong> Currently marketed GM foods pose no greater risk to health than conventional foods."],
          ["B", "<strong>B.</strong> There is zero epidemiological evidence that GM crops cause cancer in humans."],
          ["C", "<strong>C.</strong> Authoritative bodies, such as the WHO, are unified in their rulings on GMO safety."],
          ["D", "<strong>D.</strong> Long-term population studies have linked GM soy to increased tumor growth."]
        ]),
        radioGroup(container, "Why did the hosts argue that the 2012 Seralini rodent study on GM corn and cancer was heavily flawed?", [
          ["A", "<strong>A.</strong> The study used a strain of rat naturally prone to tumors regardless of diet."],
          ["B", "<strong>B.</strong> The researchers cited a prior study of theirs that never actually existed."],
          ["C", "<strong>C.</strong> The experiment did not use a control group to isolate the GM diet's effects."],
          ["D", "<strong>D.</strong> The experimentation data was corrupted through a cyber panic in China."]
        ]),
        radioGroup(container, "What action did researchers take in the 1990s when testing showed that a new GM soybean contained an active allergen from a Brazil nut?", [
          ["A", "<strong>A.</strong> They labeled the GM soy as a nut product and sold it only for animal feed."],
          ["B", "<strong>B.</strong> They scrapped the product immediately before it could reach farms or markets."],
          ["C", "<strong>C.</strong> They edited the soybean once again to remove the allergenic part of the protein."],
          ["D", "<strong>D.</strong> They sought emergency approval to sell the product in developing nations."]
        ]),
        radioGroup(container, "According to the podcast, which of the following is <mark>NOT</mark> a driver of the sociological divide and lack of trust in GM foods?", [
          ["A", "<strong>A.</strong> A feeling of losing control over the food supply."],
          ["B", "<strong>B.</strong> Distrust towards the seed corporations that hold the patents."],
          ["C", "<strong>C.</strong> The low volume of data released by the World Health Organization."],
          ["D", "<strong>D.</strong> Sensational headlines on social media that create an echo chamber of fear."]
        ])
      ];
    }

    fields.recognized = radioGroup(
      container,
      "Can you recall hearing a distinctive non-verbal sound that might have occurred while the two hosts were talking?",
      YES_NO
    );
    fields.freq = radioGroup(
      container,
      "How many times can you recall hearing the sound throughout the podcast?",
      FREQ_OPTS
    );
    fields.purpose = textArea(container, "What do you think the purpose of the sound was? (1 sentence)");

    if (state.condition === "without") {
      fields.recognized.element.hidden = true;
      fields.freq.element.hidden = true;
      fields.purpose.element.hidden = true;
    }

    // Frequency and purpose are only relevant when Yes.
    fields.recognized.onChange(() => {
      const recogizedCheck = fields.recognized.getValue() === "true";
      fields.freq.setDisabled(!recogizedCheck);
      fields.purpose.setDisabled(!recogizedCheck);
      recheck();
    });

    const X = state.page3Stats.pauseClicks ?? 0;
    const Y = state.page3Stats.backtrackClicks ?? 0;
    fields.statsRationale = textArea(
      container,
      `While listening to the podcast, you paused ${X} time(s) and backtracked ${Y} time(s) — as far as you can recall, what urged you to occasionally pause/rewind the recording? (1 sentence)`
    );

    if (X === 0 && Y === 0) {
      fields.statsRationale.element.hidden = true;
    }

    fields.density = likert(container, "How dense did the podcast seem in terms of the amount of information it conveyed?", 5, DENSITY_LABELS);
    fields.pace    = likert(container, "Please rate the podcast's pace using the scale below.", 5, PACE_LABELS);

    [...fields.recall, fields.freq, fields.density, fields.pace].forEach((r) => r.onChange(recheck));
    [fields.purpose, fields.statsRationale].forEach((t) => t.onChange(recheck));
  },

  validate,

  async submit(state) {
    const yes = fields.recognized.getValue() === "true";
    const noRationale = (state.page3Stats.pauseClicks ?? 0) === 0 && (state.page3Stats.backtrackClicks ?? 0) === 0;
    const v = {
      recall: fields.recall.map((r) => r.getValue()),
      soundRecognized: state.condition === "without" ? null : yes,
      recognitionFreq: yes ? parseInt(fields.freq.getValue(), 10) : null,
      presumedPurpose: yes ? fields.purpose.getValue() : null,
      statsRationale: noRationale ? null : fields.statsRationale.getValue(),
      podcastDensity: parseInt(fields.density.getValue(), 10),
      podcastPace:    parseInt(fields.pace.getValue(), 10),
    };
    await submitStudy2Page4(state.prolificId, v);
    state.soundRecognized = yes;
  },

  teardown() {
    fields = null;
    setReadyCb = null;
  },
};
