# Requirements Document

## Introduction

Memento Mori is a gothic-themed Pomodoro timer application that creates an unsettling, visceral experience to maintain user focus. The application features a 3D candle melting on a skull, with progressive visual and audio corruption effects that penalize distraction. Built with React Three Fiber, the timer uses shader-based animations and atmospheric audio to create a high-stakes productivity environment.

## Glossary

- **Timer_Application**: The Memento Mori Pomodoro timer web application
- **Focus_Session**: A 25-minute work period tracked by the timer
- **Rest_Session**: A 5-minute break period tracked by the timer
- **Corruption_Level**: A numeric value (0-100) tracking user distraction events
- **Vanitas_Scene**: The 3D rendered scene containing the candle and skull models
- **Glitch_Effect**: Visual distortion applied to the interface using CSS clip-path and RGB split
- **Zalgo_Text**: Distorted text rendering with diacritical marks creating an unsettling appearance
- **Vignette_Filter**: A darkening effect applied to screen edges that narrows the visible area
- **Candle_Mesh**: The 3D geometry representing the wax candle
- **Flame_Intensity**: The brightness and size of the candle flame visual
- **Audio_Manager**: The system managing brown noise, Shepard tone, and interaction sounds
- **Shepard_Tone**: An auditory illusion of continuously rising pitch
- **Screen_Reader**: Assistive technology that reads interface content aloud

## Requirements

### Requirement 1: Timer Session Management

**User Story:** As a user, I want to start and manage focus and rest sessions, so that I can structure my work using the Pomodoro technique.

#### Acceptance Criteria

1. THE Timer_Application SHALL provide a 25-minute Focus_Session duration
2. THE Timer_Application SHALL provide a 5-minute Rest_Session duration
3. WHEN the user activates the start control, THE Timer_Application SHALL begin counting down from the current session duration
4. WHEN the user activates the pause control, THE Timer_Application SHALL halt the countdown and retain the remaining time
5. WHEN the user activates the reset control, THE Timer_Application SHALL restore the countdown to the initial session duration

### Requirement 2: 3D Candle Visualization

**User Story:** As a user, I want to see a candle melting on a skull as time passes, so that I have a visceral representation of time consumption.

#### Acceptance Criteria

1. THE Timer_Application SHALL render a Vanitas_Scene containing a candle model positioned on a skull model
2. WHILE the timer counts down, THE Timer_Application SHALL apply vertex displacement to the Candle_Mesh proportional to elapsed time
3. WHEN the remaining time reaches zero, THE Candle_Mesh SHALL display maximum downward displacement creating a pooled wax appearance
4. THE Timer_Application SHALL animate Flame_Intensity using Perlin noise to create flickering behavior
5. THE Timer_Application SHALL maintain rendering performance at 60 frames per second

### Requirement 3: Corruption System

**User Story:** As a user, I want the interface to become increasingly corrupted when I lose focus, so that I am discouraged from distraction.

#### Acceptance Criteria

1. THE Timer_Application SHALL initialize Corruption_Level to zero at session start
2. WHEN the user pauses the timer, THE Timer_Application SHALL increment Corruption_Level by a defined amount
3. WHEN the browser window loses focus, THE Timer_Application SHALL increment Corruption_Level by a defined amount
4. WHEN Corruption_Level exceeds 50, THE Timer_Application SHALL render timer digits as Zalgo_Text
5. WHEN Corruption_Level exceeds 80, THE Timer_Application SHALL apply a Vignette_Filter that progressively narrows the visible screen area

### Requirement 4: Glitch Visual Effects

**User Story:** As a user, I want the interface to glitch when I switch away from the application, so that distraction is visually penalized.

#### Acceptance Criteria

1. WHEN the browser window loses focus, THE Timer_Application SHALL trigger the Glitch_Effect
2. WHEN the document becomes hidden, THE Timer_Application SHALL trigger the Glitch_Effect
3. THE Glitch_Effect SHALL apply CSS clip-path distortion to interface elements
4. THE Glitch_Effect SHALL apply RGB channel splitting to create chromatic aberration
5. WHEN the browser window regains focus, THE Timer_Application SHALL remove the Glitch_Effect within 200 milliseconds

### Requirement 5: Atmospheric Audio

**User Story:** As a user, I want atmospheric audio that builds tension as time runs out, so that I maintain awareness of the approaching deadline.

#### Acceptance Criteria

1. THE Audio_Manager SHALL play brown noise at -20dB volume as a continuous base layer
2. WHEN the remaining time reaches 60 seconds, THE Audio_Manager SHALL begin playing a Shepard_Tone
3. WHILE the remaining time is less than 60 seconds, THE Audio_Manager SHALL increase Shepard_Tone volume proportional to urgency
4. WHEN the user activates any control, THE Audio_Manager SHALL play a mechanical thud sound effect
5. THE Audio_Manager SHALL execute all audio processing on a separate thread to prevent blocking the main thread

### Requirement 6: Gothic Visual Design

**User Story:** As a user, I want a dark, gothic aesthetic with unsettling animations, so that the timer creates an immersive atmospheric experience.

#### Acceptance Criteria

1. THE Timer_Application SHALL use color #050505 for the background
2. THE Timer_Application SHALL use color #e1e1e1 for primary text and interface elements
3. THE Timer_Application SHALL use color #8a0b0b for danger state indicators
4. THE Timer_Application SHALL use color #d4af37 for the candle flame rendering
5. THE Timer_Application SHALL apply jittery or physically heavy animation timing instead of smooth easing functions

### Requirement 7: Accessibility Support

**User Story:** As a user with visual impairments, I want the timer to remain accessible via screen readers, so that I can use the application regardless of visual effects.

#### Acceptance Criteria

1. THE Timer_Application SHALL provide ARIA labels for all interactive controls
2. THE Timer_Application SHALL maintain a hidden text element containing the unmodified timer value
3. THE Screen_Reader SHALL access the unmodified timer value regardless of Zalgo_Text rendering
4. THE Timer_Application SHALL provide ARIA live region announcements when the timer state changes
5. THE Timer_Application SHALL ensure all controls are keyboard navigable

### Requirement 8: Performance Constraints

**User Story:** As a user, I want the application to remain responsive during all visual effects, so that the timer functions reliably.

#### Acceptance Criteria

1. THE Timer_Application SHALL maintain 60 frames per second during 3D rendering
2. THE Timer_Application SHALL execute shader calculations on the GPU
3. THE Timer_Application SHALL prevent audio processing from blocking the main JavaScript thread
4. WHEN the frame rate drops below 60 frames per second, THE Timer_Application SHALL reduce shader complexity
5. THE Timer_Application SHALL complete all user input responses within 100 milliseconds
