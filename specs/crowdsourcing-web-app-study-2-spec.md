# Study 2 Sequencing and Staging (Web App for Crowdsourcing Task on Podcast-Integrated Sound Cues)
- The task is unidirectional (workers cannot go back and revise their answers after transitioning to the next page)
- Each page in the task should have dedicated space at the top for instructions to be specified (lorem-ipsum text sufficient for now)
- Directly below this instruction-text component, each page contains questions/items that workers fill out and interact with (this specification file outlines all such items in detail)
- At the bottom-right of each page, a Continue button is located, allowing workers to progress to the next page
- At the bottom-left of each page (except for Introduction and Post-Study Debrief), a Quit Study button is located, redirecting workers to the extra page where they can exit the task prematurely

## Page 1: Introduction
- No additional page contents besides instruction-text and Continue button

## Page 2: Participant Profiling

### Age
- Question: "How old are you?"
- Answer Options: 18-24 years old, 25-34 years old, 35-44 years old, 45-54 years old, 55-64 years old, 65+ years old, Prefer not to say

### Gender
- Question: "What is your gender?"
- Answer Options: Male, Female, Non-binary, Prefer not to say

### Native Tongue
- Question: "What is your native language?"
- Answer Options: (one input-box expecting a string of at most 25 characters), Prefer not to say

### Listening Frequency
- Question: "How often do you listen to podcasts?"
- Answer Options: Daily, Weekly, Monthly, Less than monthly

### 3x Listening Amount
- Question 1: "How many years have you been listening to podcasts?"
- Answer Options: (one input-box expecting an integer) years
- Question 2: "How many hours per week do you spend listening to podcasts?"
- Answer Options: (one input-box expecting an integer) hours per week
- Question 3: "How many different podcasts do you listen to in a typical month?"
- Answer Options: (one input-box expecting an integer) podcasts per month

### Topic Familiarity
- Question: "How would you describe your current knowledge on the topic?"
- Answer Options: Non-existent, Very poor, Below average, Average, Above average, Very good, Excellent (7-point Likert scale)

### Prior Stance
- Question: "What is your stance on the following claim? 'SAMPLE-CLAIM'"
- Answer Options: Strongly disagree, Disagree, Somewhat disagree, Neither agree nor disagree, Somewhat agree, Agree, Strongly agree (7-point Likert scale)

### Attitude Importance
- Question: "How important is your attitude on this topic to you?"
- Answer Options: Not important at all, Largely unimportant, Somewhat unimportant, Neutral, Moderately important, Very important, Extremely important (7-point Likert scale)

### Attitude Elaboration
- Question: "To what extent do you agree with the following statement? 'Your attitude on this topic is a result of careful thinking about relevant information.'"
- Answer Options: Strongly disagree, Disagree, Somewhat disagree, Neither agree nor disagree, Somewhat agree, Agree, Strongly agree (7-point Likert scale)

### Attitude Moralization
- Question: "To what extent do you agree with the following statement? 'Your attitude on this topic is connected to your core moral values.'"
- Answer Options: Strongly disagree, Disagree, Somewhat disagree, Neither agree nor disagree, Somewhat agree, Agree, Strongly agree (7-point Likert scale)

### 6x Need for Cognition
- Question: "SAMPLE-QUESTION-OUT-OF-6" (a marker for now)
- Answer Options: Extremely uncharacteristic of me, Somewhat uncharacteristic of me, Neither, Somewhat characteristic of me, Extremely characteristic of me (5-point Likert scale)

### 12x Intellectual Humility
- Question: "SAMPLE-QUESTION-OUT-OF-12" (a marker for now)
- Answer Options: Strongly disagree, Disagree, Mostly disagree, Slightly disagree, Neither agree nor disagree, Slightly agree, Mostly agree, Agree, Strongly agree (9-point Likert scale)

### Volume Calibration
- Mandatory to listen to at least once before proceeding (the Continue button becomes accessible at 2 seconds remaining until the end of the recording)
- Besides a visual indicator of the elapsed duration, the only button exposed to participants is Pause/Play
- No form of backtracking, forward-skipping, seeking/sliding are allowed in the audio player

## Page 3: Podcast Listening

### Podcast Player
- Mandatory to listen to at least once before proceeding (the Continue button becomes accessible at 2 seconds remaining until the end of the recording)
- Besides a visual indicator of the elapsed duration, the only buttons exposed to participants are Pause/Play and Backtrack by 10 Seconds
- Forward-skipping and seeking/sliding must not be allowed in the audio player
- The following need to be tracked while audio is playing: tab visibility, a worker's latest reached timestamp, total playtime, number of Pause/Play button clicks, number of Backtrack button clicks

## Page 4: Recall Assessment

### 15x Recall Multiple-Choice Questions
- Question: "SAMPLE-QUESTION-OUT-OF-15" (a marker for now)
- Answer Options: A. ANSWER-A, B. ANSWER-B, C. ANSWER-C, D. ANSWER-D (markers for the 4 multiple-choice options)

