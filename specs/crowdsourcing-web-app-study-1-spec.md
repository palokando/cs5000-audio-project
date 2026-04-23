# Study 1 Sequencing and Staging (Web App for Crowdsourcing Task on Podcast-Integrated Sound Cues)
- The task is unidirectional (workers cannot go back and revise their answers after transitioning to the next page)
- Each page in the task should have dedicated space at the top for instructions to be specified (lorem-ipsum text sufficient for now)
- Directly below this instruction-text component, each page contains questions/items that workers fill out and interact with (this specification file outlines all such items in detail)
- At the bottom-right of each page (except for Page 4), a Continue button is located, allowing workers to progress to the next page

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

### Volume Calibration
- Mandatory to listen to at least once before proceeding (the Continue button becomes accessible at 2 seconds remaining until the end of the recording)
- Besides a visual indicator of the elapsed duration, the only button exposed to participants is Pause/Play
- No form of backtracking, forward-skipping, seeking/sliding are allowed in the audio player

## Page 3: Subjective Sound Evaluation

### 3x Audio Snippets
- Mandatory to listen to all three snippets at least once before proceeding
- Besides a visual indicator of the elapsed duration, the only buttons exposed to participants are Pause/Play and Backtrack by 10 Seconds
- Forward-skipping and seeking/sliding must not be allowed in the three audio players

### Conceptual Mapping
- Question: "What does the sound remind you of &ndash; does it match any real-world object or situation? Please type in what associations you make (1-2 sentences), and feel free to replay the provided audio snippets if you need to hear the sound again."
- Answer Options: (free-text response)

### Elicited Reaction
- Question: "What was your reaction the first time you heard the sound while listening to the conversation excerpts? Please discuss the experience and your thoughts in the text box below (2-3 sentences)."
- Answer Options: (free-text response)

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

### Optional Task Feedback
- Question: "Based on your experience completing this task, please (optionally) provide any feedback or suggestions for improvement you consider relevant in the text box below."
- Answer Options: (free-text response)

## Page 4: Study Completion

### Completion Code
- For now, a SAMPLE-CODE-FINAL marker is sufficient
