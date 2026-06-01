# Static Assets

Place your media files here. See `../ASSETS.md` for the full list with filenames and descriptions.

## Quick Reference

```
static/
├── tom-profile.jpg          (Tom's Tinder photo)
├── vicky-profile.jpg        (Vicky's Tinder photo)
├── kevin-profile.jpg        (Decoy #1 — Bro)
├── maximilian-profile.jpg   (Decoy #2 — Banker)
├── jens-profile.jpg         (Decoy #3 — Spiritual musician)
├── lukas-silhouette.jpg     (Horror branch)
├── couple-photo.jpg         (Couple photo for match screen)
├── canal-friedrichstrasse.jpg
├── burrito-misha.jpg
├── spree-museumsinsel.jpg
├── ubahn-goodbye.jpg
├── sbahn-night.jpg
├── hoehle-der-loewen.jpg
├── karate-event.jpg
├── package-door.jpg
├── three-letters.jpg
├── indian-restaurant.jpg
├── mount-fuji.jpg
├── wedding-standesamt.jpg
├── wedding-party.jpg
├── horror-mirror.jpg        (optional)
├── horror-roses.jpg         (optional)
├── horror-blue-jacket.jpg   (optional)
├── matrix-code.gif          (optional)
└── matrix-architect.jpg     (optional)
```

## Audio (`../audio/`)

```
audio/
├── theme-intro.mp3
├── theme-swipe.mp3
├── theme-chat.mp3
├── theme-date.mp3
├── theme-kiss.mp3
├── theme-montage.mp3
├── theme-silence.mp3
├── theme-letters.mp3
├── theme-reunion.mp3
├── theme-true.mp3
├── theme-matrix.mp3
├── horror-1-unease.mp3      (horror descent · level 1)
├── horror-2-dread.mp3       (horror descent · level 2)
├── horror-3-terror.mp3      (horror descent · level 3)
├── horror-end.mp3           (horror final scene)
├── sfx-match.mp3
├── sfx-swipe.mp3
├── sfx-message.mp3
├── sfx-doorbell.mp3
├── sfx-glitch.mp3
├── sfx-heartbeat.mp3
├── sfx-whisper.mp3
└── easter-human.mp3         🥚 "Human" by Rag'n'Bone Man (~30s clip)
```

> Missing tracks fail silently — the game runs fine with no audio at all.
> The 🔊/🔇 button (header, top-right) mutes music globally and persists in `localStorage`.
> The ✕ button quits with a confirmation modal.


Once added, update `js/config.js` photos object:
```js
tom_profile: 'static/tom-profile.jpg',
vicky_profile: 'static/vicky-profile.jpg',
// etc.
```
