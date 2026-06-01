/**
 * story.js – All narrative content as pure data
 *
 * This file defines the complete story tree.
 * Each scene is a plain object with:
 *   { type, id?, meta?, ... scene-specific data }
 *
 * The engine reads this data and delegates rendering.
 * To add/edit story content, ONLY this file needs to change.
 *
 * ─── HOW TO ADD A NEW STORYLINE ─────────────────────────────
 * 1. Add new scene(s) to the `scenes` array OR introduce a
 *    branch by giving a choice option an `end: 'xxx'` value.
 * 2. For a new narration: add to `narrations` keyed by id.
 * 3. For a new chat: add to `chats` keyed by id.
 * 4. For a new branching choice: add to `choices` keyed by id.
 * 5. For a new ending: add to `endings` keyed by id.
 *    – Normal ending: { icon, title, body, sub }
 *    – Branching ending: { title, sub, body, options:[{...end}] }
 * 6. Mark exactly ONE option per `choice` as `correct: true`
 *    to count toward the "perfect score" / true ending.
 * 7. Use `easter: 'flag_name'` to set a hidden flag.
 * 8. Use `meta: { triggerHorrorIfNight: true }` on a scene to
 *    auto-divert to the horror branch when played between
 *    22:00 and 05:00 local time.
 * 9. Update Config.TOTAL_CHOICES if you added scoring slots.
 * 10. Update tests.js scene count + correctPath array.
 */
