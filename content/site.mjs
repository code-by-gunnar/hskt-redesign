import { readFileSync } from "node:fs";
export const archive = JSON.parse(
  readFileSync(new URL("./source/site-audit.json", import.meta.url), "utf8"),
);
export const services = JSON.parse(
  readFileSync(
    new URL("./source/legacy-services.json", import.meta.url),
    "utf8",
  ),
);
export const site = {
  name: "HSKT Chiropractic",
  fullName: "Head Shoulders Knees and Toes Chiropractic",
  booking: "https://headshoulderskneesandtoeschiropractic.janeapp.co.uk/",
  phone: "020 3326 9386",
  telephone: "+442033269386",
  email: "info@hsktchiropractic.co.uk",
  address: "4C St Michaels Terrace, London N22 7SJ",
  directions:
    "https://www.google.com/maps/search/?api=1&query=4C+St+Michaels+Terrace+London+N22+7SJ",
  colours: { green: "#1E3D33", cream: "#F7F3EB", peach: "#EED8C1" },
  prices: [
    {
      name: "Initial consultation",
      price: 75,
      durationMinutes: 60,
      description:
        "A comprehensive initial assessment including case history, physical examination, and treatment.",
    },
    {
      name: "Follow-up treatment",
      price: 55,
      durationMinutes: 20,
      description:
        "Standard follow-up appointment focusing on your tailored treatment plan.",
    },
    {
      name: "Re-examination",
      price: 60,
      durationMinutes: 40,
      description:
        "For existing patients who have not attended for 6 months or more, or who are returning with a new or significantly different problem.",
    },
  ],
  hours: [
    ["Monday–Friday", "8am–8pm"],
    ["Saturday", "9am–2pm"],
    ["Sunday", "Closed"],
  ],
};
// Durations verified against the current Jane booking listing on 12 November 2026.
// Reuse the published policy sentence rather than maintaining a second cancellation rule.
export const cancellationSummary = archive["terms-and-conditions"].markdown
  .split(/\n/)
  .map((line) => line.replace(/^#+\s*/, "").trim())
  .find((line) => line.startsWith("Appointments cancelled with"));
if (!cancellationSummary)
  throw new Error("Cancellation policy summary not found in source content");
export const images = {
  logo: ["656d2f_ddaf1b11a8f7456f81c6e1ef0ac7a3f7~mv2.png", "logo.png"],
  hero: ["656d2f_b03d5b8ec68d4dc4af38444b73cebe50~mv2.jpeg", "hero.jpeg"],
  dan: ["656d2f_9308bf85eb2345459cd02389ab5cae3c~mv2.jpeg", "dan.jpeg"],
  treatment: [
    "656d2f_7187278b22d643509833b509ee1880e0~mv2.jpg",
    "treatment.jpg",
  ],
  mouse: ["656d2f_fb181905fbfe4f22b015f8208bed3d64~mv2.jpg", "mouse.jpg"],
  gcc: ["656d2f_4b715eb7affb454d8f71bf0f3dd92c7d~mv2.png", "gcc.png"],
  bca: ["656d2f_ffde0a6fa77a46ae8eadbfe10e08209a~mv2.jpg", "bca.jpg"],
  // Raster filenames predate the visual audit; keep their paths, correct their roles.
  back: ["656d2f_fd5348649a3c4ec985ac0a9b5990e458~mv2.png", "neck.png"],
  headache: ["656d2f_40ccb3c2454b4d06873745b80c383d01~mv2.png", "back.png"],
  // Null source IDs identify original inline Wix SVGs archived locally.
  neck: [null, "neck-pain.svg"],
  shoulder: [null, "shoulder-joint.svg"],
  sports: [null, "sports-injuries.svg"],
  mobility: [null, "mobility.svg"],
  registered: [
    "656d2f_b3dac7eb7aca4eefb42b26612b74e14b~mv2.jpg",
    "registered.jpg",
  ],
  inclusive: [
    "656d2f_4b3b79a7d69d42c78dfda9fee40bfe16~mv2.jpg",
    "inclusive.jpg",
  ],
  reviews: ["656d2f_a95e12f7d5a2435fb3cff81eadf5b8c3~mv2.jpg", "reviews.jpg"],
  rail: ["656d2f_fa9c48a634cd40369841bfedcef269e6~mv2.jpg", "rail.jpg"],
  bus: ["656d2f_78f154e5e56d472b826555ca00628431~mv2.jpg", "bus.jpg"],
};
export const treatments = [
  [
    "Neck pain",
    "Relieving tension and restoring mobility through evidence-based rehabilitation and patient-centred care.",
    "neck",
  ],
  [
    "Back pain & sciatica",
    "Chiropractic care can help with general, acute and chronic back pain. We also assess and provide care for people experiencing sciatica, with treatment tailored to your individual needs.",
    "back",
  ],
  [
    "Headaches & migraine prevention",
    "If your headaches are linked to your neck, chiropractic care may help. We can support people experiencing headaches arising from the neck (cervicogenic headaches), as well as those seeking chiropractic care as part of migraine prevention.",
    "headache",
  ],
  [
    "Shoulder & joint pain",
    "Chiropractic care can help with joint pains and shoulder complaints, including shoulder pain and dysfunction.",
    "shoulder",
  ],
  [
    "Minor sports injuries",
    "Chiropractic care can help with minor sports injuries, including strains, sprains and repetitive strain injuries.",
    "sports",
  ],
  [
    "Mobility & movement",
    "Improving your range of motion and overall movement quality through functional rehabilitation and care.",
    "mobility",
  ],
];
export const approach = [
  [
    "Assess",
    "We begin with a comprehensive assessment to understand your symptoms, movement, health history and individual goals.",
  ],
  [
    "Treat",
    "Our evidence-based treatments are tailored to your individual needs, helping you move and function at your best.",
  ],
  [
    "Rehab",
    "We provide personalised rehabilitation and movement advice to help you build strength, improve mobility and support long-term recovery.",
  ],
];
export const reviews = [
  [
    "Magda",
    "Highly recommend Dan. Professional, knowledgeable and very caring. My headaches and shoulder pain have improved so much since starting treatment.",
  ],
  [
    "Methilde",
    "Dan is brilliant at helping me with my tight painful neck and headaches. I usually just have to see him one time and it makes a HUGE difference. Not only is Dan a skilled chiropractor, but he is caring and makes you feel totally at ease.",
  ],
  [
    "Simo Casadei",
    "I went to see Danilo for a persistent neck pain that I had been struggling with for months. After a few sessions, the pain significantly reduced and my mobility improved. I felt listened to and well looked after throughout the process.",
  ],
];
export const faq = [
  [
    "What is chiropractic care?",
    "Chiropractic care focuses on the assessment and management of problems affecting the muscles, joints and nervous system. We use evidence-based treatment, movement and rehabilitation to help reduce pain, improve function and keep you moving.",
  ],
  [
    "How does a first visit work?",
    "Your first visit begins with a thorough consultation and assessment to understand your symptoms, health history and goals. We’ll explain our findings, discuss your options and create a personalised treatment and rehabilitation plan together.",
  ],
  [
    "Are you GCC registered?",
    "Yes. Our chiropractors are registered with the General Chiropractic Council (GCC), the UK regulator for chiropractic. This means we meet the professional standards required to practise chiropractic in the UK.",
  ],
  [
    "Where are you located?",
    "We are located at 4C St Michael’s Terrace, London N22 7SJ, just a 1-minute walk from Alexandra Palace station. Wood Green Underground station is around a 10-minute walk away, with convenient local bus connections.",
  ],
];
const faqSource = archive.faq.markdown.split("General")[1];
for (const chunk of faqSource.split(/- 0\d/).slice(1)) {
  const match = chunk.match(/### ([^\n]+)\s+([\s\S]*)/);
  if (match)
    faq.push([
      match[1].trim(),
      match[2]
        .split("[Book your first")[0]
        .trim()
        .replace(/\n{3,}/g, "\n\n"),
    ]);
}
export const neighbourhoods = [
  "Wood Green",
  "Alexandra Palace",
  "Muswell Hill",
  "Bounds Green",
  "Palmers Green",
  "Hornsey",
  "Crouch End",
  "Harringay",
  "Tottenham",
  "Southgate",
  "Winchmore Hill",
  "Highgate",
  "Archway",
  "Finchley",
  "Finsbury Park",
  "Surrounding areas",
];
