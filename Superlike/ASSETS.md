# Superlike – Asset List, Happy Path & Game Review

---

## 🧑‍🤝‍🧑 KEY PEOPLE (for AI prompts & photo selection)

| Person | Role in story | Visual notes |
|--------|---------------|-------------|
| **Tom** | The match — Vicky's husband | Age ~24 at time of story. On first date: **white and blue horizontally striped t-shirt.** Generally: clean-cut, slim, friendly face. |
| **Vicky** | The player / narrator | Vicky's perspective throughout. |
| **Anni (Annelie)** | Vicky's best friend — was **pro Tom from the very beginning**. Supportive, enthusiastic, a quiet but constant voice of "just go for it". Consider adding her as a narrator hint or easter egg ("Anni hätte das gut gefunden 😄"). | – |
| **Lukas** | The ambiguous figure in the horror branch — always a blue rain jacket, face never shown. | Only appears as a silhouette / seen from behind. |

---

## 📸 REQUIRED MEDIA FILES

All files go in: `PythonTerminalGame/Superlike/static/`

Replace the SVG placeholders in `config.js` by changing the `photos` object values
to relative paths like `'static/tom-profile.jpg'`.

### Profile Photos

| Filename | Description | Used in |
|----------|-------------|---------|
| `tom-profile.jpg` | Tom's Tinder profile photo (portrait, ideally w/ suspenders/bow-tie look, age ~24) | Profile card, chat avatar |
| `vicky-profile.jpg` | Vicky's Tinder profile photo (portrait) | Optional: mirror/camera fallback |
| `kevin-profile.jpg` | **Decoy #1** – Bro with AMG/Rolex/gym selfie energy, age ~29 | Decoy swipe (1/3) |
| `maximilian-profile.jpg` | **Decoy #2** – Banker in suit (always the same suit), age ~31 | Decoy swipe (2/3) |
| `jens-profile.jpg` | **Decoy #3** – Artistic/spiritual musician, age ~27 | Decoy swipe (3/3) |
| `lukas-silhouette.jpg` | Shadowy figure in blue rain jacket, face obscured | Horror branch |

> **The decoy cards are shown BEFORE Tom.** Vicky must nope through Kevin/Maximilian/Jens
> to reach her actual match. Liking a decoy → "Der falsche Prinz" ending.

### Scene Photos (shown as background or inline)

| Filename | Description | Used in |
|----------|-------------|---------|
| `canal-friedrichstrasse.jpg` | The canal by Friedrichstraße (Austrian brunch restaurant view) | date_brunch narration |
| `burrito-misha.jpg` | Burrito / Friedrichstraße station area | walking_to_spree narration |
| `spree-museumsinsel.jpg` | Spree river at Museumsinsel / park | at_spree choice |
| `ubahn-goodbye.jpg` | U-Bahn station entrance (night, romantic light) | goodbye choice |
| `sbahn-night.jpg` | S-Bahn interior at night (reflection in window) | after_kiss / camera scene |
| `hoehle-der-loewen.jpg` | TV screen "Die Höhle der Löwen" or cozy couch setup | messages_montage |
| `karate-event.jpg` | Karate event / black belt ceremony | first_meeting_parents |
| `package-door.jpg` | A package at a door / Hermes delivery | package_arrives |
| `three-letters.jpg` | Three letters + rose + Martini Bianco bottle | letters choice |
| `indian-restaurant.jpg` | Indian restaurant (cozy, evening) | reunion choice |
| `mount-fuji.jpg` | Mount Fuji / engagement photo | true ending |
| `wedding-standesamt.jpg` | Wedding photo (Standesamt Treptow, 19.10.2024) | true ending |
| `wedding-party.jpg` | Big wedding party (06.06.2025) | true ending |
| `couple-photo.jpg` | Nice couple photo (any era) | match screen |

### Horror Branch (optional – enhances atmosphere)

| Filename | Description | Used in |
|----------|-------------|---------|
| `horror-mirror.jpg` | Creepy mirror / distorted reflection | horror_her ending |
| `horror-roses.jpg` | Overgrown dark roses / thorns | horror_him ending |
| `horror-blue-jacket.jpg` | Man in blue rain jacket (from behind, blurry) | horror_serial ending |

### Matrix Branch (optional)

| Filename | Description | Used in |
|----------|-------------|---------|
| `matrix-code.gif` | Green matrix rain / falling code (animated GIF or static) | matrix_enter background |
| `matrix-architect.jpg` | White room with monitors (Matrix Architect style) | matrix_arch ending |

