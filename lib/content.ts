// Everything the site says, in one place. Facts come from Daniel's resume; keep them that way.

export type Diagram = "payments" | "escrow";

export type CaseStudy = {
  slug: string;
  title: string;
  /** One line for the list on the home page. */
  blurb: string;
  role: string;
  org: string;
  when: string;
  /** What kind of work, beside it on the home page ("Internship", "Founder"). */
  kind: string;
  stack: string[];
  /** Short figures shown as labels ("10,000+ users"). */
  figures: string[];
  problem: string[];
  approach: string[];
  built: string[];
  results: string[];
  diagram?: Diagram;
  /** A note shown above the write-up (proprietary work, a demo on the way). */
  note?: string;
};

export type Job = {
  role: string;
  org: string;
  where: string;
  when: string;
  points: string[];
};

export const PERSON = {
  name: "Daniel Silva",
  intro:
    "Computer science at Northeastern University. I build systems that move money: payment engines, escrow, and marketplaces.",
  school: "Northeastern University, Khoury College of Computer Sciences",
  degree: "B.S. Computer Science, expected April 2029",
  place: "Boston, MA",
  links: {
    github: "https://github.com/danibapsilva",
    linkedin: "https://linkedin.com/in/danibapsilva",
    email: "silva.d4@northeastern.edu",
    resume: "/resume.pdf",
  },
};

export const WORK: CaseStudy[] = [
  {
    slug: "payment-engine",
    title: "ISO 8583 payment processing engine",
    blurb: "Real-time authorization and batch clearing for four card networks, built from scratch in Java 21.",
    role: "Software Engineering Intern",
    org: "PayNways Worldwide",
    when: "Jun to Sep 2026",
    kind: "Internship",
    stack: ["Java 21", "WildFly", "MySQL", "Redis", "LMAX Disruptor", "ISO 8583"],
    figures: ["~12 to 15 ms warm round trips", "50M+ transactions/day target", "4 card networks"],
    note: "This is proprietary work, so the write-up stays at the level of architecture. No code is shown.",
    problem: [
      "A card payment touches two very different paths. Authorization has to answer in milliseconds while the customer waits at the terminal. Clearing and settlement happen later, in batches, as files exchanged with each network.",
      "Mastercard, Visa, American Express, and Discover each speak their own dialect of ISO 8583 on the wire and their own file formats in batch. The engine had to handle all of them, reject bad messages early, never process the same transaction twice, and keep working when a dependency slowed down.",
    ],
    approach: [
      "Authorization runs as a pipeline of small stages on the LMAX Disruptor: parse the ISO 8583 message, validate it in layers, check for duplicates in Redis, apply the transaction rules, and route it to the right network adapter. Each stage does one thing, so the hot path stays short and easy to measure.",
      "Transaction rules live in MySQL instead of code, so they can change at runtime without a redeploy. Each network gets an adapter that owns its wire format and its batch files, which keeps network quirks out of the core pipeline.",
    ],
    built: [
      "Real-time authorization and batch clearing and settlement, end to end, for Mastercard, Visa, American Express, and Discover.",
      "Each network's wire and file formats: CIS/IPM, VIP/BASE II, GCAG/GFSG, and Authorization/Sales Data.",
      "Multi-layer validation, Redis duplicate detection, and graceful degradation when a dependency is slow or down.",
      "Configurable, database-driven transaction rules that update at runtime without redeploying.",
    ],
    results: [
      "A transaction pipeline benchmarked toward about 12 to 15 ms warm round trips.",
      "Designed for 50M+ transactions per day.",
    ],
    diagram: "payments",
  },
  {
    slug: "escrow",
    title: "Autonomous escrow and blockchain platform",
    blurb: "Automated crypto escrow for online communities: $1M+ secured for 10,000+ users.",
    role: "Founder and full-stack developer",
    org: "Independent",
    when: "Oct 2024 to present",
    kind: "Founder",
    stack: ["Python", "Web3.py", "MongoDB", "AWS EC2", "AWS S3", "Discord"],
    figures: ["$1M+ secured", "10,000+ users", "BTC, ETH, USDT and more"],
    note: "Live demo coming soon: a public version running on crypto testnets, where anyone can try a trade end to end.",
    problem: [
      "Trades between strangers in online communities run on trust, and trust breaks: one side pays and the other disappears. Human middlemen help, but they're slow, they sleep, and they can be impersonated.",
      "The goal was an escrow that holds the funds itself, checks every payment on-chain, and releases or refunds by clear rules, so neither side has to trust the other or a person in the middle.",
    ],
    approach: [
      "Each deal is a small state machine run from Discord: the buyer and seller agree on terms, the buyer pays into an escrow wallet, the platform verifies the deposit on-chain, and the funds are released to the seller or refunded to the buyer.",
      "Hot wallets for each chain receive and send the funds. Every step is validated and logged to MongoDB, with fraud checks before money moves, and the services run on AWS.",
    ],
    built: [
      "Automated escrow serving 10,000+ users across multiple online communities.",
      "Blockchain hot wallets for BTC, ETH, USDT, and more, with payment validation and fraud prevention.",
      "MongoDB and AWS infrastructure for logging and automation.",
    ],
    results: ["$1M+ in secured crypto transactions.", "10,000+ users across multiple communities."],
    diagram: "escrow",
  },
  {
    slug: "brawlmart",
    title: "BrawlMart digital marketplace",
    blurb: "A marketplace for in-game services on the web and Discord, with Stripe payments and automated delivery.",
    role: "Founder and operator",
    org: "BrawlMart",
    when: "Jul 2023 to present",
    kind: "Founder",
    stack: ["Next.js", "Discord.py", "Stripe"],
    figures: ["15,000+ users", "Web and Discord", "Stripe payments"],
    problem: [
      "Players buying in-game services were doing it through scattered direct messages, with no clear prices, no payment protection, and no record of what was promised.",
    ],
    approach: [
      "One marketplace in two places: a Next.js site for browsing and ordering, and Discord for the community, where most customers already were. Stripe handles payment, and orders are delivered automatically once they're paid.",
    ],
    built: [
      "A full-stack marketplace for in-game services across the web and Discord.",
      "A Next.js platform for browsing, ordering, and fulfillment, with Stripe payments and automated order delivery.",
      "The operations behind it, including disputes and customer support.",
    ],
    results: ["15,000+ users across web and Discord."],
  },
  {
    slug: "orbit",
    title: "Orbit",
    blurb: "My own phone app: school, job search, and money in one place, run by a pipeline on AWS.",
    role: "Personal project",
    org: "Personal",
    when: "2026",
    kind: "Personal",
    stack: ["Next.js (PWA)", "TypeScript", "Python", "AWS EC2", "Playwright", "Plaid", "Claude"],
    figures: ["Next.js PWA", "Python pipeline on EC2", "Obsidian vault as the database"],
    problem: [
      "School deadlines, grades, job applications, and money were spread across Canvas, Gradescope, email, job sites, and bank apps. Keeping up meant checking all of them, every day.",
    ],
    approach: [
      "Everything lands in one place I already use: my Obsidian vault. A Python pipeline on AWS EC2 pulls from each source into notes and JSON, and a Next.js PWA on my phone reads and edits the vault directly.",
    ],
    built: [
      "School deadlines, and my grade in each class worked out from the syllabus plus Canvas and Gradescope.",
      "A job-application tracker with browser-automated applying (Playwright, Workday and Greenhouse), where nothing is submitted until I approve it.",
      "Money through Plaid, and Claude-powered briefings and news.",
    ],
    results: ["Runs on its own: morning and evening jobs on EC2, plus a sync every few minutes."],
  },
];

