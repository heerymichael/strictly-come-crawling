/* ============================================================
   Strictly Come Crawling — programme data
   Source: Aleks Salkin, NECKroNODmicon (28 days) and
           The Crawlidays Challenge 2.0 (30 days)
   ============================================================ */

const NECK = {
  title: "NECKroNODmicon",
  videos: {
    1: "https://youtu.be/OeHzHeJ2P5k",
    2: "https://youtu.be/gblm7uH0cHY",
    3: "https://youtu.be/P2FYiffsE7g",
    4: "https://youtu.be/13sz1dKCDYc"
  },
  phases: {
    1: "The Foundation",
    2: "The Ground Floor",
    3: "The Master's Chambers",
    4: "The Peak"
  },
  technique: [
    "Stay relaxed",
    "Keep breathing, never hold your breath",
    "Lead with your eyes: look where you are about to turn before your head follows"
  ],
  tempos: {
    1: { label: "Natural speed", short: "Natural" },
    2: { label: "Natural speed", short: "Natural" },
    3: { label: "Slow", short: "Slow" },
    4: { label: "Slow", short: "Slow" },
    5: { label: "Pause for 1 slow breath in and out at each position", short: "Pause" }
  },
  // Build the 20 days (4 weeks x 5 days)
  days: (function () {
    const full = { a1: 30, a2: "15 each side", b1: 30, b2: "15 each side" };
    const pause = { a1: 10, a2: "5 each side", b1: 10, b2: "5 each side" };

    function wk(week, oddPos, evenPos, b1Name, b2Name, img) {
      const out = [];
      for (let d = 1; d <= 5; d++) {
        const odd = d % 2 === 1;
        const pos = odd ? oddPos : evenPos;
        const r = (d === 5) ? pause : full;
        out.push({
          week, day: d,
          tempo: NECK_TEMPO(d),
          exercises: [
            { id: "A1", name: pos + ", up and down", reps: r.a1, img: odd ? img.oddUD : img.evenUD },
            { id: "A2", name: pos + ", over each shoulder", reps: r.a2, img: odd ? img.oddOS : img.evenOS },
            { id: "B1", name: b1Name, reps: r.b1, img: img.b1 },
            { id: "B2", name: b2Name, reps: r.b2, img: img.b2 }
          ]
        });
      }
      return out;
    }
    function NECK_TEMPO(d) {
      return ({1:"natural",2:"natural",3:"slow",4:"slow",5:"pause"})[d];
    }

    const w1 = wk(1, "Bottom of rocking position", "Rocked forward position",
      "Chin tucks (head remains on floor)", "Supine neck rotations (head remains on floor)",
      { oddUD: "n-rockback-ud", oddOS: "n-rockback-os", evenUD: "n-rockfwd-ud", evenOS: "n-rockfwd-os", b1: "n-tuck-floor", b2: "n-rot-floor" });
    const w2 = wk(2, "Sphinx position", "Pushup position",
      "Chin tucks (lift head slightly off floor)", "Supine neck rotations (chin tucked, head on floor)",
      { oddUD: "n-sphinx-ud", oddOS: "n-sphinx-os", evenUD: "n-pushup-ud", evenOS: "n-pushup-os", b1: "n-tuck-slight", b2: "n-rot-tucked" });
    const w3 = wk(3, "Supine position", "Rocked forward commando position",
      "Chin tucks (lift head and look at belly button)", "Supine neck rotations (chin tucked to chest)",
      { oddUD: "n-prone-ud", oddOS: "n-prone-os", evenUD: "n-commando-ud", evenOS: "n-commando-os", b1: "n-tuck-full", b2: "n-rot-lifted" });

    const w4 = [];
    for (let d = 1; d <= 5; d++) {
      const p = d === 5;
      w4.push({
        week: 4, day: d, tempo: NECK_TEMPO(d),
        exercises: [
          { id: "A1", name: "Extra ROM, up and down", reps: p ? 10 : 20, img: "n-xrom-ud" },
          { id: "A2", name: "Extra ROM, side flexion", reps: p ? "10 each side" : "20 each side", img: "n-xrom-side" },
          { id: "B1", name: "Extra ROM, chin tucks (chin to chest)", reps: p ? 10 : 20, img: "n-xrom-tuck" },
          { id: "B2", name: "Prone neck rotations (on stomach, chin tucked)", reps: p ? "5 per side" : "10 per side", img: "n-rot-prone-x" },
          { id: "B3", name: "Supine neck rotations (on back, chin tucked)", reps: p ? "5 per side" : "10 per side", img: "n-rot-supine-x" }
        ]
      });
    }
    return [...w1, ...w2, ...w3, ...w4].map((d, i) => ({ ...d, n: i + 1 }));
  })()
};

