// Page 4 — Recall Assessment.

import { submitStudy2Page4 } from "../../supabase.js";
import { radioGroup, textArea } from "../../form-helpers.js";

const LOREM = "Lorem ipsum. Please answer the following questions about the podcast you just listened to.";

const YES_NO = [["true", "Yes"], ["false", "No"]];
const FREQ_OPTS = [["1", "Once"], ["2", "Twice"], ["3", "Three times or more"]];
const DENSITY_OPTS = [
  ["1", "1 – Too sparse"], ["2", "2 – Sparse"], ["3", "3 – Moderate"],
  ["4", "4 – Cluttered"], ["5", "5 – Too cluttered"],
];
const PACE_OPTS = [
  ["1", "1 – Very slow"], ["2", "2 – Slow"], ["3", "3 – Moderate"],
  ["4", "4 – Fast"], ["5", "5 – Very fast"],
];

let fields = null;
let setReadyCb = null;

function recheck() { setReadyCb?.(validate().ok); }

function validate() {
  if (!fields) return { ok: false };
  if (fields.recall.some((r) => r.getValue() === null)) return { ok: false };
  if (fields.recognized.getValue() === null) return { ok: false };

  const recognizedFlag = fields.recognized.getValue() === "true";
  if (recognizedFlag && fields.freq.getValue() === null) return { ok: false };
  if (recognizedFlag && !fields.purpose.isFilled()) return { ok: false };

  if (!fields.statsRationale.isFilled()) return { ok: false };
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

    const recallDict = {
      ne: [
        radioGroup(container, "Which of the following is NOT a step in the nuclear fission chain reaction described in the podcast?", [
          ["A", "A. An unstable atom splits and releases an immense amount of heat."],
          ["B", "B. Splitting atoms shoot out two or three additional neutrons."],
          ["C", "C. Newly released neutrons strike other nearby uranium atoms."],
          ["D", "D. Two uranium atoms merge together to form a heavier nucleus."]
        ]),
        radioGroup(container, "Why is nuclear fuel considered more attractive than burning fossil fuels according to the hosts?", [
          ["A", "A. Because chemical reactions like burning are very difficult to control safely."],
          ["B", "B. Because nuclear reactions only rearrange surface-level electrons."],
          ["C", "C. Because only a small amount of fuel is needed to make a lot of power."],
          ["D", "D. Because fossil fuels require more expensive turbine technology."]
        ]),
        radioGroup(container, "Which of the following is NOT a characteristic of commercial nuclear fuel pellets?", [
          ["A", "A. They are produced from a malleable metallic ore."],
          ["B", "B. They are processed into small, hard, black units."],
          ["C", "C. They are roughly the size of a marshmallow."],
          ["D", "D. They are composed of a solid ceramic material."]
        ]),
        radioGroup(container, "How did the hosts characterize the scale of a reactor meltdown and a nuclear explosion?", [
          ["A", "A. A meltdown is more dangerous because it cannot be seen."],
          ["B", "B. A meltdown is a financial disaster but not a nuclear explosion."],
          ["C", "C. Meltdowns are only a potential risk in older 1970s reactor designs."],
          ["D", "D. An explosion is a mechanical failure, while a meltdown is chemical."]
        ]),
        radioGroup(container, "Which of the following is NOT true regarding weapons-grade uranium compared to reactor fuel?", [
          ["A", "A. Weapons-grade uranium is enriched with about 90% U235."],
          ["B", "B. Reactor fuel lacks the concentration of energy required to detonate."],
          ["C", "C. High enrichment is a physical requirement for a nuclear explosion."],
          ["D", "D. Reactor fuel and weapons-grade uranium are of comparable purity."]
        ]),
        radioGroup(container, "What is the primary safety function of control rods made from materials like silver, indium, or boron?", [
          ["A", "A. To absorb neutrons and instantly stop the nuclear chain reaction."],
          ["B", "B. To provide structural support for the heavy steel pressure vessel."],
          ["C", "C. To filter out radioactive isotopes from the steam before it hits the turbine."],
          ["D", "D. To act as a heat sink that melts before the uranium fuel itself would."]
        ]),
        radioGroup(container, "What is the primary safety function of the steel-reinforced containment building in the 'defense in depth' philosophy?", [
          ["A", "A. To serve as a weather shelter for the turbines and other sensitive equipment."],
          ["B", "B. To ensure that even if fuel melts, it remains inside a secure concrete box."],
          ["C", "C. To enclose a vacuum-sealed chamber that increases electrical output."],
          ["D", "D. To provide the insulation needed to maintain a consistent reactor temperature."]
        ]),
        radioGroup(container, "What comparison did the hosts make regarding the safety of the US nuclear industry versus fossil fuels?", [
          ["A", "A. Nuclear energy causes fewer workplace accidents than wind turbine maintenance."],
          ["B", "B. Fossil fuels are far safer because they do not produce long-term radioactive waste."],
          ["C", "C. Nuclear is safer as it avoids the respiratory issues caused by fossil fuel pollution."],
          ["D", "D. The safety of nuclear energy is currently identical to that of natural gas."]
        ]),
        radioGroup(container, "What substance is primarily emitted from the large towers of a nuclear power plant during standard operation?", [
          ["A", "A. Carbon dioxide."],
          ["B", "B. Pure water vapor."],
          ["C", "C. Nitrogen oxide."],
          ["D", "D. Sulfur dioxide."]
        ]),
        radioGroup(container, "According to the podcast, what is the key reason nuclear energy is described as the 'workhorse' of the energy grid?", [
          ["A", "A. It has a high capacity factor of over 92%, providing constant baseload power."],
          ["B", "B. It uses a simplified turbine system that requires less maintenance than solar."],
          ["C", "C. It produces more energy per square mile than all other resources in the US."],
          ["D", "D. It can be turned on and off more quickly than wind or solar power."]
        ]),
        radioGroup(container, "Which of the following statements was NOT made in the podcast regarding the volume of nuclear waste produced?", [
          ["A", "A. One person's lifetime of nuclear energy waste would fit in a soda can."],
          ["B", "B. It is small enough that the entire US industry's waste fits on one football field."],
          ["C", "C. It is significantly smaller than the volume of coal ash produced in a year."],
          ["D", "D. It would take up the full depth of two Olympic-size swimming pools."]
        ]),
        radioGroup(container, "What is the standard two-step process for managing spent fuel once it is removed from a nuclear reactor?", [
          ["A", "A. Storage in deep water pools for cooling, followed by transfer to dry casks."],
          ["B", "B. Immediate burial in salt mines, followed by surface-level encasement."],
          ["C", "C. Grinding into solid powder, followed by storage in reinforced metal drums."],
          ["D", "D. Chemical neutralization in specialized vats, followed by deep sea disposal."]
        ]),
        radioGroup(container, "What is the primary hurdle preventing the US from following Finland's lead on geological repositories?", [
          ["A", "A. The lack of scientific knowledge on how to build one."],
          ["B", "B. The lower funding compared to European nations."],
          ["C", "C. The lack of political consensus on a suitable location."],
          ["D", "D. The higher radioactivity of US-designed fuel pellets."]
        ]),
        radioGroup(container, "Which of the following is NOT a characteristic of the 'passive safety' systems in modern SMR (Small Modular Reactor) designs?", [
          ["A", "A. They rely on gravity and natural convection for cooling."],
          ["B", "B. They are designed to be 'walk-away safe' to reduce human error."],
          ["C", "C. They do not face the risk of electric pump failure if power is cut."],
          ["D", "D. They are outfitted with a dome that automatically covers the core."]
        ]),
        radioGroup(container, "Which of the following is NOT a benefit of nuclear fusion that the hosts highlighted while contrasting it with fission?", [
          ["A", "A. Nearly limitless energy production."],
          ["B", "B. Zero risk of a reactor meltdown."],
          ["C", "C. Present-day commercial availability."],
          ["D", "D. No long-term leftover radioactive waste."]
        ])
      ],
      cpr: [
        radioGroup(container, "What is the primary physical difference between ionizing and non-ionizing radiation?", [
          ["A", "A. Ionizing radiation is used by home Wi-Fi routers, while non-ionizing is used for medical X-rays."],
          ["B", "B. Ionizing radiation carries enough energy to knock electrons out of orbit, while non-ionizing does not."],
          ["C", "C. Ionizing radiation generates surface heat, while non-ionizing radiation alters matter at the atomic level."],
          ["D", "D. Ionizing radiation is low frequency and low energy, while non-ionizing radiation is high frequency."]
        ]),
        radioGroup(container, "As stated in the podcast, how does radio frequency (RF) energy cause the biological effect of tissue heating?", [
          ["A", "A. It physically breaks chemical bonds, which releases thermal energy into the bloodstream."],
          ["B", "B. It triggers a chemical reaction between the skin's surface and the phone's metallic casing."],
          ["C", "C. It causes nearby water molecules to vibrate, which creates friction that in turn generates heat."],
          ["D", "D. It interacts with the immune system, which reacts to the waves by raising internal temperature."]
        ]),
        radioGroup(container, "What physical constraint of RF waves did the hosts highlight regarding immune system interaction?", [
          ["A", "A. The waves are blocked by the outermost layer of skin."],
          ["B", "B. RF energy is absorbed by bone marrow before hitting T cells."],
          ["C", "C. 5G wavelengths are too short to reach and alter immune cells."],
          ["D", "D. The properties of the waves inherently restrict them to vibration."]
        ]),
        radioGroup(container, "Which of the following was NOT a purpose of the $30 million National Toxicology Program (NTP) rodent study?", [
          ["A", "A. To test the biological boundaries of long-term, low-level RF exposure."],
          ["B", "B. To see if non-thermal biological effects were theoretically possible."],
          ["C", "C. To simulate the daily usage levels of current cellular technology."],
          ["D", "D. To move the scientific debate beyond just immediate DNA damage."]
        ]),
        radioGroup(container, "Which of the following was NOT a characteristic of the rodent exposure in the NTP study?", [
          ["A", "A. It lasted for up to 9 hours every day for 2 years."],
          ["B", "B. It utilized intervals of 10 minutes on and 10 minutes off."],
          ["C", "C. The rats and mice were kept in glass cages in an open laboratory."],
          ["D", "D. The rodents received whole-body exposure to 2G and 3G radiation."]
        ]),
        radioGroup(container, "What crucial detail did the hosts point out when discussing the significance of the NTP study's findings?", [
          ["A", "A. The rodents were exposed to levels four times the human limit."],
          ["B", "B. The tumors were found to be benign rather than malignant."],
          ["C", "C. The animals that were affected only developed cancer of the brain."],
          ["D", "D. The RF exposure equally impacted rats and mice of either sex."]
        ]),
        radioGroup(container, "Which of the following is NOT a reason given for why RF energy cannot replicate inside the body?", [
          ["A", "A. The energy simply dissipates as heat as it travels through tissue."],
          ["B", "B. Human cells lack the biological machinery required to emit RF waves."],
          ["C", "C. The energy does not behave like a biological pathogen, such as a virus."],
          ["D", "D. The human body's high salt content ensures external waves are reflected."]
        ]),
        radioGroup(container, "Why does a 10-year-old child absorb up to 153% more radiation than an adult when holding a phone to their head?", [
          ["A", "A. Their brain tissue has a higher water and ion content, making it more conductive."],
          ["B", "B. Their ears are larger and thus serve as more efficient collectors for radio frequency energy."],
          ["C", "C. Their more abundant fatty tissue acts as an insulator, trapping the energy beneath the skin."],
          ["D", "D. Their higher metabolism accelerates the rate at which incoming waves are absorbed."]
        ]),
        radioGroup(container, "Which of the following is NOT a criticism leveled against current FCC safety guidelines for cellular technology?", [
          ["A", "A. They represent a world that no longer exists based on the infancy of the modern telecom era."],
          ["B", "B. They rely on tools outright incapable of measuring the molecular vibration that causes heating."],
          ["C", "C. They fail to account for the unique anatomical vulnerabilities of children and pregnant women."],
          ["D", "D. They were derived using a model of a fully-grown elite soldier from more than three decades ago."]
        ]),
        radioGroup(container, "According to environmental agencies like the Audubon Society, what is the observed impact of cellular networks on birds and bees?", [
          ["A", "A. 5G frequencies are the primary cause of migratory bird confusion."],
          ["B", "B. Waves from 5G networks do not disrupt the biology of birds or bees."],
          ["C", "C. Modern cell towers cause significant declines in bee population fertility."],
          ["D", "D. The denser 5G towers attract more predatory birds to residential areas."]
        ]),
        radioGroup(container, "Regarding the discussion of the inverse square law, which of the following is NOT true?", [
          ["A", "A. Energy intensity drops off significantly the further a wave travels from its source."],
          ["B", "B. Doubling the distance from an emitter results in receiving only a quarter of the radiation."],
          ["C", "C. Moving the phone next to the head minimizes the measured Specific Absorption Rate."],
          ["D", "D. Distance is the best available scientifically-backed defense against RF exposure."]
        ]),
        radioGroup(container, "Which of the following is NOT a prevalent distance-based safety guideline mentioned in the podcast?", [
          ["A", "A. Carry the device in a backpack or purse instead of against the body."],
          ["B", "B. Leave the phone off the mattress and across the room while sleeping."],
          ["C", "C. Keep the phone at least five inches away from the head even with Airplane Mode on."],
          ["D", "D. Use the speaker-phone function or a wired headset during a call whenever possible."]
        ]),
        radioGroup(container, "As stated in the podcast, what mechanism triggered by weak signals (1-2 bars) makes them problematic for radiation exposure?", [
          ["A", "A. The phone amplifier ramps up its power output to the allowed maximum to reach the tower."],
          ["B", "B. Ambient signal noise at the user's location forces the phone to use more battery voltage."],
          ["C", "C. The cell tower itself sends a high-voltage pulse to the device to force a one-way digital pairing."],
          ["D", "D. The phone antenna extends its channel bandwidth to capture incoming waves that overlap."]
        ]),
        radioGroup(container, "Which of the following is NOT a reason cited for the failure of radiation shield and sticker products?", [
          ["A", "A. The radiation shield tricks the device into assuming it is in a bad coverage area."],
          ["B", "B. Internal sensors detect a drop in the signal-to-noise ratio due to the blockage."],
          ["C", "C. The phone is trapped in a maximal-power feedback loop, increasing RF exposure."],
          ["D", "D. Stickers interfere with GPS sensors, which start emitting high-frequency pings."]
        ]),
        radioGroup(container, "Which of the following was NOT considered by the hosts as a cause of power spikes during phone usage in a moving vehicle?", [
          ["A", "A. The car's metal frame acts as a Faraday cage, blocking the outgoing signal."],
          ["B", "B. A Bluetooth connection to the car itself creates interference, draining the signal."],
          ["C", "C. The phone must constantly perform digital handshakes with new towers."],
          ["D", "D. The device operates at peak power levels to maintain the shifting connection."]
        ])
      ],
      gmo: [
        radioGroup(container, "How does recombinant DNA technology differ from traditional crossbreeding in its approach to transferring desirable traits?", [
          ["A", "A. It uses radiation to force random mutations in the entire plant genome."],
          ["B", "B. It involves the precise and targeted transfer of a specific beneficial gene."],
          ["C", "C. It relies on mixing tens of thousands of genes to find a lucky combination."],
          ["D", "D. It uses broad and unpredictable crosses between two unrelated species."]
        ]),
        radioGroup(container, "Which of the following was NOT part of the genetic solution used to save the Hawaiian papaya?", [
          ["A", "A. Inserting a harmless fragment of the virus's own genetic code."],
          ["B", "B. Engineering the plant to produce a small amount of viral protein."],
          ["C", "C. Modifying the plant to thrive in alkaline soil where the virus cannot survive."],
          ["D", "D. Building up the plant's defenses similarly to an immune response from a vaccine."]
        ]),
        radioGroup(container, "Which of the following is NOT a characteristic of the Arctic apple's genetic modification?", [
          ["A", "A. It prevents the fruit from turning brown after it has been sliced or bruised."],
          ["B", "B. It aims to solve environmental and logistical problems related to food waste."],
          ["C", "C. It works by silencing the specific gene responsible for the oxidative enzyme."],
          ["D", "D. It introduces a gene from a tomato to increase the apple's lycopene levels."]
        ]),
        radioGroup(container, "Why was rice chosen as the target for the nutritional modification that yielded Golden rice?", [
          ["A", "A. Rice is the only grain that can naturally hold beta carotene."],
          ["B", "B. It is the primary diet in regions suffering from vitamin A deficiency."],
          ["C", "C. Its genome is easiest to alter with sequences targeting childhood blindness."],
          ["D", "D. Its color change was the side-effect with the least pushback from the general public."]
        ]),
        radioGroup(container, "Which popular physiological concern did one of the hosts raise regarding the prominence of GM crops in animal feed?", [
          ["A", "A. Whether livestock eating edited crops might reproduce at a much faster rate."],
          ["B", "B. Whether the pH level of cows' stomachs might drop further due to the GM diet."],
          ["C", "C. Whether modified DNA might transfer into the meat, eggs, or milk consumers eat."],
          ["D", "D. Whether cows might develop cellular receptors that make them immune to antibiotics."]
        ]),
        radioGroup(container, "Which of the following does NOT happen during the digestion of GM proteins in an animal's body?", [
          ["A", "A. Hydrochloric acid in the stomach environment breaks down complex biological structures."],
          ["B", "B. Aggressive digestive enzymes unwind the DNA and chop proteins into building blocks."],
          ["C", "C. The animal's stomach recognizes the protein as a special-purpose biological blueprint."],
          ["D", "D. The modified genetic material is completely degraded in the process of digestion."]
        ]),
        radioGroup(container, "According to the podcast, what is NOT an environmental disadvantage of traditional farmland tilling?", [
          ["A", "A. It increases the nutritional toxicity of the resulting crop harvest."],
          ["B", "B. It releases trapped carbon from the earth into the atmosphere."],
          ["C", "C. It destroys the soil structure and causes massive topsoil erosion."],
          ["D", "D. It requires the consumption of significant amounts of diesel fuel."]
        ]),
        radioGroup(container, "The crystalline protein produced by Bt corn (pronounced as 'boot' in the podcast) becomes toxic only when it dissolves in what specific type of environment?", [
          ["A", "A. A highly acidic environment like a mammal's stomach."],
          ["B", "B. A highly alkaline environment like an insect pest's gut."],
          ["C", "C. A carbon-rich environment like the soil of a tilled field."],
          ["D", "D. A tailored environment like soil treated with insecticide."]
        ]),
        radioGroup(container, "Which argument did the hosts present to explain why Bt protein is safe for beneficial insects like ladybugs and bees?", [
          ["A", "A. The protein only activates when it enters a pest's open circulatory system."],
          ["B", "B. Ladybugs and bees have highly acidic guts that neutralize the crystalline protein akin to mammals' stomachs."],
          ["C", "C. The protein is only harmful to the European cornborer caterpillar as a pest."],
          ["D", "D. Ladybugs and bees lack the specific cellular receptors necessary for the Bt protein to bind and become toxic."]
        ]),
        radioGroup(container, "What is the primary cause for the emergence of superbugs and superweeds in the environment?", [
          ["A", "A. The accidental cross-pollination of Bt corn with local wildflower species."],
          ["B", "B. The immense selective pressure from the continuous reliance on a single agricultural tool."],
          ["C", "C. The accidental transfer of Bt genes into the soil's native bacterial population."],
          ["D", "D. The lack of mass spectrometry analysis during the initial stages of GM seed development."]
        ]),
        radioGroup(container, "Which measurement is NOT the focus of a GM crop's substantial equivalence analysis (against its conventional counterpart)?", [
          ["A", "A. The levels of every known amino acid."],
          ["B", "B. The presence of naturally occurring toxins."],
          ["C", "C. The speed and durability of gene insertion."],
          ["D", "D. The full vitamin and biochemical profile."]
        ]),
        radioGroup(container, "What is NOT part of the scientific consensus from global health authorities regarding GMOs and cancer?", [
          ["A", "A. Currently marketed GM foods pose no greater risk to health than conventional foods."],
          ["B", "B. There is zero epidemiological evidence that GM crops cause cancer in humans."],
          ["C", "C. Authoritative bodies, such as the WHO, are unified in their rulings on GMO safety."],
          ["D", "D. Long-term population studies have linked GM soy to increased tumor growth."]
        ]),
        radioGroup(container, "Why did the hosts argue that the 2012 Seralini rodent study on GM corn and cancer was heavily flawed?", [
          ["A", "A. The study used a strain of rat naturally prone to tumors regardless of diet."],
          ["B", "B. The researchers cited a prior study of theirs that never actually existed."],
          ["C", "C. The experiment did not use a control group to isolate the GM diet's effects."],
          ["D", "D. The experimentation data was corrupted through a cyber panic in China."]
        ]),
        radioGroup(container, "What action did researchers take in the 1990s when testing showed that a new GM soybean contained an active allergen from a Brazil nut?", [
          ["A", "A. They labeled the GM soy as a nut product and sold it only for animal feed."],
          ["B", "B. They scrapped the product immediately before it could reach farms or markets."],
          ["C", "C. They edited the soybean once again to remove the allergenic part of the protein."],
          ["D", "D. They sought emergency approval to sell the product in developing nations."]
        ]),
        radioGroup(container, "According to the podcast, which of the following is NOT a driver of the sociological divide and lack of trust in GM foods?", [
          ["A", "A. A feeling of losing control over the food supply."],
          ["B", "B. Distrust towards the seed corporations that hold the patents."],
          ["C", "C. The low volume of data released by the World Health Organization."],
          ["D", "D. Sensational headlines on social media that create an echo chamber of fear."]
        ])
      ]
    };
    fields.recall = recallDict[state.podcastTopic];

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
      `While listening to the podcast, you paused ${X} time(s) and backtracked ${Y} time(s) – as far as you can recall, what urged you to occasionally pause/rewind the recording? (1 sentence)`
    );

    fields.density = radioGroup(container, "How dense did the podcast seem in terms of the amount of information it conveyed?", DENSITY_OPTS);
    fields.pace    = radioGroup(container, "Please rate the podcast's pace using the scale below.", PACE_OPTS);

    [...fields.recall, fields.freq, fields.density, fields.pace].forEach((r) => r.onChange(recheck));
    [fields.purpose, fields.statsRationale].forEach((t) => t.onChange(recheck));
  },

  validate,

  async submit(state) {
    const yes = fields.recognized.getValue() === "true";
    const v = {
      recall: fields.recall.map((r) => r.getValue()),
      soundRecognized: yes,
      recognitionFreq: yes ? parseInt(fields.freq.getValue(), 10) : null,
      presumedPurpose: yes ? fields.purpose.getValue() : null,
      statsRationale: fields.statsRationale.getValue(),
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