export const EXPERIENCE: Job[] = [
  {
    role: "Software Engineering Intern",
    org: "PayNways Worldwide",
    where: "New Jersey (hybrid)",
    when: "Jun to Sep 2026",
    points: [
      "Built an ISO 8583 payment processing engine in Java 21 from scratch: real-time authorization and batch clearing and settlement for Mastercard, Visa, American Express, and Discover.",
      "Implemented each network's wire and file formats with multi-layer validation, Redis duplicate detection, and graceful degradation.",
      "Engineered database-driven transaction rules that update at runtime without redeploying, in a pipeline benchmarked toward ~12 to 15 ms warm round trips and 50M+ transactions/day.",
    ],
  },
  {
    role: "CS Enrichment Program Participant",
    org: "Google Code Next Connect Lab",
    where: "Remote and NYC",
    when: "Sep 2023 to Mar 2024",
    points: [
      "Selected for Google's Code Next Connect Lab for emerging computer science students: hands-on software development, problem solving, and mentorship with Google engineers.",
    ],
  },
  {
    role: "Data Analytics and Recruiting Intern",
    org: "Snakorpio Recruiting & Consulting",
    where: "Remote and NJ",
    when: "Jul to Nov 2022",
    points: [
      "Automated recruiting workflows with Excel VBA macros, cutting manual data entry.",
      "Managed 200+ candidates and produced analytics to support hiring decisions.",
    ],
  },
];

export const SKILLS = [
  { label: "Languages", items: "Java, Python, C++, C#, TypeScript, JavaScript, SQL, x86/x64 assembly" },
  { label: "Frameworks", items: "React, Next.js, Node.js, Express, Tailwind, Discord.py" },
  { label: "Data and cloud", items: "MySQL, MongoDB, Redis, AWS (EC2, S3), Firebase" },
  { label: "Systems", items: "Windows internals, reverse engineering (Ghidra, IDA Pro, x64dbg), Linux, Docker" },
];