### Clips / GIFs (optional, add if you have them)

| Filename | Description | Used in |
|----------|-------------|---------|
| `confetti.gif` | Confetti celebration | true ending (backup if canvas fails) |
| `tinder-swipe.gif` | Swipe animation | profile card |
| `typing-dots.gif` | Chat typing indicator | chat scenes |

---

## 🤖 AI IMAGE GENERATION PROMPTS

Use these prompts in **Midjourney**, **DALL·E**, **Firefly**, or similar.
Output target: `~340×280px` for profile cards, `~340×180px` for scene banners.
Save as JPG, <200KB.

---

### `tom-profile.jpg` — Tom's Tinder Profile

```
Photorealistic portrait of a young German man, age 24, slim build, friendly open
expression, clean-cut look, warm brown eyes. He is wearing a **white and blue
horizontally striped t-shirt** — the outfit he wore on their first date. Casual but
put-together. Soft, warm natural light. Slightly blurred Berlin urban background.
Square portrait crop, Tinder-style profile photo. No text.
```

---

### `date-first-meeting.jpg` — The First Date (Brunch at Friedrichstraße)

```
Photorealistic scene: a young couple walking together through a bright, modern Berlin
railway station (Friedrichstraße S-Bahn / Edeka area). The man (age ~24, slim, wearing a
white and blue horizontally striped t-shirt) is casually walking next to a young woman
(age ~25). Relaxed, slightly nervous first-date energy. Natural daylight through glass
roof. Warm colour grade. No text.
```

---

### `spree-museumsinsel.jpg` — Spree Riverside Walk

```
Wide photorealistic scene: a young couple walking along the bank of the Spree river in
Berlin, near Museumsinsel. Late afternoon golden hour light. The woman has her arm linked
through the man's arm. Berlin Cathedral (Berliner Dom) softly visible in background,
out of focus. Warm, romantic, intimate atmosphere. No text.
```

---

### `ubahn-goodbye.jpg` — Goodbye at the U-Bahn

```
Photorealistic: a young couple standing very close together at a Berlin U-Bahn entrance
at night, warm street lights, slight rain on the ground. The man (age ~24, white and blue
striped t-shirt partially visible under a jacket) leans in for a first kiss. The moment
just before or just as their lips meet. Cinematic, romantic, shallow depth of field. No text.
```

---

### `three-letters.jpg` — The Three Letters

```
Photorealistic still life, top-down view on a wooden table: a small cardboard parcel
(Hermes-style), three sealed envelopes (cream white), a single red rose (slightly wilted),
and a bottle of Martini Bianco. Dim warm light from the side, slightly moody. No text
on the envelopes.
```

---

### `package-door.jpg` — The Package Arrives

```
Photorealistic: view from inside a Berlin apartment looking at a front door. On the
doormat lies a medium-sized cardboard box with a Hermes shipping label. The hallway
is dimly lit, slightly unsettling. The box has a handwritten label. No text visible
(or illegible). Slightly cinematic, quiet tension. No text.
```

---

### `horror-blue-jacket.jpg` — Lukas (Horror Branch)

```
Photorealistic: a man standing alone in a dimly lit Berlin Hinterhof (backyard courtyard)
at night, seen from a high window above. He is wearing a **dark blue rain jacket**,
hood up. His face is NOT visible — he is turned away or the angle obscures it. He stands
completely still next to the Mülltonnen (recycling bins). Unsettling stillness. Moonlight
from above. Desaturated, cold colour grade. Horror atmosphere. No text.
```

---

### `horror-mirror.jpg` — The Mirror Doppelgänger

```
Photorealistic: a woman standing in front of a bathroom mirror at night, holding a candle
or with a single dim ceiling light. Her reflection in the mirror is smiling — she is not.
The reflection appears slightly different (different expression, slightly different posture).
Dark, cold colour palette. Psychological horror atmosphere. No text.
```

---

### Decoy Profile Cards (Kevin, Maximilian, Jens)

Use any royalty-free stock portrait or generate with prompts below.
**All three should look obviously "not right" — too try-hard, too serious, or too vague.**

**Kevin (`kevin-profile.jpg`):**
```
Photorealistic portrait of a German man, age ~29, muscular, gym-fit body, wearing an
expensive-looking polo shirt, excessive watch visible (Rolex-style). He has a cocky half-smile
selfie expression. Gym locker room background, slightly blurred. Tinder profile photo crop.
```

