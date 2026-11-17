const currentLang = localStorage.getItem('preferredLang') || 'en';

// ================= ইংরেজি ডেটা (৪টি কেস) =================
const CASES_EN = [
  // --- CASE 1: Original Case ---
  {
    number: 1,
    title: "The Silent Projector Incident",
    stamp: "Unsolved / Open",
    victim: "Orson Kestrel",
    maxScore: 130,
    intro: "You arrive at the old Rialto Theatre after a projection demonstration ends in a sudden blackout and a damaged projector.",
    victimNote: "Orson Kestrel was a wealthy heir and a longtime patron of the Rialto.",
    culprit: "elliot",
    correctMotive: "motive",
    motives: [
      { id: "motive", label: "Cover up stolen equipment before the endowment audit" },
      { id: "m-inherit", label: "Claim the theatre before the will was changed" },
      { id: "m-grudge", label: "Revenge for being passed over in the endowment speech" }
    ],
    scenes: [
      { id: "booth", name: "The projection booth", img: "assets/img/scene-booth.png", hotspots: [{ ev: "ev-reel", x: 42, y: 48 }, { ev: "ev-glass", x: 63, y: 66 }] },
      { id: "lobby", name: "The lobby", img: "assets/img/scene-lobby.png", hotspots: [ { ev: "ev-letter", x: 30, y: 52 } ] }
    ],
    evidence: {
      "ev-reel": { name: "Melted film reel", text: "The 35mm reel did not snap, it melted." },
      "ev-glass": { name: "Relay glass shards", text: "Fine glass shards sit under the relay board." },
      "ev-letter": { name: "Torn endowment letter", text: "A draft letter names a coming audit." }
    },
    suspects: [
      { id: "mara", name: "Mara Venn", role: "Theatre manager", img: "assets/img/p-mara.png", tie: "She managed the theatre.", alibi: "On stage welcoming guests.", qa: [{ q: "Where were you?", a: "On stage." }] },
      { id: "elliot", name: "Elliot Shaw", role: "House electrician", img: "assets/img/p-elliot.png", tie: "Maintained electrical systems.", alibi: "Checking dimmers.", qa: [{ q: "Where were you?", a: "Lobby dimmers." }, { q: "Why flip the breaker?", a: "I didn't." }] }
    ],
    timeline: [
      { time: "19:30", event: "Reception begins." },
      { time: "20:40", event: "The demonstration starts; blackout." }
    ],
    solution: "Elliot Shaw flipped the breaker and ripped the relay to stop the audit."
  },

  // --- CASE 2: The Lobby Theft ---
  {
    number: 2,
    title: "The Missing Ticket Money",
    stamp: "Unsolved / Open",
    victim: "Theatre Trust",
    maxScore: 60,
    intro: "The box office earnings from opening night have vanished from the lobby safe.",
    victimNote: "The theatre depends on these ticket sales to survive the winter.",
    culprit: "nell",
    correctMotive: "m-debt",
    motives: [
      { id: "m-debt", label: "To pay off personal debts" },
      { id: "m-protest", label: "To protest low wages" }
    ],
    scenes: [
      // নতুন ছবির লিংক বসানো হয়েছে
      { id: "lobby", name: "The lobby safe", img: "assets/img/scene-lobby-case2.png", hotspots: [ { ev: "ev-safe", x: 45, y: 60 } ] }
    ],
    evidence: {
      "ev-safe": { name: "Unlocked Safe", text: "There is no sign of forced entry. Someone used the combination code." }
    },
    suspects: [
      { id: "nell", name: "Nell Price", role: "Box office", img: "assets/img/p-nell.png", tie: "Handled ticket sales.", alibi: "Counting money alone.", qa: [{ q: "Who has the safe code?", a: "Only the manager and me." }] },
      { id: "tomas", name: "Tomas Reed", role: "Carpenter", img: "assets/img/p-tomas.png", tie: "Fixed the lobby doors.", alibi: "Working backstage.", qa: [{ q: "Were you in the lobby?", a: "Just passing through." }] }
    ],
    timeline: [ { time: "22:00", event: "Money placed in safe." }, { time: "22:30", event: "Safe found empty." } ],
    solution: "Nell Price used her combination to open the safe and take the money."
  },

  // --- CASE 3: The Sabotaged Scenery ---
  {
    number: 3,
    title: "The Falling Flat",
    stamp: "Unsolved / Open",
    victim: "Lead Actor",
    maxScore: 60,
    intro: "A heavy wooden scenery flat almost crushed the lead actor during rehearsal.",
    victimNote: "The actor is known for being very demanding.",
    culprit: "tomas",
    correctMotive: "m-anger",
    motives: [
      { id: "m-anger", label: "Angry about being insulted by the actor" },
      { id: "m-accident", label: "It was a mistake to claim insurance" }
    ],
    scenes: [
      // নতুন ছবির লিংক বসানো হয়েছে
      { id: "basement", name: "Backstage Store", img: "assets/img/scene-backstage-case3.png", hotspots: [ { ev: "ev-rope", x: 60, y: 30 } ] }
    ],
    evidence: {
      "ev-rope": { name: "Cut Rope", text: "The rope holding the scenery was cleanly cut with a knife, not broken by weight." }
    },
    suspects: [
      { id: "tomas", name: "Tomas Reed", role: "Carpenter", img: "assets/img/p-tomas.png", tie: "Built the scenery.", alibi: "On a break.", qa: [{ q: "Did you check the ropes?", a: "Yes, they were fine yesterday." }] },
      { id: "lena", name: "Lena Voss", role: "Lighting tech", img: "assets/img/p-lena.png", tie: "Rigged the lights above.", alibi: "In the control booth.", qa: [{ q: "Did you see anything?", a: "Too dark to see the ropes." }] }
    ],
    timeline: [ { time: "14:00", event: "Rehearsal starts." }, { time: "14:15", event: "Scenery falls." } ],
    solution: "Tomas cut the rope because he was tired of the actor's constant insults."
  },

  // --- CASE 4: The Poisoned Coffee ---
  {
    number: 4,
    title: "The Bitter Espresso",
    stamp: "Unsolved / Open",
    victim: "Mara Venn",
    maxScore: 60,
    intro: "Theatre Manager Mara Venn collapsed after drinking her evening espresso.",
    victimNote: "She had recently threatened to fire several staff members.",
    culprit: "ruth",
    correctMotive: "m-job",
    motives: [
      { id: "m-job", label: "To stop Mara from firing her" },
      { id: "m-money", label: "To steal the manager's bonus" }
    ],
    scenes: [
      // নতুন ছবির লিংক বসানো হয়েছে
      { id: "booth", name: "Manager's Desk", img: "assets/img/scene-office-case4.png", hotspots: [ { ev: "ev-cup", x: 50, y: 50 } ] }
    ],
    evidence: {
      "ev-cup": { name: "Coffee Cup", text: "Traces of a strong sleeping pill were found inside the cup." }
    },
    suspects: [
      { id: "ruth", name: "Ruth Bell", role: "Costume designer", img: "assets/img/p-ruth.png", tie: "Was facing termination.", alibi: "In the costume room.", qa: [{ q: "Did you bring the coffee?", a: "I just left it on the desk." }] },
      { id: "nell", name: "Nell Price", role: "Box office", img: "assets/img/p-nell.png", tie: "Handles petty cash.", alibi: "Selling tickets.", qa: [{ q: "Did you see Mara?", a: "Not since morning." }] }
    ],
    timeline: [ { time: "18:00", event: "Coffee delivered." }, { time: "18:10", event: "Mara collapses." } ],
    solution: "Ruth drugged the coffee to delay the meeting where she was going to be fired."
  }
];