### Sound Recognition (Binary)
- Question: "Can you recall hearing a distinctive non-verbal sound that might have occurred while the two hosts were talking?"
- Answer Options: Yes, No

### Sound Recognition (Frequency)
- Question: "How many times can you recall hearing the sound throughout the podcast?"
- Answer Options: Once, Twice, Three times or more

### Presumed Sound Purpose
- Question: "What do you think the purpose of the sound was? (1 sentence)"
- Answer Options: (free-text response)

### Rationale for Pausing/Backtracking Statistics
- Question: "While listening to the podcast, you paused X times and backtracked Y times &ndash; as far as you can recall, what urged you to occasionally pause/rewind the recording? (1 sentence)" (X and Y as markers for actual count data)
- Answer Options: (free-text response)

### Perceived Podcast Density
- Question: "How dense did the podcast seem in terms of the amount of information it conveyed?"
- Answer Options: Too sparse, Sparse, Moderate, Cluttered, Too cluttered (5-point Likert scale)

### Perceived Podcast Pace
- Question: "Please rate the podcast's pace using the scale below."
- Answer Options: Very slow, Slow, Moderate, Fast, Very fast (5-point Likert scale)

## Page 5: Misinformation Recognition

### 2x Audio Snippets
- Mandatory to listen to both snippets at least once before proceeding
- Each snippet has a binary judgment and a free-text rationale associated with it
- Besides a visual indicator of the elapsed duration, the only buttons exposed to participants are Pause/Play and Backtrack by 10 Seconds
- Forward-skipping and seeking/sliding must not be allowed in the two audio players

### 2x Information-Accuracy Judgment (Binary)
- Question: "Is the information conveyed in the snippet factually accurate?"
- Answer Options: Yes, No

### 2x Rationale for Judgment
- Question: "What makes you think so? (1-2 sentences)"
- Answer Options: (free-text response)

## Page 6: Subjective Warning Evaluation

### 3x Audio Snippets
- These three snippets are not mandatory to interact with
- Pausing, backtracking, forward-skipping, and seeking/sliding are all allowed in the three audio players

### Conceptual Mapping
- Question: "What does the sound remind you of &ndash; does it match any real-world object or situation? Please type in what associations you make (1-2 sentences), and feel free to replay the provided audio snippets if you need to hear the sound again."
- Answer Options: (free-text response)

### Elicited Reaction
- Question: "What was your reaction the first time you heard the sound while listening to the podcast? Please discuss the experience and your thoughts in the text box below (2-3 sentences)."
- Answer Options: (free-text response)

### Warning Acclimatization (Scale + Rationale)
- Question: "Did your initial perceptions of the sound change as it re-occurred throughout the podcast? Please select an option and then elaborate in the text box below (1-2 sentences)."
- Answer Options: Became less pronounced, Remained stable throughout, Became more pronounced + (free-text response)

### 4x Likert Matrix Sound Evaluations
- Common Question Start: "Using the respective scale below, please indicate the extent to which:"
- Question Continuation 1 (Recognizability): "The real-world entity you associate with the sound was easy to recognize upon hearing it;"
- Answer Options: Not at all, Slightly, Moderately, Very, Extremely (5-point Likert scale)
- Question Continuation 2 (Distraction): "You found the sound distracting while listening;"
- Answer Options: Not at all, Slightly, Moderately, Very, Extremely (5-point Likert scale)
- Question Continuation 3 (Abruptness): "The sound seemed out of place whenever it occurred;"
- Answer Options: Not at all, Slightly, Moderately, Very, Extremely (5-point Likert scale)
- Question Continuation 4 (Interruption): "The sound interrupted your overall listening experience."
- Answer Options: Not at all, Slightly, Moderately, Very, Extremely (5-point Likert scale)

## Page 7: Post-Study Debrief

### Restated Informed Consent
- Question: "I acknowledge that I have read and understood the information presented above, am aware of the true research objectives, and approve the use and analysis of my submission."
- Answer Options: (one accompanying checkbox)

### Induced Warning-Aware Immediate Reaction
- Question: "Now knowing the sound's meaning, how would you react if you heard it while listening to one of your regular podcasts? (1-2 sentences)"
- Answer Options: (free-text response)

### Induced Warning-Aware Downstream Behavior
- Question: "What would your follow-up actions be, if any, in response to hearing the misinformation warning? (1-2 sentences)"
- Answer Options: (free-text response)

## Page 8: Study Completion

### Optional Task Feedback
- Question: "Based on your experience completing this task, please (optionally) provide any feedback or suggestions for improvement you consider relevant in the text box below."
- Answer Options: (free-text response)

### Completion Code
- For now, a SAMPLE-CODE-FINAL marker is sufficient

## Extra Page: Premature Study Exit

### Completion Code
- For now, a SAMPLE-CODE-PREMATURE marker is sufficient