**Maximilian (`maximilian-profile.jpg`):**
```
Photorealistic portrait of a German man, age ~31, slim, in a dark navy business suit —
same suit as in his other 5 photos. Perfectly groomed, slightly stiff posture, slightly
too formal. Background: blurred high-end restaurant or yacht club. Professional but cold.
Tinder profile photo crop.
```

**Jens (`jens-profile.jpg`):**
```
Photorealistic portrait of a German man, age ~27, artist-type, slightly dishevelled dark
hair, half-open linen shirt, a subtle crystal necklace. Holding an acoustic guitar very
casually. Expression: mysterious, dreamy, slightly unfocused. Background: blurred
Berlin studio or graffiti wall. Tinder profile photo crop.
```

---

## 📼 REAL PHOTOS & VIDEO YOU HAVE

You have real media that can replace or supplement AI-generated assets.
Use these directly — they will make the game far more personal and immersive.

### Bachelor Party Photos/Videos

| What you have | Best use in game |
|--------------|-----------------|
| **Tom's Stag party photos/videos** | Scene background for `messages_montage` narration ("ihr lernt euch kennen"), easter egg reveal, or a fun "Stag Night" flash before the true ending |
| **Vicky's Hen party photos/videos** | Same — shows her world while they were apart. Could be used as a parallel narration cut. |

> 💡 **Tip:** Extract 1–2 still frames from the videos as JPGs. Use the most joyful or
> chaotic-but-wholesome frame. Resize to 340×180px.

---

### Wedding Video (Best Man Edit)

This is the most important media asset. The best man's video covers **both Tom's and
Vicky's perspectives from the dating period** — making it a perfect source for:

| Use | Where |
|----|-------|
| Opening still frames | `couple-photo.jpg` (match screen) or title screen background |
| Brunch / first date frames | `canal-friedrichstrasse.jpg`, `date-first-meeting.jpg` |
| Spree walk or Berlin street frames | `spree-museumsinsel.jpg`, `ubahn-goodbye.jpg` |
| "montage" frames | `messages_montage` narration background |
| Wedding ceremony frames | `wedding-standesamt.jpg`, `wedding-party.jpg` |
| A Tom close-up (good lighting) | `tom-profile.jpg` — overrides the AI prompt entirely |

> 💡 **Extraction tip (free):** Open the video in VLC → `Video` → `Take Snapshot`
> at the right moment. Or use `ffmpeg -i video.mp4 -ss 00:01:23 -frames:v 1 out.jpg`.

---



## 🎵 AUDIO ASSETS

All audio files live in: `PythonTerminalGame/Superlike/audio/`
File paths are mapped in `Config.audio` (`js/config.js`). **Any missing track fails silently**
— the game never breaks because an mp3 isn't there yet. Recommended format: `.mp3` (best
mobile browser support) or `.ogg`. Keep loops 30–90s, sfx <2s.

> 🔇 **Players can mute at any time** via the 🔊/🔇 button in the top-right of the header.
> The mute state is persisted across plays via `localStorage`.
> 🚪 **Players can quit at any time** via the ✕ button — confirms before resetting.

### Music Themes (looping)

| Key | Filename suggestion | Mood | Used in scenes |
|-----|--------------------|------|----------------|
| `theme_intro` | `theme-intro.mp3` | Soft piano, hopeful | Title screen |
| `theme_swipe` | `theme-swipe.mp3` | Light electronic, swipe-y | Profile cards (incl. decoys) |
| `theme_chat` | `theme-chat.mp3` | Cozy, lo-fi | Match, first_chat |
| `theme_date` | `theme-date.mp3` | Warm acoustic guitar | Brunch / date scenes |
| `theme_kiss` | `theme-kiss.mp3` | String swell, romantic | goodbye / lean_in |
| `theme_montage` | `theme-montage.mp3` | Upbeat, montage-y | late_night_chat |
| `theme_silence` | `theme-silence.mp3` | Sparse, sad piano | crisis / silence |
| `theme_letters` | `theme-letters.mp3` | Suspense, low strings | package_arrives / letters |
| `theme_reunion` | `theme-reunion.mp3` | Warm rebuild | reunion |
| `theme_true` | `theme-true.mp3` | Triumphant, wedding-y | true ending |
| `theme_matrix` | `theme-matrix.mp3` | Synth bass, Matrix vibes | red-pill branch |

### Horror Branch (progressive descent — get darker as level rises)