// ================= বাংলা ডেটা (৪টি কেস) =================
const CASES_BN = [
  // --- CASE 1: Original Case ---
  {
    number: 1,
    title: "দ্য সাইলেন্ট প্রজেক্টর ইনসিডেন্ট",
    stamp: "মীমাংসিত নয় / উন্মুক্ত",
    victim: "অরসন কেস্ট্রেল",
    maxScore: 130,
    intro: "তুমি পুরোনো রিয়াল্টো থিয়েটারে এসে পৌঁছালে। একটু আগেই একটি ডেমোনস্ট্রেশন চলাকালীন হঠাৎ ব্ল্যাকআউট হয়ে প্রজেক্টরটি নষ্ট হয়ে যায়।",
    victimNote: "অরসন কেস্ট্রেল ছিলেন একজন ধনী উত্তরাধিকারী এবং রিয়াল্টোর দীর্ঘদিনের পৃষ্ঠপোষক।",
    culprit: "elliot",
    correctMotive: "motive",
    motives: [
      { id: "motive", label: "অডিটের আগে চুরি করা সরঞ্জামের বিষয়টি ধামাচাপা দেওয়া" },
      { id: "m-inherit", label: "উইল পরিবর্তন করার আগেই থিয়েটারের মালিকানা দাবি করা" },
      { id: "m-grudge", label: "ভাষণে তাকে এড়িয়ে যাওয়ার প্রতিশোধ" }
    ],
    scenes: [
      { id: "booth", name: "প্রজেকশন বুথ", img: "assets/img/scene-booth.png", hotspots: [{ ev: "ev-reel", x: 42, y: 48 }, { ev: "ev-glass", x: 63, y: 66 }] },
      { id: "lobby", name: "লবি", img: "assets/img/scene-lobby.png", hotspots: [ { ev: "ev-letter", x: 30, y: 52 } ] }
    ],
    evidence: {
      "ev-reel": { name: "গলিত ফিল্ম রিল", text: "৩৫ মিমি রিলটি ছেঁড়েনি, গলে গেছে।" },
      "ev-glass": { name: "রিলে গ্লাসের টুকরো", text: "রিলে বোর্ডের নিচে সূক্ষ্ম কাঁচের টুকরো পড়ে আছে।" },
      "ev-letter": { name: "ছেঁড়া চিঠি", text: "একটি খসড়া চিঠিতে অডিটের কথা বলা আছে।" }
    },
    suspects: [
      { id: "mara", name: "মারা ভেন", role: "ম্যানেজার", img: "assets/img/p-mara.png", tie: "থিয়েটার পরিচালনা করতেন।", alibi: "স্টেজে অতিথিদের স্বাগত জানাচ্ছিলেন।", qa: [{ q: "আপনি কোথায় ছিলেন?", a: "স্টেজে ছিলাম।" }] },
      { id: "elliot", name: "এলিয়ট শ", role: "ইলেকট্রিশিয়ান", img: "assets/img/p-elliot.png", tie: "ইলেকট্রিক্যাল সিস্টেম দেখতেন।", alibi: "লবির ডিমার চেক করছিলেন।", qa: [{ q: "আপনি কোথায় ছিলেন?", a: "লবির ডিমারের কাছে।" }, { q: "ব্রেকার বন্ধ করলেন কেন?", a: "আমি করিনি।" }] }
    ],
    timeline: [
      { time: "১৯:৩০", event: "রিসেপশন শুরু হয়।" },
      { time: "২০:৪০", event: "ডেমোনস্ট্রেশন শুরু হয়; ব্ল্যাকআউট।" }
    ],
    solution: "এলিয়ট ব্রেকার অফ করেছিল এবং অডিট থামানোর জন্য রিলে ভেঙে দিয়েছিল।"
  },

  // --- CASE 2: The Lobby Theft ---
  {
    number: 2,
    title: "টিকিটের টাকা চুরি",
    stamp: "মীমাংসিত নয় / উন্মুক্ত",
    victim: "থিয়েটার ফান্ড",
    maxScore: 60,
    intro: "উদ্বোধনী রাতের সব টিকিট বিক্রির টাকা লবির সিন্দুক থেকে গায়েব হয়ে গেছে।",
    victimNote: "শীতকাল পার করার জন্য থিয়েটারটি এই টাকার ওপর নির্ভরশীল।",
    culprit: "nell",
    correctMotive: "m-debt",
    motives: [
      { id: "m-debt", label: "নিজের ধারদেনা শোধ করার জন্য" },
      { id: "m-protest", label: "কম বেতনের প্রতিবাদ করতে" }
    ],
    scenes: [
      // নতুন ছবির লিংক বসানো হয়েছে
      { id: "lobby", name: "লবির সিন্দুক", img: "assets/img/scene-lobby-case2.png", hotspots: [ { ev: "ev-safe", x: 45, y: 60 } ] }
    ],
    evidence: {
      "ev-safe": { name: "খোলা সিন্দুক", text: "জোর করে খোলার কোনো দাগ নেই। কেউ পাসওয়ার্ড ব্যবহার করেছে।" }
    },
    suspects: [
      { id: "nell", name: "নেল প্রাইস", role: "বক্স অফিস", img: "assets/img/p-nell.png", tie: "টিকিট বিক্রি করতেন।", alibi: "একা বসে টাকা গুনছিলেন।", qa: [{ q: "সিন্দুকের কোড কে জানে?", a: "শুধু ম্যানেজার আর আমি।" }] },
      { id: "tomas", name: "টমাস রিড", role: "কার্পেন্টার", img: "assets/img/p-tomas.png", tie: "লবির দরজা ঠিক করেছিল।", alibi: "ব্যাকস্টেজে কাজ করছিল।", qa: [{ q: "তুমি কি লবিতে ছিলে?", a: "শুধু ওইদিক দিয়ে হেঁটে গিয়েছিলাম।" }] }
    ],
    timeline: [ { time: "২২:০০", event: "টাকা সিন্দুকে রাখা হয়।" }, { time: "২২:৩০", event: "সিন্দুক খালি পাওয়া যায়।" } ],
    solution: "নেল প্রাইস তার জানা পাসওয়ার্ড দিয়ে সিন্দুক খুলে টাকা নিয়েছিল।"
  },

  // --- CASE 3: The Sabotaged Scenery ---
  {
    number: 3,
    title: "পড়ন্ত সিনারি",
    stamp: "মীমাংসিত নয় / উন্মুক্ত",
    victim: "প্রধান অভিনেতা",
    maxScore: 60,
    intro: "রিহার্সালের সময় কাঠের তৈরি একটি ভারী সিনারি ভেঙে প্রায় প্রধান অভিনেতার গায়ের ওপর পড়েছিল।",
    victimNote: "এই অভিনেতার মেজাজ খুব খারাপ থাকার জন্য তিনি পরিচিত।",
    culprit: "tomas",
    correctMotive: "m-anger",
    motives: [
      { id: "m-anger", label: "অভিনেতার অপমানে রেগে গিয়ে" },
      { id: "m-accident", label: "ইন্স্যুরেন্স দাবি করার জন্য" }
    ],
    scenes: [
      // নতুন ছবির লিংক বসানো হয়েছে
      { id: "basement", name: "ব্যাকস্টেজ স্টোর", img: "assets/img/scene-backstage-case3.png", hotspots: [ { ev: "ev-rope", x: 60, y: 30 } ] }
    ],
    evidence: {
      "ev-rope": { name: "কাটা দড়ি", text: "সিনারিটি ধরে রাখা দড়িটি ভারে ছেঁড়েনি, বরং ধারালো ছুরি দিয়ে কাটা হয়েছে।" }
    },
    suspects: [
      { id: "tomas", name: "টমাস রিড", role: "কার্পেন্টার", img: "assets/img/p-tomas.png", tie: "সিনারিটি বানিয়েছিল।", alibi: "বিরতিতে ছিল।", qa: [{ q: "দড়িগুলো চেক করেছিলে?", a: "হ্যাঁ, গতকাল পর্যন্ত ঠিক ছিল।" }] },
      { id: "lena", name: "লিনা ভস", role: "লাইটিং টেকনিশিয়ান", img: "assets/img/p-lena.png", tie: "ওপরের লাইটগুলো লাগিয়েছিল।", alibi: "কন্ট্রোল বুথে ছিল।", qa: [{ q: "কিছু দেখেছিলে?", a: "অন্ধকার থাকায় দড়ি দেখা যায়নি।" }] }
    ],
    timeline: [ { time: "১৪:০০", event: "রিহার্সাল শুরু হয়।" }, { time: "১৪:১৫", event: "সিনারি ধসে পড়ে।" } ],
    solution: "অভিনেতার বাজে ব্যবহারে রেগে গিয়ে টমাস দড়ি কেটে দিয়েছিল।"
  },

  // --- CASE 4: The Poisoned Coffee ---
  {
    number: 4,
    title: "বিষাক্ত কফি",
    stamp: "মীমাংসিত নয় / উন্মুক্ত",
    victim: "মারা ভেন",
    maxScore: 60,
    intro: "থিয়েটার ম্যানেজার মারা ভেন তার বিকালের কফি খাওয়ার পর জ্ঞান হারিয়ে ফেলেন।",
    victimNote: "তিনি সম্প্রতি বেশ কয়েকজন স্টাফকে চাকরি থেকে বের করে দেওয়ার হুমকি দিয়েছিলেন।",
    culprit: "ruth",
    correctMotive: "m-job",
    motives: [
      { id: "m-job", label: "চাকরি থেকে বের করে দেওয়া আটকাতে" },
      { id: "m-money", label: "ম্যানেজারের বোনাস চুরি করতে" }
    ],
    scenes: [
      // নতুন ছবির লিংক বসানো হয়েছে
      { id: "booth", name: "ম্যানেজারের ডেস্ক", img: "assets/img/scene-office-case4.png", hotspots: [ { ev: "ev-cup", x: 50, y: 50 } ] }
    ],
    evidence: {
      "ev-cup": { name: "কফির কাপ", text: "কাপের ভেতর শক্তিশালী ঘুমের ওষুধের অস্তিত্ব পাওয়া গেছে।" }
    },
    suspects: [
      { id: "ruth", name: "রুথ বেল", role: "কস্টিউম ডিজাইনার", img: "assets/img/p-ruth.png", tie: "চাকরি হারানোর ভয়ে ছিল।", alibi: "কস্টিউম রুমে কাজ করছিল।", qa: [{ q: "কফি কি আপনি এনেছিলেন?", a: "আমি শুধু ডেস্কে রেখে এসেছিলাম।" }] },
      { id: "nell", name: "নেল প্রাইস", role: "বক্স অফিস", img: "assets/img/p-nell.png", tie: "ক্যাশের দায়িত্ব সামলায়।", alibi: "টিকিট বিক্রি করছিল।", qa: [{ q: "মারাকে দেখেছেন?", a: "সকাল থেকে দেখিনি।" }] }
    ],
    timeline: [ { time: "১৮:০০", event: "কফি দিয়ে আসা হয়।" }, { time: "১৮:১০", event: "মারা জ্ঞান হারায়।" } ],
    solution: "চাকরি থেকে বরখাস্ত করার মিটিংটি পেছানোর জন্য রুথ কফিতে ঘুমের ওষুধ মিশিয়েছিল।"
  }
];

// গেমটি CASES Array থেকে ডেটা নেবে
const CASES = (currentLang === 'bn') ? CASES_BN : CASES_EN;