var Story = (function () {
  'use strict';

  // ─── Scene sequence (linear backbone, ~23 scenes) ──────────
  // The engine walks this array sequentially. Endings can
  // short-circuit it via `end:` on choice options.

  // ─── Title screen variants ─────────────────────────────────
  // Engine picks one based on `superlike_plays` from localStorage.
  // Index 0 = first ever play, then rotates on each replay.
  var titleVariants = [
    {
      emoji: '⭐', title: 'Superlike',
      body: 'Eine interaktive Liebesgeschichte.<br>Triff die richtigen Entscheidungen —<br>' +
            'und finde heraus, ob du <strong>unser</strong> Happy End erreichst.',
      hint: '🎯 Ziel: Folge dem Schicksal',
      btnEmoji: '💘', btnText: 'Spiel starten'
    },
    {
      emoji: '💜', title: 'Wieder da?',
      body: 'Du kennst den Anfang.<br>Aber kennst du wirklich <strong>alle</strong> Wege?<br>' +
            'Es gibt 11 Enden. Du hast erst eines gesehen.',
      hint: '🗝️ Tipp: Versuch mal eine andere Antwort.',
      btnEmoji: '🎲', btnText: 'Andere Pfade entdecken'
    },
    {
      emoji: '🌙', title: 'Runde 3',
      body: 'Manche Pfade öffnen sich nur nachts.<br>Manche nur, wenn man die Kamera erlaubt.<br>' +
            'Manche nur, wenn man die <strong>rote</strong> Pille nimmt.',
      hint: '👁️ Easter Eggs warten.',
      btnEmoji: '🎭', btnText: 'Weiter spielen'
    },
    {
      emoji: '♾️', title: 'Schon wieder?',
      body: 'Du bist hartnäckig. Das gefällt mir.<br>Vielleicht ist genau das der Grund,<br>' +
            'warum wir es bis hierher geschafft haben.',
      hint: '💍 Das wahre Ende: 04.10.2026',
      btnEmoji: '💞', btnText: 'Nochmal'
    }
  ];

  var scenes = [
    { type: 'title', music: 'theme_intro' },
    // Decoy profiles — Vicky swipes through other matches before Tom appears.
    // Engine treats `meta.decoy = true` as: nope → next, like/super → wrong-prince ending.
    { type: 'profile', id: 'kevin',    meta: { decoy: true }, music: 'theme_swipe' },
    { type: 'profile', id: 'maximilian', meta: { decoy: true }, music: 'theme_swipe' },
    { type: 'profile', id: 'jens',     meta: { decoy: true }, music: 'theme_swipe' },
    { type: 'profile', id: 'tom',      music: 'theme_swipe' },
    { type: 'match',                   music: 'theme_chat' },
    { type: 'chat', id: 'first_chat',  music: 'theme_chat' },
    { type: 'chat', id: 'date_plan' },
    { type: 'narration', id: 'traveling_to_date', music: 'theme_date' },
    { type: 'narration', id: 'date_brunch' },
    { type: 'choice', id: 'who_pays' },
    { type: 'choice', id: 'after_brunch' },
    { type: 'narration', id: 'walking_to_spree' },
    { type: 'choice', id: 'at_spree' },
    { type: 'choice', id: 'goodbye',   music: 'theme_kiss' },
    { type: 'narration', id: 'after_kiss' },
    { type: 'camera', id: 'sbahn_reflection' },
    { type: 'choice', id: 'pill_choice' },
    { type: 'chat', id: 'late_night_chat', music: 'theme_montage' },
    { type: 'narration', id: 'messages_montage' },
    { type: 'choice', id: 'first_meeting_parents' },
    { type: 'choice', id: 'crisis',    music: 'theme_silence' },
    { type: 'narration', id: 'silence' },
    { type: 'narration', id: 'package_arrives', meta: { triggerHorrorIfNight: true }, music: 'theme_letters' },
    { type: 'choice', id: 'letters' },
    { type: 'narration', id: 'waiting' },
    { type: 'choice', id: 'reunion',   music: 'theme_reunion' },
    { type: 'ending', id: 'true' },
  ];

  // ─── Profile cards ──────────────────────────────────────────
  var profiles = {
    tom: {
      name: 'Tom', age: 24,
      location: '📍 Berlin · 3 km entfernt',
      photo: Config.photos.tom_profile,
      bio: [
        '🎓 Physik-Student · nebenbei Kfz-Mechaniker',
        '🥊 Kickboxing · Ski · Fitness · (kein Fußball)',
        '„Wenn du mir ein Superlike gibst, koche ich dir Frühstück"'
      ]
    },
    // ── Decoy candidates: Vicky swipes through these first ─────
    kevin: {
      name: 'Kevin', age: 29,
      location: '📍 Berlin · 1 km entfernt',
      photo: Config.photos.kevin_profile,
      bio: [
        '🏎️ AMG · Rolex · Gym-Selfies (drei davon)',
        '💼 „Entrepreneur" (lebt noch bei Mama)',
        '„Du bist anders als die anderen" 😏'
      ]
    },
    maximilian: {
      name: 'Maximilian', age: 31,
      location: '📍 Charlottenburg · 4 km entfernt',
      photo: Config.photos.maximilian_profile,
      bio: [
        '🍷 Investment Banker · 5 Sprachen · Hobby: Segeln',
        '👔 Anzug auf 5/6 Fotos. Auf dem 6.: derselbe Anzug.',
        '„Suche jemanden, der mit mir nach Sylt fliegt."'
      ]
    },
    jens: {
      name: 'Jens', age: 27,
      location: '📍 Neukölln · 0,8 km entfernt',
      photo: Config.photos.jens_profile,
      bio: [
        '🎸 Musiker / Künstler / Lebensphilosoph',
        '🌿 „Bin gerade auf einer spirituellen Reise"',
        '„Ich mache keine Beziehungen, nur Verbindungen ✨"'
      ]
    }
  };

  // ─── Chat conversations ─────────────────────────────────────
  var chats = {
    first_chat: {
      date: 'Tinder · Sommer 2016',
      partnerName: 'Tom',
      partnerPhoto: Config.photos.tom_profile,
      messages: [
        { type: 'system', text: 'Ihr habt ein Match!' },
        { type: 'recv', text: 'Hey! Das Superlike hat mich ehrlich überrascht 😄' },
        { type: 'recv', text: 'Das Foto mit Fliege und Hosenträgern ist echt gut. Wer hat das gemacht?' },
        { type: 'recv', text: 'Und was studierst du, wenn ich fragen darf?' }
      ],
      choices: [
        { id: 'bio_true', emoji: '🙈', text: 'Wirtschaftspsychologie im Master. Und du? Ich bin eigentlich nur für eine Freundin hier...', correct: true,
          reply: 'Haha das steht wortwörtlich in meiner Bio 😄 Physik, letztes Semester. Nebenbei schraub ich Autos bei meinen Eltern in der Werkstatt.' },
        { id: 'flirty', emoji: '😏', text: 'Rate mal 😏',
          reply: 'Hmm... irgendwas mit Menschen? Du siehst aus wie jemand der gut zuhören kann. Psychologie?' },
        { id: 'ghost', emoji: '👻', text: '...', end: 'ghost' }
      ]
    },
    date_plan: {
      date: 'Ein paar Tage und sehr viele Nachrichten später',
      partnerName: 'Tom',
      partnerPhoto: Config.photos.tom_profile,
      messages: [
        { type: 'time', text: 'Donnerstag, 21:34' },
        { type: 'sent', text: 'Ich geh jetzt eine Runde laufen 🏃‍♀️' },
        { type: 'system', text: '(Spoiler: Sie war die letzten 20 Jahre kein einziges Mal laufen.)' },
        { type: 'recv', text: 'Um halb 10 abends? Respekt 😄', delayBefore: 900 },
        { type: 'recv', text: 'Was hörst du eigentlich beim Laufen?' },
        { type: 'sent', text: 'Gerade „Human" von Rag\'n\'Bone Man. Kennst du? Hammer Song.' },
        { type: 'recv', text: 'Krass, der Song läuft hier auch gerade 🎧 Zufall?', delayBefore: 1400 },
        { type: 'recv', text: 'Hey — sollen wir uns mal treffen?', delayBefore: 1100 },
        { type: 'sent', text: 'Ja gerne :) Ich kenn ein nettes österreichisches Restaurant am Kanal, Friedrichstraße. Samstag Brunch?' },
        { type: 'recv', text: 'Perfekt. Treffen wir uns am Edeka im Bahnhof Friedrichstraße? Dann laufen wir zusammen rüber.', delayBefore: 800 }
      ],
      choices: [
        { id: 'brunch_yes', emoji: '🥐', text: 'Klingt gut! Samstag um 11 am Edeka.', correct: true,
          reply: 'Deal. Ich freu mich.' },
        { id: 'human_song', emoji: '🎧', text: '"Hör mal richtig rein: Human, Rag\'n\'Bone Man 🎵"', easter: 'rag_n_bone',
          music: 'easter_human', toast: '🎵 Easter Egg: „I\'m only human after all..." entdeckt!',
          reply: 'Ich bin grade beim Refrain. Gänsehaut. Also: Samstag 11 Uhr Edeka. Ja oder nein? 🙂' },
        { id: 'phone_first', emoji: '📞', text: 'Können wir vorher kurz telefonieren? Bin da etwas vorsichtig.',
          reply: 'Klar, versteh ich total. Ruf einfach an wenn du magst. Aber Samstag steht trotzdem im Kalender 😄' },
        { id: 'netflix', emoji: '🍿', text: 'Oder einfach Netflix bei dir?', end: 'creep' }
      ]
    },
    late_night_chat: {
      date: 'Samstag · 23:47 · Daheim',
      partnerName: 'Tom',
      partnerPhoto: Config.photos.tom_profile,
      messages: [
        { type: 'time', text: 'Samstag, 23:47' },
        { type: 'recv', text: 'Gut zuhause angekommen?' },
        { type: 'sent', text: 'Ja, alles gut 🙂' },
        { type: 'recv', text: 'Heute war... ich hab das nicht erwartet, ehrlich gesagt.' },
        { type: 'recv', text: 'Im positiven Sinne. Falls das nicht klar war 😅' },
        { type: 'sent', text: 'Ich auch nicht. War echt schön.' },
        { type: 'recv', text: 'Dienstag läuft übrigens „Die Höhle der Löwen". Falls du Lust hast — synchron schauen?' },
        { type: 'system', text: 'Damit beginnt eine Tradition. (Beide getrennt, mit Live-Kommentar.)' }
      ],
      choices: [
        { id: 'yes_tradition', emoji: '📺', text: '"Ich bring die Snacks. Virtuell."', correct: true,
          reply: 'Deal. 21 Uhr, sei pünktlich 🦁' },
        { id: 'no_thanks', emoji: '😴', text: '"Ich schau eigentlich kein TV..."',
          reply: 'Ok, dann denk ich mir was anderes aus 😄' },
        { id: 'pretend_run', emoji: '🏃‍♀️', text: '"Geh erstmal eine Runde laufen."',
          toast: '😂 Schon wieder laufen — der Running-Gag läuft.',
          reply: 'Um Mitternacht? Mittlerweile glaub ich das mit dem Laufen nicht mehr 😄' }
      ]
    }
  };

  // ─── Narration scenes ───────────────────────────────────────
  var narrations = {
    traveling_to_date: {
      title: 'Auf dem Weg',
      sub: 'Samstag · 10:32 · S-Bahn Richtung Friedrichstraße',
      body:
        'Du sitzt in der S-Bahn. Drei Outfits hattest du heute Morgen an.<br>' +
        'Im Spiegel: zehnmal gecheckt.<br><br>' +
        '„Es ist nur ein Brunch", sagst du dir.<br>' +
        '„Nur ein Brunch. Eine Stunde. Vielleicht zwei."<br><br>' +
        'Dein Handy: <em>Tom – „Bin am Edeka, blaue Jacke 🙂"</em><br><br>' +
        'Dein Herz schlägt schneller als die S-Bahn.',
      btnEmoji: '🚆',
      btnText: 'Aussteigen'
    },
    date_brunch: {
      title: 'Das erste Date',
      sub: 'Edeka · Bahnhof Friedrichstraße · Dann das Restaurant',
      body:
        'Du findest ihn vor dem Edeka. Er steht da, lächelt nervös.<br>' +
        '„Hi, schön dich endlich zu sehen."<br><br>' +
        'Ihr lauft zusammen die paar Minuten zum Restaurant am Kanal.<br>' +
        'Smalltalk. Ihr seid beide kurz angebunden — Aufregung.<br><br>' +
        'Das österreichische Brunch-Lokal ist klein und voll.<br>' +
        'Ihr esst, ihr redet. Schneller, als ihr denken könnt.<br><br>' +
        'Anderthalb Stunden später — er bezahlt.<br>' +
        'Die Rechnung ist nicht ohne...',
      btnEmoji: '💸',
      btnText: 'Was tun?'
    },
    walking_to_spree: {
      title: 'Zur Museumsinsel',
      sub: 'Burrito in der Hand · Sonne im Gesicht',
      body:
        'Misha im Bahnhof — der beste Burrito-Stand der Stadt.<br>' +
        'Ihr lauft Richtung Spree.<br><br>' +
        'Er redet über Karate. Du über deine Masterarbeit.<br>' +
        'Er hört zu. Wirklich zu.<br>' +
        '(Wann hat das zuletzt einer getan?)<br><br>' +
        'Die Museumsinsel kommt in Sicht.<br>' +
        'Ihr setzt euch ans Wasser.',
      btnEmoji: '🌊',
      btnText: 'Weiter'
    },
    after_kiss: {
      title: 'Auf dem Heimweg',
      sub: 'Mitternacht · S-Bahn nach Hause',
      body:
        'Er hat dich geküsst. An der U-Bahn. Aus dem Nichts.<br>' +
        'Dein Gesichtsausdruck war: 50% überrascht, 50% Grinsen.<br><br>' +
        'Du sitzt jetzt in der S-Bahn und realisierst, was passiert ist.<br>' +
        'Du grinst die ganze Fahrt über. Eine alte Dame fragt:<br>' +
        '„Verliebt?"<br><br>' +
        'Du wirst rot. Sagst nichts. Grinst weiter.',
      btnEmoji: '📱',
      btnText: 'Handy checken'
    },
    messages_montage: {
      title: '1.000+ Nachrichten',
      sub: 'In wenigen Wochen',
      body:
        'Dienstags „Die Höhle der Löwen" zusammen schauen 📺<br>' +
        '(Beide getrennt, aber gleichzeitig — mit Live-Kommentar)<br><br>' +
        'Ihr bestellt ein Fitness-Handtuch, das beide gut fanden 😂<br>' +
        'Lieblingsfilme, peinliche Geschichten, die großen Fragen.<br><br>' +
        'Sie hat einen altmodischen Kalender — Heiligtum.<br>' +
        'Er notiert: <em>nächstes Date</em>. Sie streicht durch.<br>' +
        'Schreibt drüber: <em>UNSER nächstes Date</em>.<br><br>' +
        'Weitere Dates folgten. Alles fühlte sich richtig an.<br>' +
        'Bis...',
      btnEmoji: '⚡',
      btnText: 'Was passierte?'
    },
    silence: {
      title: '14 Tage Stille',
      sub: 'Kein Anruf. Keine Nachricht. Nichts.',
      body:
        '📱 <em>Keine neuen Nachrichten</em><br><br>' +
        'Auf der anderen Seite:<br>Tom sitzt mit Jenja im Park.<br><br>' +
        '„Sie muss selbst erkennen was sie will.<br>Schreib ihr nicht."<br><br>' +
        'Innerlich: <em>Diese Frau ist zu besonders.<br>Ich kann das nicht einfach so lassen.</em><br><br>' +
        '🚗 Eine Idee entsteht...',
      btnEmoji: '➡️',
      btnText: 'Weiter'
    },
    package_arrives: {
      title: 'Es klingelt.',
      sub: 'Hermes-Lieferant · Blaue Regenjacke',
      body:
        'Es klingelt an deiner Tür.<br>' +
        'Ein Mann in blauer Regenjacke. „Hermes."<br>' +
        'Er hält dir ein iPad zum Unterschreiben hin.<br>' +
        'Er heißt Lukas. (Glaubst du.)<br><br>' +
        'Du nimmst das Paket. Schließt die Tür.<br>' +
        'Auf dem Karton — keine Adresse.<br>' +
        'Nur dein Vorname. Handschrift.<br><br>' +
        '✉️ Drei Briefe.<br>' +
        '🌹 Eine Rose (in Brief 2, sagt Brief 1).<br>' +
        '🍸 Eine Flasche Martini Bianco (in Brief 3).<br><br>' +
        '<em>Ihre Antwort an Tom war damals:<br>„Ich fahr morgen zu meinen Großeltern nach Polen.<br>' +
        'Kaum Internet. Ich brauche Zeit zum Nachdenken."</em><br>' +
        '(Spoiler: Sie hatten die ganze Zeit Kontakt. 📱)',
      btnEmoji: '📦',
      btnText: 'Briefe öffnen'
    },
    waiting: {
      title: '2 Wochen warten',
      sub: 'Du hast Brief 2 geöffnet. Jetzt was?',
      body:
        'Die Rose steht in der Vase. Sie hält länger als sie sollte.<br>' +
        'Du schreibst Brief um Brief. Verwirfst alle.<br><br>' +
        'Tom schreibt nicht. Hält sich an Brief 1: <em>kein Druck</em>.<br>' +
        'Jenja sagt: <em>„Lass ihr Zeit. Wirklich."</em><br><br>' +
        'Du gehst durch die Stadt. Siehst Pärchen.<br>' +
        'Du gehst ins Karate-Studio. Schaust durchs Fenster.<br>' +
        'Du gehst dienstags TV anmachen — und wieder aus.<br><br>' +
        'Dann schreibst du.',
      btnEmoji: '✍️',
      btnText: 'Schreiben'
    }
  };

  // ─── Camera scenes ───────────────────────────────────────────
  // Camera scenes ask for front camera permission.
  // If granted → show live feed with themed filter + overlay text.
  // If declined → show `fallbackNarration` instead and continue.
  var cameras = {
    sbahn_reflection: {
      theme: 'romance',      // determines CSS filter on video
      title: 'Dein Spiegelbild',
      sub: 'S-Bahn · Fenster · Nachts',
      promptText: 'Du siehst dein Spiegelbild im Fenster der S-Bahn.<br>Du strahlst.<br><br><em>Willst du dich sehen?</em>',
      overlayText: '✨ Du strahlst.',
      btnText: 'Weiter',
      fallbackNarration: {
        title: 'Dein Spiegelbild',
        sub: 'S-Bahn · Fenster · Nachts',
        body:
          'Du siehst dein Spiegelbild im Fenster der S-Bahn.<br>' +
          'Verschmiertes Licht, Tunnelwände fliegen vorbei.<br><br>' +
          'Dein Spiegelbild grinst. Du auch.<br>' +
          'Du hast rote Wangen. Und ein Lächeln, das du nicht<br>' +
          'kontrollieren kannst.<br><br>' +
          '<em>Das ist also verliebt sein.</em>',
        btnEmoji: '📱',
        btnText: 'Handy checken'
      }
    }
  };

  // ─── Choices ────────────────────────────────────────────────
  var choices = {
    pill_choice: {
      title: 'In der S-Bahn',
      sub: 'Ein alter Mann setzt sich dir gegenüber. Schwarzer Anzug. Sonnenbrille.',
      body:
        'Er hält dir zwei Pillen hin. Eine rot, eine blau.<br><br>' +
        '„Du nimmst die <strong>blaue Pille</strong> — die Geschichte endet, du wachst auf,<br>' +
        'und glaubst alles, was du glauben willst.<br>' +
        'Du nimmst die <strong>rote Pille</strong> — und ich zeige dir,<br>' +
        'wie tief das Kaninchenloch geht."<br><br>' +
        '<em>Du fühlst das Bizzeln des Kusses noch auf den Lippen.<br>' +
        'Aber irgendwas an diesem Tag fühlte sich... zu perfekt an.</em>',
      options: [
        { id: 'blue', emoji: '💙', text: 'Die blaue Pille schlucken', correct: true,
          toast: 'Du blinzelst. Der Mann ist weg. War da überhaupt jemand?' },
        { id: 'red', emoji: '❤️', text: 'Die rote Pille schlucken', end: 'matrix_enter' }
      ]
    },
    who_pays: {
      title: 'Die Rechnung',
      sub: 'Er hat bezahlt — und es war nicht billig',
      body: 'Du schaust auf die Rechnung.<br>Er hat schon die Karte gezückt.<br>Was machst du?',
      options: [
        { id: 'accept', emoji: '🙏', text: '"Danke, das ist lieb!"', toast: 'Nett — aber so war es nicht 😄' },
        { id: 'insist', emoji: '😤', text: '"Das war zu teuer! Ich zahl das nächste!"', correct: true,
          toast: 'Genau! Und der nächste Stop war ein Burrito 🌯' },
        { id: 'venmo', emoji: '💸', text: 'Direkt PayPal-Request schicken', toast: 'Romantic... 😂' }
      ]
    },
    after_brunch: {
      title: 'Nach dem Brunch',
      sub: 'Nur 1,5 Stunden im Restaurant — aber irgendwie zu kurz',
      body: 'Das Frühstück war fantastisch.<br>Eigentlich war das Date „nur Brunch".<br>Aber irgendwie will keiner jetzt schon nach Hause...',
      options: [
        { id: 'leave', emoji: '👋', text: '"Ich muss leider los, war schön!"', end: 'short_date' },
        { id: 'burrito', emoji: '🌯', text: '"Ich kenn da Misha im Bahnhof... Burrito?"', correct: true },
        { id: 'river', emoji: '🌊', text: '"Lass uns an die Spree!"',
          toast: 'Fast richtig! Aber erst kam der Burrito 🌯' }
      ]
    },
    at_spree: {
      title: 'An der Spree',
      sub: 'Die Sonne scheint · Burritos gegessen · Museumsinsel',
      body:
        'Ihr liegt im Park. Er fragt dich für eine Klausur ab.<br>' +
        'Irgendwann wird es still.<br>Er sitzt neben dir, Arm ausgestreckt...',
      options: [
        { id: 'arm', emoji: '🥰', text: 'In seinen Arm lehnen', correct: true },
        { id: 'distance', emoji: '📏', text: 'Respektvollen Abstand halten',
          toast: 'Ihr redet noch lange. Aber der Moment ist vorbei.' },
        { id: 'push', emoji: '🏊', text: 'Ihn in die Spree schubsen', easter: 'river_push',
          toast: '🏊 Er kommt patschnass zurück. Irgendwie noch charmanter.' },
        { id: 'swan_rescue', emoji: '🦢', text: '"Warte! Da ist ein Schwan in Not!"', end: 'hero' }
      ]
    },
    goodbye: {
      title: 'Der Abschied',
      sub: 'Stunden später · An der U-Bahn',
      body:
        'Es ist Abend. Aus einem Brunch wurde der beste Tag seit langem.<br>' +
        'Ihr steht an der Treppe zur U-Bahn.<br>Er lächelt. Du lächelst.<br><br>' +
        '„Gute Nacht!", sagt er — und schaut dich an.<br>' +
        '<em>Er beugt sich vor. Es liegt was in der Luft.</em><br><br>Was tust du?',
      options: [
        { id: 'wave', emoji: '👋', text: '"Gute Besserung!" und winken', easter: 'gute_besserung',
          toast: '😂 Gute Preise, Gute Besserung! Easter Egg!' },
        { id: 'hug', emoji: '🤗', text: 'Ihn umarmen — schnell und sicher',
          toast: 'Eine Umarmung. Nett. Aber er fährt verwirrt nach Hause.' },
        { id: 'lean_in', emoji: '💋', text: 'Stehen bleiben · ihn anschauen · den Moment lassen', correct: true,
          toast: '💋 Er küsst dich. Eiskalt, aus dem Nichts. Du bist überrascht. Aber es ist unmissverständlich.' }
      ]
    },
    first_meeting_parents: {
      title: 'Dezember 2016',
      sub: 'Schwarzer Gürtel · Europäisches Karate-Event',
      body:
        'Tom hat heute seinen schwarzen Gürtel geprüft.<br>' +
        'Du sitzt im Publikum. Plötzlich:<br>' +
        '„<em>Du musst Vicky sein, oder?</em>"<br><br>' +
        'Neben dir: <strong>seine Eltern</strong>.<br>' +
        '(Eigentlich wollte er damit noch warten. Aber jetzt sitzen sie da.)<br><br>' +
        'Was tust du?',
      options: [
        { id: 'charm', emoji: '😊', text: 'Höflich, charmant, Smalltalk', correct: true,
          toast: 'Sie sind begeistert. Tom auch — heimlich.' },
        { id: 'panic', emoji: '😰', text: 'Innerlich Panik · "Hi... ja..."',
          toast: 'Sie merken die Anspannung. Aber sie finden\'s süß.' },
        { id: 'bail', emoji: '🚪', text: '"Sorry, ich muss kurz raus." → verschwinden', end: 'fade' }
      ]
    },
    crisis: {
      title: 'Die schwere Zeit',
      sub: 'Einige Wochen später',
      body:
        'Mamas Diagnose. Krakau steht bevor.<br>Alles fühlt sich zu viel an.<br><br>' +
        'Er hat mehr Gefühle als du gerade haben kannst.<br>' +
        'Eine Beziehung fühlt sich wie eine Last an.<br><br>' +
        '<em>Dienstags läuft „Die Höhle der Löwen".<br>Keiner schaut mehr.</em><br><br>' +
        'Was sagst du ihm?',
      options: [
        { id: 'breakup', emoji: '💔', text: '"Ich kann das gerade nicht..."', correct: true },
        { id: 'stay', emoji: '💪', text: '"Lass uns das zusammen durchstehen"', end: 'shortcut' },
        { id: 'fade', emoji: '👻', text: 'Einfach weniger schreiben...', end: 'fade' }
      ]
    },
    letters: {
      title: 'Drei Briefe',
      sub: 'Du öffnest das Paket...',
      body:
        '<strong>Brief 1:</strong> <em>„Ich mag dich wahnsinnig gern. Ich verstehe die Situation. ' +
        'Wenn du dasselbe fühlst — öffne Brief 2. Wenn nicht — öffne Brief 3. Kein Druck."</em><br><br>' +
        '📩 Vor dir liegen zwei Umschläge...',
      options: [
        { id: 'letter2', emoji: '🌹', text: 'Brief 2 öffnen', correct: true },
        { id: 'letter3', emoji: '🍸', text: 'Brief 3 öffnen', end: 'martini' },
        { id: 'dont_open', emoji: '📦', text: 'Das Paket in die Ecke schieben. Nicht öffnen.', branch: 'horror_descent' }
      ]
    },
    reunion: {
      title: '4. Oktober 2016',
      sub: 'Indisches Restaurant · Bei ihr in der Nähe',
      body:
        'Wochen vergangen. Lange Gespräche. Heute Abend.<br><br>' +
        'Nach dem Essen — ihre Couch. Der Elefant im Raum.<br>' +
        'Stille. Er schaut dich an.<br><br><em>Was sagst du?</em>',
      options: [
        { id: 'try', emoji: '💜', text: '"Lass es uns versuchen."', correct: true },
        { id: 'time', emoji: '⏳', text: '"Ich brauche noch Zeit..."',
          toast: 'Nah dran — aber du hast es in Wahrheit gesagt! 💜' },
        { id: 'schmutz', emoji: '🐭', text: '"Komm her, Schmutz."', easter: 'schmutz', correct: true,
          toast: '😂💜 Maus + Schatz = Schmutz! Easter Egg gefunden!' }
      ]
    }
  };

  // ─── Branches (mini-sequences off the main path) ───────────
  // A branch is a flat array of scene-objects (same shape as `scenes`)
  // The engine plays them in order, then calls `showEnding(branch.endsAt)`.
  // Triggered when a choice has `branch: '<id>'` instead of `end:`.
  //
  // Each step here is its own narration/choice keyed in its own
  // sub-table below — keeps story.js navigable.
  var branches = {
    horror_descent: {
      endsAt: 'horror_final',
      // Engine ramps `horror-level-1/2/3` CSS classes & swaps music
      // as the player progresses through these scenes.
      scenes: [
        { type: 'narration', id: 'horror_d1', music: 'theme_horror_1', meta: { horrorLevel: 1 } },
        { type: 'narration', id: 'horror_d2', meta: { horrorLevel: 1 } },
        { type: 'choice',    id: 'horror_c1', music: 'theme_horror_2', meta: { horrorLevel: 2 } },
        { type: 'narration', id: 'horror_d3', meta: { horrorLevel: 2 } },
        { type: 'narration', id: 'horror_d4', meta: { horrorLevel: 2 } },
        { type: 'choice',    id: 'horror_c2', music: 'theme_horror_3', meta: { horrorLevel: 3 } },
        { type: 'narration', id: 'horror_d5', meta: { horrorLevel: 3 } },
        { type: 'narration', id: 'horror_d6', music: 'theme_horror_end', meta: { horrorLevel: 3 } },
        { type: 'choice',    id: 'horror_c3', meta: { horrorLevel: 3 } }
      ]
    }
  };

  // ─── Horror-descent content (King-style, progressive) ──────
  // Stage 1: Unease. Small things wrong. You explain them away.
  // Stage 2: Dread. Patterns. The blue jacket. The signature.
  // Stage 3: Terror. He's been here. He's still here.
  var horrorScenes = {
    horror_d1: {
      title: 'Tag 1 nach dem Paket',
      sub: 'Du hast es in den Schrank gestellt. Hinter die Mäntel.',
      body:
        'Du hast Brief 1 gelesen und nicht weitergemacht. Klingt vernünftig.<br>' +
        'Du machst dir Tee. Du schaust aus dem Fenster.<br><br>' +
        'Draußen — Berliner Hinterhof. Mülltonnen. Die Birke. Alles normal.<br>' +
        'Bis du den Mann in der blauen Jacke an der Mülltonne siehst.<br>' +
        'Er steht da. Bewegt sich nicht.<br>' +
        '<em>Er schaut nicht zu dir hoch. Er schaut nicht weg. Er schaut einfach.</em><br><br>' +
        'Du blinzelst. Er ist weg.<br>' +
        'Du redest dir ein, du hättest dich getäuscht.<br>' +
        'Du redest dir das fast überzeugend ein.',
      btnEmoji: '🪟', btnText: 'Vorhang zuziehen'
    },
    horror_d2: {
      title: 'Tag 3',
      sub: 'Die Rose im Schrank',
      body:
        'In der Nacht wachst du auf. Du weißt nicht, wovon.<br>' +
        'Die Wohnung ist still. Zu still.<br>' +
        'Du schaltest die Nachttischlampe an. Sie flackert. Glühbirne.<br><br>' +
        'Du gehst in die Küche. Glas Wasser.<br>' +
        'Auf dem Weg zurück — der Schrank im Flur steht einen Spalt offen.<br>' +
        'Du erinnerst dich, ihn zugemacht zu haben.<br>' +
        '<em>Du erinnerst dich genau.</em><br><br>' +
        'Du schließt ihn. Hart.<br>' +
        'Aus dem Schrank — durch das Holz, durch die Mäntel —<br>' +
        'der Geruch einer Rose.<br>' +
        'Eine einzelne, perfekt geöffnete Rose. Im Karton. Den du nicht geöffnet hast.<br><br>' +
        'Du gehst zurück ins Bett. Du schläfst nicht mehr.',
      btnEmoji: '🌑', btnText: 'Liegen bleiben'
    },
    horror_c1: {
      title: 'Tag 5',
      sub: 'Du musst etwas tun.',
      body:
        'Du hast nicht mehr richtig geschlafen.<br>' +
        'Du hast Tom nicht geschrieben — wozu auch, ihr seid getrennt.<br>' +
        'Im Treppenhaus jeden Tag — der gleiche Hermes-Aufkleber an deiner Tür.<br>' +
        'Du reißt ihn ab. Am nächsten Morgen ist er wieder da.<br><br>' +
        '<em>Was tust du?</em>',
      options: [
        { id: 'call_tom',  emoji: '📞', text: 'Tom anrufen — er weiß, was im Paket war.' },
        { id: 'open_pkg',  emoji: '📦', text: 'Das Paket jetzt öffnen. Brief 2 lesen.' },
        { id: 'leave_apt', emoji: '🚪', text: 'Aus der Wohnung gehen. Nicht zurückkommen.' }
      ]
    },
    horror_d3: {
      title: 'Tag 5 · später',
      sub: 'Egal was du gewählt hast — er ist schneller.',
      body:
        'Du greifst zum Handy. Akku: 14%. Es lädt nicht.<br>' +
        'Du steckst es um. Andere Steckdose. Lädt nicht.<br>' +
        'Du schaltest es aus. An. Akku jetzt: 9%.<br><br>' +
        'Du öffnest die Wohnungstür.<br>' +
        'Auf der Fußmatte: ein neues Paket. Größer.<br>' +
        'Kein Versandetikett. Nur dein Vorname.<br>' +
        'In der gleichen Handschrift wie das erste.<br>' +
        '<em>Aber jetzt: ein zweiter Vorname darunter.</em><br>' +
        '„<strong>Tom.</strong>"',
      btnEmoji: '📦', btnText: 'Reintragen'
    },
    horror_d4: {
      title: 'Tag 5 · Nacht',
      sub: 'Du sitzt vor zwei Paketen. Eines offen. Eines nicht.',
      body:
        'Im ersten Paket — die Rose. Längst verblüht. Schwarz.<br>' +
        'Im zweiten Paket — ein Polaroid.<br>' +
        'Tom. Schlafend. In seinem eigenen Bett. Aus der Perspektive über ihm.<br><br>' +
        'Auf der Rückseite, in derselben Handschrift:<br>' +
        '„<em>Er hört es nicht mehr, wenn die Tür aufgeht.<br>' +
        'Aber du wirst es hören, wenn deine aufgeht.</em>"<br><br>' +
        'Du schreibst Tom. Sofort. „Bist du okay?"<br>' +
        'Drei Punkte. Tom tippt.<br>' +
        '<em>Tippt seit drei Stunden.</em>',
      btnEmoji: '📱', btnText: 'Anrufen'
    },
    horror_c2: {
      title: 'Tag 6 · 3:17 Uhr',
      sub: 'Du hörst es. Du hast es schon eine Weile gehört, ohne hinzuhören.',
      body:
        'Unter dem Bett. Ein Kratzen. Sehr langsam. Sehr leise.<br>' +
        'Als hätte jemand Zeit. Sehr viel Zeit.<br><br>' +
        'Dein Handy: <strong>0%</strong>. Aus.<br>' +
        'Im Flur — der Hermes-Aufkleber. Größer. Auf Augenhöhe jetzt.<br>' +
        'Darüber, mit Filzstift: „<em>NACHLIEFERUNG. PERSÖNLICH.</em>"<br><br>' +
        'Du stehst am Bett. Du atmest nicht.<br>' +
        'Das Kratzen hört auf, als ob es weiß, dass du zuhörst.<br><br>' +
        'Was tust du?',
      options: [
        { id: 'look_under', emoji: '🔦', text: 'Unter das Bett leuchten.' },
        { id: 'run_door',   emoji: '🏃‍♀️', text: 'Aus der Wohnung rennen.' },
        { id: 'mirror',     emoji: '🪞', text: 'In den Flurspiegel schauen.' }
      ]
    },
    horror_d5: {
      title: 'Was du siehst',
      sub: 'Spielt keine Rolle was du gewählt hast.',
      body:
        'Du siehst dich selbst.<br>' +
        'Aber dein Spiegelbild trägt eine blaue Regenjacke.<br>' +
        'Und es lächelt — bevor du es tust.<br><br>' +
        '<em>„Hallo Vicky", sagt es.<br>' +
        '„Ich hab dir gesagt, du hättest öffnen sollen."</em><br><br>' +
        'Es hebt die Hand. Du hebst deine nicht.<br>' +
        'Es tritt einen Schritt aus dem Spiegel.<br>' +
        'Du trittst keinen zurück. Du kannst nicht.<br><br>' +
        '„<em>Ich habe nichts gegen dich. Wirklich nicht.<br>' +
        'Aber ich habe etwas gegen die, die nicht öffnen.</em>"',
      btnEmoji: '🩸', btnText: 'Weiter'
    },
    horror_d6: {
      title: 'Tag 7',
      sub: 'Tom wird am nächsten Tag bei dir klingeln.',
      body:
        'Er wird klingeln. Niemand wird aufmachen.<br>' +
        'Er wird den Vermieter anrufen. Polizei. Den Schlüsseldienst.<br><br>' +
        'In der Wohnung — alles wie immer.<br>' +
        'Tee auf dem Tisch. Noch lauwarm.<br>' +
        'Im Schrank — die Rose. Frisch. Als hätte man sie heute geschnitten.<br>' +
        'Auf dem Küchentisch ein dritter Brief, den du nicht geschrieben hast:<br><br>' +
        '„<em>Tom — sie hat sich entschieden.<br>' +
        'Sie kommt nicht zurück. Mach dir keine Sorgen.<br>' +
        'Sie ist in besten Händen.</em>"<br><br>' +
        'Unterzeichnet: <strong>Lukas</strong>.<br>' +
        'Daneben: ein Hermes-Aufkleber.',
      btnEmoji: '⚫', btnText: 'Letzte Wahl'
    },
    horror_c3: {
      title: 'Wie endet es?',
      sub: 'Drei Versionen. Eine ist wahr. Du wirst nie erfahren welche.',
      body: '<em>Wähle den Albtraum, der am ehesten dir gehört.</em>',
      options: [
        { id: 'h_her',    emoji: '🪞', text: 'Die andere Vicky',     end: 'horror_her' },
        { id: 'h_him',    emoji: '🌹', text: 'Der Rosengarten',      end: 'horror_him' },
        { id: 'h_serial', emoji: '🟦', text: 'Paket 15',             end: 'horror_serial' }
      ]
    }
  };


  var endings = {
    'true': {
      icon: '💍', title: 'Das wahre Ende',
      body:
        'Mount Fuji, Japan — ein Kniefall.<br>' +
        '19.10.2024 — Standesamt Treptow.<br>' +
        '06.06.2025 — Die große Feier.<br><br>' +
        'Alles begann mit einem Superlike.<br>' +
        'Alles führte hierher.<br><br>' +
        '<em>Für immer dein, Schmutz. ♥</em>'
    },
    nope: {
      icon: '🐱', title: 'Alternative Timeline',
      body:
        'Du hast 3x genopted.<br><br>' +
        'In diesem Universum adoptierst du<br>drei Katzen namens „Hätte", „Wäre" und „Wenn".<br><br>' +
        'Du wirst Stammkundin beim Tierarzt.<br>' +
        'Tom adoptiert irgendwann einen Beagle und nennt ihn Schmutz.<br>' +
        '<em>(Aber das erfährst du nie.)</em><br><br>' +
        'Sie kuscheln gut. Aber nicht so gut wie Tom.',
      sub: 'Ending: Crazy Cat Lady'
    },
    wrong_prince: {
      icon: '👑', title: 'Der falsche Prinz',
      body:
        'Du hast „like" gedrückt.<br>' +
        'Drei Wochen später sitzt du in einem Restaurant,<br>' +
        'das viel zu teuer ist, mit jemandem, der viel zu wenig zuhört.<br><br>' +
        '<em>„Erzähl mir von dir!"</em> — und dann redet er 47 Minuten über sich.<br>' +
        'Du nickst. Du lächelst. Du denkst an gar nichts mehr.<br><br>' +
        'Sechs Monate. Zwei kurze Beziehungen. Ein verschollenes Pulli.<br>' +
        'Du löschst Tinder.<br><br>' +
        'Auf einer anderen Timeline koppelt jemand sein Handy mit dem AUX-Kabel<br>' +
        'und „Human" von Rag\'n\'Bone Man läuft.<br>' +
        'Du erinnerst dich an niemanden.<br>' +
        '<strong>(Aber jemand erinnert sich an dich.)</strong>',
      sub: 'Ending: Falscher Profil-Swipe'
    },
    ghost: {
      icon: '👻', title: 'Ghosted',
      body:
        'Du hast nie geantwortet. „...". Drei Punkte. Mehr nicht.<br><br>' +
        'Tom wartet zwei Tage. Drei. Eine Woche.<br>' +
        'Er schreibt nochmal: <em>„Hey, alles okay bei dir? Kein Stress wenn nicht."</em><br>' +
        'Du liest es. Du tippst. Du löschst.<br><br>' +
        'Nach einem Monat löscht Tom die App.<br>' +
        'Er fängt mit Hobbygärtnerei an — weil seine Tante gesagt hat:<br>' +
        '„Was zu pflegen hilft beim Loslassen."<br><br>' +
        'Drei Jahre später gewinnen seine Tomaten den Berliner Hinterhof-Preis.<br>' +
        'In der Berliner Morgenpost ist ein kleines Foto. Du blätterst drüber.<br>' +
        '<em>Du erkennst ihn nicht ganz.</em><br><br>' +
        'Du fragst dich manchmal, was gewesen wäre.<br>' +
        'Aber „manchmal" wird mit den Jahren immer seltener.',
      sub: 'Ending: Der Gärtner von Berlin'
    },
    creep: {
      icon: '🚫', title: 'Report & Block',
      body:
        '„Netflix bei dir?" — beim ersten Treffen.<br>' +
        'Tom liest es. Schreibt nichts. Screenshot.<br><br>' +
        'Drei Stunden später öffnest du Tinder.<br>' +
        '<em>„Dein Profil wurde gemeldet."</em><br>' +
        'Du wurdest geblockt. Vom Algorithmus. Von Tom. Von der Welt.<br><br>' +
        'Du erstellst ein neues Profil. Andere Stadt.<br>' +
        'Die ersten drei Matches: alle sagen dasselbe.<br>' +
        '<em>„Hey, du kommst mir bekannt vor..."</em><br><br>' +
        'Selbst der Algorithmus ist enttäuscht.<br>' +
        'Selbst Tinder hat ein Gedächtnis.',
      sub: 'Ending: Banned from Love'
    },
    short_date: {
      icon: '☕', title: 'Nur ein Brunch',
      body:
        'Das Date war nett. Wirklich nett.<br>' +
        'Du gehst nach Hause. Lächelst noch.<br><br>' +
        'Tom schreibt am Abend: <em>„War richtig schön heute 🙂"</em><br>' +
        'Du antwortest am nächsten Tag. Nett.<br>' +
        'Er fragt nach einem zweiten Date. Du sagst „bald".<br>' +
        'Aus „bald" wird nichts.<br><br>' +
        'Drei Monate später machst du eine Liste:<br>' +
        '<em>Gründe, warum es nicht passt</em>.<br>' +
        'Sie ist kurz. Aber sie reicht dir.<br><br>' +
        'Manchmal reicht „nett" einfach nicht.<br>' +
        'Manchmal aber doch — und du merkst es erst zu spät.',
      sub: 'Ending: Ein Brunch zu wenig'
    },
    shortcut: {
      icon: '⏩', title: 'Die Abkürzung',
      body:
        'Ihr bliebt zusammen — ohne Pause, ohne Briefe.<br>' +
        'Du hast nicht aufgehört zu schreiben, als alles schwer wurde.<br>' +
        'Er hat nicht losgelassen.<br><br>' +
        'Es funktioniert. Irgendwie.<br>' +
        'Aber die Geschichte ist weniger episch.<br>' +
        'Keine drei Briefe. Keine Rose. Kein Lukas in blauer Jacke.<br>' +
        'Keine 14 Tage, in denen ihr beide nicht schlafen konntet.<br>' +
        'Kein „4. Oktober" im Kalender, der für immer markiert wurde.<br><br>' +
        'Ihr seid glücklich. 92%.<br>' +
        'Die fehlenden 8% — du merkst sie nur in stillen Momenten.<br><br>' +
        'Manchmal braucht Liebe den Umweg.',
      sub: 'Ending: Der direkte Weg (gut, aber anders)'
    },
    fade: {
      icon: '📵', title: 'Slow Fade',
      body:
        'Erst wurden die Nachrichten kürzer.<br>' +
        'Dann seltener.<br>Dann gar keine mehr.<br><br>' +
        'Tom hat ein paar Mal nachgefragt. Höflich. Dann nicht mehr.<br>' +
        'Er hat es verstanden. Irgendwann.<br>' +
        'Kein Drama, kein Knall.<br>Nur Stille.<br><br>' +
        '2 Jahre später ist sein Profil weg.<br>' +
        'Du gibst seinen Namen bei Instagram ein — nichts. Bei Facebook — nichts.<br>' +
        '<em>Er hat sich verabschiedet. Von allem. Aus Schmerz oder Stolz, du weißt es nicht.</em><br><br>' +
        '5 Jahre später siehst du sein Hochzeitsfoto auf einem geteilten Post einer Freundin.<br>' +
        'Er steht da, schwarzer Anzug, lacht mit dem Mund, nicht mit den Augen.<br>' +
        'Mit jemand anderem. Sie sieht nett aus.<br>' +
        'Du schließt das Handy.',
      sub: 'Ending: Was wäre wenn...'
    },
    martini: {
      icon: '🍸', title: 'Martini Bianco',
      body:
        'Du öffnest Brief 3. Du wusstest schon vor dem Aufreißen, dass es vorbei ist.<br><br>' +
        'Eine Flasche Martini Bianco. Eine kleine, sehr saubere Handschrift:<br>' +
        '„<em>Danke für alles. Ich verstehe deine Entscheidung.<br>' +
        'Du musst mich nie wieder kontaktieren. Wirklich nicht.<br>' +
        'Aber falls doch — meine Nummer ist die alte.</em>"<br><br>' +
        'Du trinkst ein Glas. Allein. Dann zwei.<br>' +
        'Du tippst seine Nummer ins Handy.<br>' +
        'Du löschst sie wieder.<br>' +
        'Du tippst sie wieder. Du legst das Handy weg.<br><br>' +
        'Am nächsten Morgen ist die Flasche leer.<br>' +
        'Du hast nie angerufen. Du wirst nie anrufen.<br><br>' +
        '<em>...aber das ist nicht, was wirklich passierte, oder? 🌹</em>',
      sub: 'Ending: Die falsche Tür'
    },
    horror: {
      title: '📦 Das Paket',
      sub: '3:17 Uhr. Ein Geräusch unter dem Bett.',
      body:
        'Du hast den Karton unter das Bett geschoben. Ungeöffnet.<br><br>' +
        'Nachts. Kratzen. Etwas bewegt sich.<br>' +
        'Die Rose — sie wächst durch den Karton. Dornen überall.<br><br>' +
        'Dein Handy leuchtet auf. Eine Nachricht:<br>' +
        '„<em>Du hättest öffnen sollen.</em>"<br><br>' +
        'Absender: <strong>Hermes-Lieferant Lukas</strong> 🟦<br><br>' +
        'Wer steckt dahinter?',
      options: [
        { id: 'horror_her', emoji: '🔪', text: 'Du drehst dich um. Im Spiegel — dein Lächeln. Aber du lächelst nicht.', end: 'horror_her' },
        { id: 'horror_him', emoji: '🌹', text: 'Die Dornen formen Buchstaben: „F Ü R I M M E R"', end: 'horror_him' },
        { id: 'horror_serial', emoji: '🟦', text: 'Lukas war nie bei Hermes. Und ihr seid nicht seine ersten.', end: 'horror_serial' }
      ]
    },
    horror_her: {
      icon: '🪞', title: 'Die andere Vicky',
      body:
        'Du stehst auf. Der Spiegel zeigt dich — aber falsch herum.<br>' +
        'Dein Spiegelbild hebt die Hand. Du nicht.<br><br>' +
        '„<em>Ich bin die Version, die Brief 2 geöffnet hat.</em>"<br><br>' +
        'Sie tritt aus dem Spiegel. Barfuß. Lächelnd.<br>' +
        '„<em>Es kann nur eine von uns glücklich sein.</em>"<br><br>' +
        'Du rennst. Die Wohnung hat keine Türen mehr.<br>' +
        'Nur Spiegel. Überall Spiegel.<br><br>' +
        'Am nächsten Morgen findet Tom dich am Küchentisch.<br>' +
        'Du lächelst. Aber deine Augen... sind falsch herum.',
      sub: 'Ending: Spiegelwelt'
    },
    horror_him: {
      icon: '🌹', title: 'Der Rosengarten',
      body:
        'Die Rose wächst. Und wächst. Und wächst.<br>' +
        'Durch die Wände. Durch die Decke.<br><br>' +
        'Toms Stimme, überall gleichzeitig:<br>' +
        '„<em>Ich hab gesagt ich lass dich nicht los.<br>Ich hab\'s so gemeint.</em>"<br><br>' +
        'Die ganze Wohnung ist ein Rosengarten.<br>' +
        'Wunderschön. Und die Dornen — überall.<br><br>' +
        'Du versuchst die Tür zu öffnen.<br>' +
        'Hinter der Tür: mehr Rosen. Sein Lächeln.<br>' +
        'Immer sein Lächeln.<br><br>' +
        '„<em>Drei Briefe. Drei Chancen. Du hattest deine.</em>"',
      sub: 'Ending: Für immer sein 🌹'
    },
    horror_serial: {
      icon: '🟦', title: 'Der Mann in Blau',
      body:
        'Lukas. Blaue Regenjacke. iPad zum Unterschreiben.<br>' +
        'Das war nie ein iPad.<br><br>' +
        'Die Polizei findet 14 „Pakete" in ganz Berlin.<br>' +
        'Alle gleich: Drei Briefe. Eine Rose. Eine Flasche.<br>' +
        'Alle Empfängerinnen — verschwunden.<br><br>' +
        'Du googlest „Hermes Lieferant blaue Jacke Berlin".<br>' +
        '847 Ergebnisse. Alle gelöscht. Bis auf eins:<br><br>' +
        'Ein Foto. Verschwommen. Eine Klingel.<br>' +
        '<strong>Deine Klingel.</strong><br><br>' +
        'Es klingelt.',
      sub: 'Ending: Paket 15'
    },
    hero: {
      icon: '🦸', title: 'Origin Story',
      body:
        'Du springst in die Spree.<br>Das Wasser ist eiskalt. Der Schwan... ist sauer.<br><br>' +
        'Er beißt dir in den Finger. Du schreist.<br>' +
        'Tom springt hinterher — natürlich.<br><br>' +
        'Bild-Zeitung, nächster Tag:<br>' +
        '<em>„SCHWAN-RETTERIN VON BERLIN:<br>Pärchen rettet aggressiven Schwan mit bloßen Händen!"</em><br><br>' +
        'Ihr werdet zu lokalen Helden. Die Feuerwehr überreicht euch einen Orden.<br>' +
        'Der Schwan heißt jetzt „Schmutz II".<br><br>' +
        'Nicht das kanonische Ende — aber auf jeden Fall episch. 🦢💪',
      sub: 'Ending: Die Schwanflüsterer von Kreuzberg'
    },

    // ─── Matrix branch (red pill) ────────────────────────────
    // Branching ending: walks through 3 reveal-screens then ends.
    matrix_enter: {
      title: '> WAKE_UP.exe',
      sub: 'Verbindung wird hergestellt...',
      body:
        '<span style="font-family:monospace">' +
        '> root@matrix:~$ <strong>./reveal --user=vicky</strong><br>' +
        '> Lade Speicherauszug...<br>' +
        '> Tom_Schneider.npc → Status: <strong>SCRIPTED</strong><br>' +
        '> Beziehungs-Engine: <strong>love_story_v3.7</strong><br>' +
        '> Build-Hash: 19-10-2024-06-06-2025<br><br>' +
        '> ⚠ Alle Entscheidungen sind vorab determiniert.<br>' +
        '> ⚠ Das „Superlike" war ein Trigger-Event.<br>' +
        '> ⚠ Du bist NPC #00410.<br><br>' +
        '> Wie weit willst du gehen?</span>',
      options: [
        { id: 'see_code', emoji: '👁️', text: 'Den Quellcode sehen', end: 'matrix_code' },
        { id: 'meet_arch', emoji: '🏛️', text: 'Den Architekten treffen', end: 'matrix_arch' },
        { id: 'go_back', emoji: '🔄', text: 'Zurück in die Simulation', end: 'matrix_return' }
      ]
    },
    matrix_code: {
      icon: '💾', title: 'Der Quellcode',
      body:
        '<span style="font-family:monospace;font-size:0.78rem">' +
        '/* love_story_v3.7 */<br>' +
        'class Vicky extends NPC {<br>' +
        '&nbsp;&nbsp;onMatch(tom) {<br>' +
        '&nbsp;&nbsp;&nbsp;&nbsp;this.feelings += Infinity;<br>' +
        '&nbsp;&nbsp;&nbsp;&nbsp;return await marry(tom);<br>' +
        '&nbsp;&nbsp;}<br>' +
        '&nbsp;&nbsp;easterEgg = "Schmutz";<br>' +
        '&nbsp;&nbsp;weakness = "Hiccups";<br>' +
        '&nbsp;&nbsp;runtime = "forever";<br>' +
        '}</span><br><br>' +
        'Du scrollst durch dein eigenes Leben in Zeilen Code.<br>' +
        'Jeder Kuss, jede Hochzeitsrede — ein Funktionsaufruf.<br><br>' +
        '<em>Aber: die Gefühle?<br>Die sind kein Bug. Die sind ein Feature.</em><br><br>' +
        '> SYSTEM: Liebe ≠ Illusion.<br>' +
        '> SYSTEM: Code kann echt sein.',
      sub: 'Ending: 0% Bug, 100% Feature'
    },
    matrix_arch: {
      icon: '🏛️', title: 'Der Architekt',
      body:
        'Ein weißer Raum. Unendlich viele Bildschirme.<br>' +
        'Auf jedem: eine Version eurer Geschichte.<br><br>' +
        '<em>„Ich habe diese Welt gebaut", sagt der Architekt.<br>' +
        '„14.847.291 Iterationen. In nur einer einzigen<br>' +
        'habt ihr es bis zum 06.06.2025 geschafft."</em><br><br>' +
        'Du schaust auf die Bildschirme.<br>' +
        'In den meisten — Stille. Ghost. Brief 3.<br>' +
        'In einem — Mount Fuji. Kniefall.<br><br>' +
        '<em>„Wisst ihr was das Verrückte ist?", lächelt er.<br>' +
        '„Eure ist die einzige, die ich nicht geschrieben habe.<br>' +
        'Die habt ihr selbst gemacht."</em>',
      sub: 'Ending: 1 von 14 Millionen'
    },
    matrix_return: {
      icon: '🌅', title: 'Wieder in der S-Bahn',
      body:
        'Du blinzelst. Der Mann im Anzug ist weg.<br>' +
        'Die Pille... war da überhaupt eine Pille?<br><br>' +
        'Dein Handy vibriert. Tom:<br>' +
        '„Bist du gut zuhause angekommen? 🙂"<br><br>' +
        'Du tippst zurück: „Ja. Alles real."<br>' +
        'Drückst senden.<br><br>' +
        'Manchmal ist das beste Update —<br>' +
        '<em>einfach dranbleiben.</em><br><br>' +
        '<strong>SIMULATION RESUMED →</strong><br>' +
        '<span style="font-size:0.75rem;color:var(--gray)">(Du landest in der wahren Timeline. Das Mount-Fuji-Foto wartet auf dich.)</span>',
      sub: 'Ending: Reality Confirmed'
    }
  };

  return Object.freeze({
    scenes: scenes,
    profiles: profiles,
    chats: chats,
    cameras: cameras,
    narrations: narrations,
    choices: choices,
    endings: endings,
    titleVariants: titleVariants,
    branches: branches,
    horrorScenes: horrorScenes,
  });
})();