| Key | Filename suggestion | Mood |
|-----|--------------------|------|
| `theme_horror_1` | `horror-1-unease.mp3` | Subtle drone, distant heartbeat |
| `theme_horror_2` | `horror-2-dread.mp3` | Detuned piano, wrong notes |
| `theme_horror_3` | `horror-3-terror.mp3` | Full Stephen-King-style atmospheric horror |
| `theme_horror_end` | `horror-end.mp3` | The "you didn't make it" outro |

### Sound Effects (one-shot)

| Key | Filename suggestion | When |
|-----|--------------------|------|
| `sfx_match` | `sfx-match.mp3` | Match screen reveal |
| `sfx_swipe` | `sfx-swipe.mp3` | Swipe gesture |
| `sfx_message` | `sfx-message.mp3` | Each chat bubble appears |
| `sfx_doorbell` | `sfx-doorbell.mp3` | Package arrives |
| `sfx_glitch` | `sfx-glitch.mp3` | Theme transition (horror/matrix) |
| `sfx_heartbeat` | `sfx-heartbeat.mp3` | Horror level 2+ |
| `sfx_whisper` | `sfx-whisper.mp3` | Horror level 3 |

### 🥚 Easter Egg: "Human" by Rag'n'Bone Man

| Key | Filename | Trigger |
|-----|----------|---------|
| `easter_human` | `easter-human.mp3` | Chat: date_plan → option `human_song` ("Hör mal richtig rein: Human...") |

This is the song Vicky first suggested to Tom during their early dating phase.
The chat option **does not advance the story** — Tom replies with goosebumps and
asks again about Saturday brunch. Use ~30s clip (chorus). Provide your own legally-licensed copy.

### Optional Music Replacements

You can drop in any track of your own — just rename it to match the key above
(or edit `Config.audio` paths). All playback uses HTML5 `<audio>` with a two-element
crossfade pattern; volume defaults to 0.45 and fades over 900 ms.

---

## 🎯 HAPPY PATH (Perfect Playthrough)

**PIN Code: `0410`** (4. Oktober = reunion date)

This is the one and only path to the TRUE ending with 100% score:

| # | Scene | Correct Choice |
|---|-------|----------------|
| 1 | Title | Enter PIN: 0410 → Start |
| 2 | Profile (Kevin) | **Nope** ← decoy! |
| 3 | Profile (Maximilian) | **Nope** ← decoy! |
| 4 | Profile (Jens) | **Nope** ← decoy! |
| 5 | Profile (Tom) | Swipe Right (or Superlike ⭐ for bonus) |
| 6 | Match | Continue |
| 7 | Chat: first_chat | `bio_true` |
| 8 | Chat: date_plan | `brunch_yes` (or `human_song` for 🥚 easter egg, then `brunch_yes`) |
| 9–28 | …same as before… | …continue down the happy path |

> Decoy `nope` does **not** count toward the 3-nope "cat lady" ending. Only nopes on Tom count.
> Liking a decoy → `wrong_prince` ending ("Der falsche Prinz").


**Score: 12/12 correct × 2 = 24pts → 100%**

### Easter Eggs (non-scoring but fun):
- `schmutz` at reunion → 🐭 "Komm her, Schmutz" (also counts as correct!)
- `push` at spree → 🏊 "Ihn in die Spree schubsen"
- `wave` at goodbye → 💊 "Gute Besserung!" (inside joke)
- `superlike` at profile → ⭐ "Historisch korrekt: Superlike!"

---

## 🔀 ALL STORY BRANCHES

```
                         ┌─ wrong_prince 👑 (like a decoy: Kevin/Maximilian/Jens)
                         ├─ ghost (chat: first_chat)
                         ├─ creep (chat: date_plan)
                         ├─ short_date (choice: after_brunch → leave)
                         │
                         ├─ hero 🦢 (choice: at_spree → swan_rescue)
    MAIN PATH ──────────┤
                         ├─ RED PILL → matrix_enter
                         │              ├─ matrix_code 💾
                         │              ├─ matrix_arch 🏛️
                         │              └─ matrix_return 🌅
                         │
                         ├─ fade 📵 (choice: crisis or first_meeting_parents → bail)
                         ├─ shortcut ⏩ (choice: crisis → stay)
                         │
                         ├─ NIGHT TRIGGER (22:00-05:00) → horror_descent branch
                         ├─ horror_descent 📦 (choice: letters → dont_open)
                         │   ↳ 9 progressive scenes, CSS horror-level 1→2→3
                         │   ↳ Music: theme_horror_1 → 2 → 3 → end
                         │      ├─ horror_her 🪞 (mirror)
                         │      ├─ horror_him 🌹 (roses)
                         │      └─ horror_serial 🟦 (Lukas, 15. Paket)
                         │
                         ├─ martini 🍸 (choice: letters → letter3)
                         ├─ nope 🐱 (profile: 3× nope on Tom — decoys don't count)
                         │
                         └─ TRUE 💍 (complete correct path)
```