const CRAWL = {
  title: "Crawlidays 2.0",
  goal: "Accumulate 10 minutes of crawling every day, in as many sets as you need.",
  warmup: [
    { id: "w1", name: "Crocodile breathing", reps: "1 minute", img: "w-croc" },
    { id: "w2", name: "Neck nods", reps: "10 up and down, 10 over each shoulder", img: "w-nods" },
    { id: "w3", name: "Segmental roll", reps: "5 each side upper body, 5 each side lower body", img: "w-roll" },
    { id: "w4", name: "Rocking", reps: "20 back and forth", img: "w-rock" },
    { id: "w5", name: "Dead bug", reps: "20 reps", img: "w-deadbug" }
  ],
  days: [
    { n: 1, img: "c01", title: "Baby crawl by the wall",
      note: "Hands and knees, shoulder and hip almost touching the wall. Touch the opposite hand to the opposite knee, then take a small, slow half-step forward. Work the length of the wall, turn round and repeat with the other side to the wall. Breathe.",
      rows: [["Baby crawl (near wall, knee tap, small steps)", "10 min total"]] },
    { n: 2, img: "c02", title: "Baby crawl in free space",
      note: "Away from the wall now. Keep the knee taps and small steps, and move slowly, like a cat sneaking up on something. Keep your head up.",
      rows: [["Baby crawl", "Without the wall, tap knees, accumulate 10 minutes"]] },
    { n: 3, img: "c03", title: "Going backward",
      note: "Add backward crawling. You can drop the knee taps after the first few steps. Keep the slow cadence.",
      rows: [["Baby crawl", "5 minutes backward, 5 minutes forward"]] },
    { n: 4, img: "c04", title: "Sideways baby crawl",
      note: "Tap the opposite knee for the first few steps until you get the rhythm. Opposite arm and leg still drive the movement.",
      rows: [["Baby crawl sideways", "Accumulate 10 minutes"]] },
    { n: 5, img: "c05", title: "Leopard crawl",
      note: "Knees lift about an inch off the ground and track inside the arms. Tiny steps, tap the opposite knee. Do these first while you are fresh. A wall beside you helps keep the hips steady.",
      rows: [["Leopard crawl forward", "5 to 10 steps (small steps)"], ["Baby crawl backward", "10 to 20 steps"], ["Baby crawl forward", "20 to 30 steps"]],
      repeat: "Repeat until you accumulate 10 minutes",
      levels: ["Just hold the static leopard crawl position", "Accumulate 5 to 10 leopard steps rather than all in a row", "Do the workout as written"] },
    { n: 6, img: "c06", title: "Leopard for time",
      note: "Leopard crawl for time, with baby crawl in between as active recovery.",
      rows: [["Leopard crawl", "1 minute"], ["Baby crawl", "2 minutes"]],
      repeat: "Repeat x3, then one more minute of baby crawl to reach 10 minutes",
      levels: ["Leopard crawl holds instead of the full crawl, baby crawl as below", "Take smaller leopard steps if need be", "Do the workout as written"] },
    { n: 7, img: "c07", title: "Back-off day",
      note: "No leopard crawls today. Forward, backward and sideways baby crawls only. Still 10 minutes.",
      rows: [["Baby crawls (all directions)", "Accumulate 10 minutes"]] },
    { n: 8, img: "c08", title: "Backward leopard crawl",
      note: "Test backward leopard crawls with smaller steps first. Bring the knee tap back for the first few steps.",
      rows: [["Leopard crawl backward", "5 to 10 steps"], ["Leopard crawl forward", "10 to 20 steps"], ["Baby crawl sideways", "20 to 30 steps"]],
      repeat: "Repeat until you have accumulated 10 minutes",
      levels: ["Small steps or single paces (one step, knee down, switch), otherwise leopard holds", "Accumulate 5 to 10 leopard steps rather than in a row", "Do the workout as written"] },
    { n: 9, img: "c09", title: "Test your mettle",
      note: "Alternate forward and backward leopard crawling, changing direction as you start to fatigue.",
      rows: [["Leopard crawl forward and backward", "As long as possible without resting"]],
      repeat: "Repeat until you accumulate 10 minutes",
      levels: ["Try a little leopard crawling, switch to baby crawls when it gets too hard", "Rest before switching direction, rest a little more before switching back", "Do the workout as written"] },
    { n: 10, img: "c10", title: "Sideways, knees up",
      note: "Sideways with the knees up is deceptively tough. Get your bearings on your knees first if you need to. Stay contralateral.",
      rows: [["Sideways crawl", "5 to 10 steps (left, then right)"], ["Leopard backward", "10 to 20 steps"], ["Leopard forward", "20 to 30 steps"]],
      repeat: "Repeat until you accumulate 10 minutes",
      levels: ["A step or two here and there, mostly sideways baby crawl", "Accumulate the steps for each variation before moving on", "Do the workout as written"] },
    { n: 11, img: "c11", title: "Sideways for time",
      note: "Sideways crawling sandwiched with other tough but manageable variations, all for time.",
      rows: [["Sideways", "2 minutes"], ["Leopard forward", "2 minutes"], ["Baby crawl", "2 minutes"], ["Sideways", "2 minutes"], ["Leopard backward", "2 minutes"]],
      levels: ["A few knees-off-the-ground steps where possible, otherwise baby crawls", "Accumulate the minutes listed for each variation", "Each crawl without rest (2 minutes straight)"] },
    { n: 12, img: "c12", title: "Spiderman crawl",
      note: "Like the leopard crawl but the knees track outside the elbows. Ease into it.",
      rows: [["Spiderman crawl forward", "5 to 10 steps"], ["Sideways crawl", "10 to 20 steps"], ["Baby crawl", "20 to 30 steps"]],
      repeat: "Repeat until you have accumulated 10 minutes",
      levels: ["A few small Spiderman steps for practice, then leopard or baby crawl", "Switch to accumulation sets when necessary", "Do the workout as written"] },
    { n: 13, img: "c13", title: "Ladder",
      note: "Start short, rest briefly, go longer, rest briefly, continue.",
      rows: [["Spiderman crawl forward", "1 minute, 2 minutes, 3 minutes"], ["Sideways crawl", "1 minute left, 1 minute right"], ["Baby crawl", "2 minutes"]],
      levels: ["Leopard crawls and slow baby crawls for the times listed, any direction", "Accumulate each time in as many sets as needed before moving on", "Do the workout as listed"] },
    { n: 14, img: "c14", title: "Baby crawl check-in",
      note: "Back to hands and knees to feel how much easier it is now. Mix directions. Aim for 10 minutes non-stop, or as few breaks as possible.",
      rows: [["Baby crawl", "Accumulate 10 minutes"]] },
    { n: 15, img: "c15", title: "Backward Spiderman",
      note: "Short amounts first before doing it for time.",
      rows: [["Spiderman backward", "5 to 10 steps"], ["Sideways", "10 to 20 steps (both directions)"], ["Spiderman forward", "20 to 30 steps"]],
      repeat: "Repeat until you accumulate 10 minutes",
      levels: ["Backward leopard with small or regular steps, or slow baby crawls", "When fatigued, accumulate the steps listed before moving on", "As listed, resting as much as necessary but as little as possible"] },
    { n: 16, img: "c16", title: "Shoulder builder",
      note: "Backward crawling for a protracted period is about the best there is for shoulder strength.",
      rows: [["Spiderman backward", "3 minutes"], ["Sideways (left)", "2 minutes"], ["Sideways (right)", "2 minutes"], ["Spiderman forward", "3 minutes"]],
      levels: ["3 minutes backward with leopard or baby crawls, same for sideways", "Accumulate 3 minutes backward in as many sets as needed, same for the others", "Do the workout as listed"] },
    { n: 17, img: "c17", title: "Straight-leg sideways crawl",
      note: "A big stability challenge for the core. Find your bearings rather than chasing a step count.",
      rows: [["Sideways, straight leg (left)", "Accumulate 2 minutes"], ["Sideways, straight leg (right)", "Accumulate 2 minutes"], ["Baby crawl", "2 minutes"], ["Leopard crawl", "Accumulate 2 minutes"], ["Baby crawl", "2 minutes"]],
      levels: ["Baby or bent-leg side crawls", "Switch to bent-leg crawls when necessary", "Do the workout as written"] },
    { n: 18, img: "c18", title: "Ladder, no baby crawl",
      note: "Backward Spiderman straight after straight-leg sideways, then forward leopard to rest the shoulders while the legs burn.",
      rows: [["Sideways, straight leg", "5 to 10 steps"], ["Spiderman backward", "10 to 20 steps"], ["Leopard forward", "20 to 30 steps"]],
      repeat: "Repeat until you have accumulated 10 minutes",
      levels: ["Bent-leg baby crawls or knees-up crawls, modify the leopard as needed", "Accumulate the steps before moving on to the next variation", "Do the workout as listed"] },
    { n: 19, img: "c19", title: "Pedal to the metal",
      note: "Alternate the challenging variations without a break, switching to the easier one when the difficulty bites.",
      rows: [["Sideways (straight leg) + forward Spiderman + backward leopard", "Transition between the three without rest until form begins to break down"]],
      repeat: "Repeat until you accumulate 10 minutes",
      levels: ["Alternate knees up and knees down as much as needed", "Bent-leg sideways before forward Spiderman if need be", "Do the workout as listed"] },
    { n: 20, img: "c20", title: "Sideways, five and five",
      note: "Work for tomorrow's break.",
      rows: [["Sideways crawl, straight leg", "Accumulate 5 minutes"], ["Sideways crawl, bent leg", "Accumulate 5 minutes"]],
      levels: ["Bent-leg sideways and sideways baby crawls for the time listed", "Accumulate the straight and bent-leg times", "Each 5 minutes all in one go"] },
    { n: 21, img: "c21", title: "Recovery crawl",
      note: "Baby crawls in all directions. Try baby Spiderman crawls too (knees outside the arms, knees on the ground). As few breaks as possible.",
      rows: [["Baby crawl", "Accumulate 10 minutes"]] },
    { n: 22, img: "c22", title: "Elbow crawl",
      note: "Forearms instead of hands. Tough.",
      rows: [["Elbow crawl", "Accumulate 2 minutes forward"], ["Spiderman crawl", "Accumulate 2 minutes forward"], ["Sideways crawl, straight leg", "1 minute left, 1 minute right"], ["Leopard crawl backward", "Accumulate 2 minutes"], ["Baby crawl", "2 minutes"]],
      levels: ["Forearms and knees", "Start with knees off the ground, most of the accumulation with knees down", "Do the workout as listed"] },
    { n: 23, img: "c23", title: "Backward elbow crawl",
      note: "Nastier than forward elbow crawls, and brilliant for pressing strength.",
      rows: [["Elbow crawl backward", "Accumulate 2 minutes"], ["Elbow crawl forward", "Accumulate 2 minutes"], ["Sideways, bent leg", "1 minute per side"], ["Sideways, straight leg", "1 minute per side"], ["Leopard crawl forward", "Accumulate 2 minutes"]],
      levels: ["Knees on the ground for the elbow crawls", "Alternate knees down and knees up elbow crawls", "Do the workout as listed"] },
    { n: 24, img: "c24", title: "Sideways elbow crawl",
      note: "Heart and lungs will be pounding.",
      rows: [["Elbow crawl sideways", "5 to 10 steps (left, then right)"], ["Spiderman backward", "10 to 20 steps"], ["Leopard forward", "20 to 30 steps"]],
      repeat: "Accumulate a total of 10 minutes",
      levels: ["Knees on the ground for the sideways elbow crawl", "Alternate knees up and down", "Do the workout as listed"] },
    { n: 25, img: "c25", title: "Axial crawl",
      note: "Crawl in a circle on the spot, as if a pole ran through your stomach into the floor.",
      rows: [["Axial", "Accumulate 3 minutes"], ["Baby", "3 minutes"], ["Leopard", "4 minutes"]],
      levels: ["Axial on hands and knees", "Alternate hands and knees and knees-up for the axial", "Do the workout as listed"] },
    { n: 26, img: "c26", title: "Axial ladder",
      note: "Rotations first, then backward and sideways crawls.",
      rows: [["Axial", "2 rotations clockwise, 2 counter-clockwise"], ["Spiderman backward", "10 to 20 steps"], ["Sideways, bent legs", "20 to 30 steps (both directions)"]],
      repeat: "Repeat until you have accumulated 10 minutes",
      levels: ["Use on-the-knees versions of each crawl as needed", "Alternate knees up and down for the axial, backward leopard if necessary", "Follow the workout as listed"] },
    { n: 27, img: "c27", title: "The toughest so far",
      note: "Long-duration axial crawling. Set a timer, time stands still.",
      rows: [["Axial", "Accumulate 5 minutes"], ["Spiderman + leopard, forward and backward", "Accumulate 5 minutes"]],
      levels: ["Knees-down axial, alternate knees up and down for the remainder", "Alternate knees up and knees down axial crawls", "Do the workout as written"] },
    { n: 28, img: "c28", title: "Active recovery",
      note: "All baby crawls.",
      rows: [["Baby crawl", "Accumulate 10 minutes"]] },
    { n: 29, img: "c29", title: "Axial on the elbows",
      note: "Only 1 minute in each direction on the elbows, then business as usual.",
      rows: [["Axial, elbows", "Accumulate 1 minute in each direction"], ["Axial, hands", "Accumulate 2 minutes in each direction"], ["Spiderman, forward and backward", "Accumulate 4 minutes"]],
      levels: ["Knees on the ground for the axial elbow crawls", "Knees-up axial elbow crawls at the start, mostly knees down", "Do the workout as listed"] },
    { n: 30, img: "c30", title: "The final",
      note: "Crawl for as long as you possibly can, using as many variations as you need. 10 full minutes non-stop is the goal.",
      rows: [["Axial crawl, elbows", "1.5 minutes"], ["Axial crawl, hands", "1.5 minutes"], ["Sideways, straight leg", "1.5 minutes"], ["Spiderman, forward and backward", "1.5 minutes"], ["Sideways, bent leg", "1.5 minutes"], ["Leopard, forward and backward", "1.5 minutes"], ["Baby crawl", "1 minute"]] }
  ]
};

const STRETCH = {
  title: "Neck stretches",
  url: "https://www.youtube.com/watch?v=T64es5lGZr8",
  embed: "https://www.youtube-nocookie.com/embed/T64es5lGZr8",
  note: "Follow along with the video. Do these at the end of a session, or later the same day."
};

const PRAISE = [
  "Fab-u-lous!",
  "Ten from Len!",
  "Keeeep crawling!",
  "That was a SEVEN... no, a TEN!",
  "The judges are on their feet!",
  "Straight through to next week!",
  "Glitterball form, darling.",
  "Not a foot wrong."
];