### Branching Triggers:
1. **Multiple-choice chat** → wrong answer = different ending
2. **Time-of-day** → playing 22:00–05:00 auto-triggers horror mode at package scene
3. **Camera permission** → decline = different narration (no score penalty)
4. **Red/blue pill** → Matrix branch with full theme switch + falling code animation
5. **3× nope** → Cat lady ending

---

## 📋 GAME REVIEW

### UI Design — ⭐⭐⭐⭐½ (4.5/5)
**Strengths:**
- Clean mobile-first (420px) Tinder-style card UI
- Smooth CSS transitions between scenes (250ms exit + 300ms enter)
- Three distinct theme modes (romance/horror/matrix) with full CSS variable override
- Progress bar gives sense of advancement
- Landscape blocker enforces portrait experience
- PIN gate adds mystery/exclusivity

**Could improve:**
- No haptic feedback (consider `navigator.vibrate()` on wrong choices)
- No sound/music layer (would enhance horror/matrix atmosphere)
- Photos are still SVG placeholders — real photos will hugely improve immersion

---

### Gamability — ⭐⭐⭐⭐ (4/5)
**Strengths:**
- 25 scenes on main path = ~5-7 minutes reading + choosing
- 12 scoring choices keep player engaged
- Multiple replays needed to discover all 15 endings
- Easter eggs reward exploration (Schmutz, river push, Gute Besserung)
- Camera scene is a surprise that breaks the fourth wall
- Time-based horror trigger means the SAME player gets different experiences

**Could improve:**
- No save/checkpoint system (replay starts from scratch)
- "Correct" path can be brute-forced since wrong answers show toasts
- Could add a timer pressure element for some choices
- Achievement/unlock system would boost replayability

---

### Architecture — ⭐⭐⭐⭐⭐ (5/5)
**Strengths:**
- Clean IIFE module separation: Config → Story → State → Effects → Renderer → Engine
- Pure data story file — zero logic in story.js, easy to extend
- Object.freeze on all module exports prevents accidental mutation
- Scene types are extensible (just add a case + handler)
- `meta` flags on scenes enable conditional behavior without engine changes
- Tests are comprehensive (244 assertions covering all data integrity)
- No build step, no dependencies, no framework — runs anywhere

**How to add a new storyline:**
1. Add scene to `scenes[]`
2. Add data to the matching dict (`chats`, `narrations`, `choices`, `cameras`)
3. Add ending to `endings`
4. Update `TOTAL_CHOICES` if scoring changed
5. Update tests

---

### Creativity & Fun — ⭐⭐⭐⭐⭐ (5/5)
**Strengths:**
- Personal story = emotionally resonant (not generic)
- Horror branch is genuinely creepy (Lukas reveal, mirror doppelgänger)
- Matrix branch is clever meta-humor (source code shows `this.feelings += Infinity`)
- Camera scene breaks immersion in a GOOD way (your face in the story)
- "Running joke" is literally about running (multi-layered)
- PIN code = the reunion date (thematic)
- Time-trigger means playing at 3am gives you a horror experience
- Multiple endings range from wholesome to disturbing to absurd (swan rescue!)
- The "Architekt" ending (1 of 14 million) is a touching Endgame reference

**What makes it special:**
- It's not just a game — it's a love letter in code
- Every "wrong" answer teaches you something about the real relationship
- The true ending isn't just "you win" — it's your actual wedding

---

### Overall Score: ⭐⭐⭐⭐½ (4.5/5)

**What would make it 5/5:**
1. Real photos replacing placeholders (this file tells you exactly which ones)
2. Background music/sound effects per theme
3. Haptic feedback on mobile
4. An animated intro sequence (like Tinder's loading animation)

---

## 🛠️ TECHNICAL NOTES

- **Config photo update**: Edit `config.js` → change `placeholder(...)` calls to `'static/filename.jpg'`
- **Image dimensions**: Profile photos: 340×280px recommended. Scene photos: 340×180px.
- **File formats**: JPG for photos, GIF for animations, PNG for transparency needs
- **Optimization**: Keep images under 200KB each for mobile performance
- **Camera**: Uses `getUserMedia({ video: { facingMode: 'user' } })` — HTTPS required for deployment!
