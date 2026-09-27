/*
  Career data for career.html. Source: resources/experience-education.md (LinkedIn, September 2026).

  Dates are "YYYY-MM" or "YYYY". `end: null` means "Present". Durations are calculated on the page,
  so they stay up to date (only when both dates have a month).

  Logo badge options:
    logoFit       "cover" fills the round badge (square logos), "contain" fits a wide logo inside it
    logoBg        colour behind the logo
    logoPosition  optional CSS object-position, e.g. "30% 50%" to choose which part of a wide logo shows
    logoScale     optional zoom, e.g. 1.15 to crop away a border

  Grouping: consecutive companies with the same `group` are drawn inside one shared card,
  with that group's note from `groups` below.
*/
window.CAREER = {
  groups: {
    family: { note: 'Part of the same family of companies.' },
  },

  experience: [
    {
      company: 'BiQ A/S - Better Data & Decision Quality',
      group: 'family',
      link: 'https://biq.dk/',
      logo: 'resources/logos/biq.jpg',
      logoFit: 'cover',
      logoBg: '#ffffff',
      roles: [
        { title: 'Senior Developer', type: 'Full-time', workplace: 'On-site', start: '2023-02', end: null, location: 'Copenhagen Metropolitan Area' },
      ],
    },
    {
      company: 'bdq a/s',
      group: 'family',
      logo: 'resources/logos/bdq.png',
      logoFit: 'contain',
      logoBg: '#16252e',
      roles: [
        { title: 'Senior Developer & Data Specialist', type: 'Full-time', start: '2021', end: null, location: 'Copenhagen Metropolitan Area' },
      ],
    },
    {
      company: 'iDQ A/S',
      group: 'family',
      logo: 'resources/logos/idq.png',
      logoFit: 'contain',
      logoBg: '#ffffff',
      roles: [
        { title: 'Senior Developer & Data Specialist', start: '2017-01', end: '2021-09', location: 'Copenhagen Area, Denmark' },
        { title: 'Chief Developer & IT Project Manager', start: '2012-01', end: '2017-01', location: 'Copenhagen Metropolitan Area' },
      ],
    },
    {
      company: 'DM Partner A/S',
      group: 'family',
      logo: 'resources/logos/dmpartner.gif',
      logoFit: 'contain',
      logoBg: '#ffffff',
      roles: [
        { title: 'Chief Developer and IT Project Manager', start: '2009-11', end: '2011-12' },
      ],
    },
    {
      company: 'mobilePeople Inc',
      logo: 'resources/logos/mobilepeople.jpg',
      logoFit: 'cover',
      logoBg: '#ffffff',
      roles: [
        { title: 'Senior Technical Product Manager', start: '2006-04', end: '2009-09' },
      ],
    },
    {
      company: 'Euman A/S',
      logo: 'resources/logos/euman.gif',
      logoFit: 'cover',
      logoBg: '#525a94',
      logoPosition: '28% 50%',
      logoScale: 1.12,
      roles: [
        { title: 'System Architect', start: '2000', end: '2006' },
      ],
    },
    {
      company: 'COWI',
      link: 'https://www.cowi.com/',
      logo: 'resources/logos/cowi.jpg',
      logoFit: 'cover',
      logoBg: '#efe1d6',
      roles: [
        { title: 'System Developer', start: '1997', end: '2000' },
      ],
    },
  ],

  // "Influential persons", shown below Education. A group with no people shows a "To be added" card.
  // links are shown at the bottom of each card and open in a new tab; the name links to the first one.
  influences: [
    {
      group: 'Teachers',
      people: [
        {
          name: 'Mark Seemann',
          role: 'Programmer, software architect and author',
          links: [
            { label: 'Blog', url: 'https://blog.ploeh.dk/' },
            { label: 'GitHub', url: 'https://github.com/ploeh' },
            { label: 'LinkedIn', url: 'https://www.linkedin.com/in/ploeh/' },
          ],
          text: 'An economist turned programmer from Copenhagen, and the author of two of the most practical books on software design: the Jolt Award-winning Dependency Injection in .NET and Code That Fits in Your Head (2021). He created the testing library AutoFixture, has blogged since 2006 and has given more than a hundred conference talks on test-driven development, functional programming and code that is simple enough to reason about. My best programming coach, by a large margin.',
        },
        {
          name: 'Ove Skovgaard',
          role: 'Professor emeritus, DTU (LAMF)',
          links: [
            { label: 'LinkedIn', url: 'https://www.linkedin.com/in/ove-skovgaard-b9006878/' },
          ],
          text: 'Taught mathematical modelling at the Laboratory of Applied Mathematical Physics (LAMF) at DTU, where he also supervised PhD students and researched nonlinear dynamics, such as solitons and chaos in dynamical systems. My favourite teacher during the M.Sc. in Computer Modelling.',
        },
      ],
    },
    {
      group: 'Heroes',
      people: [
        {
          name: 'John Carmack',
          role: 'Programmer, co-founder of id Software',
          links: [
            { label: 'X', url: 'https://x.com/ID_AA_Carmack' },
            { label: 'Keen Technologies', url: 'https://keenagi.com/' },
            { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/John_Carmack' },
          ],
          text: 'Co-founded id Software in 1991 and wrote the engines behind Commander Keen, Wolfenstein 3D, Doom and Quake, which defined real-time 3D graphics on the PC. He later built rockets at Armadillo Aerospace and was CTO of Oculus, and since 2022 he has worked on artificial general intelligence at Keen Technologies. He is also known for releasing his engines as open source.',
        },
        {
          name: 'Palmer Luckey',
          role: 'Inventor and entrepreneur',
          links: [
            { label: 'Blog', url: 'https://palmerluckey.com/' },
            { label: 'X', url: 'https://x.com/PalmerLuckey' },
            { label: 'Anduril', url: 'https://www.anduril.com/' },
          ],
          text: 'Built the first Oculus Rift prototypes as a teenager, launched the headset on Kickstarter in 2012 and sold Oculus to Facebook in 2014, which kick-started modern consumer VR. In 2017 he co-founded the defence technology company Anduril, and with ModRetro he makes new hardware for classic games.',
        },
        {
          name: 'Andrej Karpathy',
          role: 'AI researcher and educator',
          links: [
            { label: 'Website', url: 'https://karpathy.ai/' },
            { label: 'GitHub', url: 'https://github.com/karpathy' },
            { label: 'X', url: 'https://x.com/karpathy' },
            { label: 'YouTube', url: 'https://www.youtube.com/@AndrejKarpathy' },
          ],
          text: 'A founding member of OpenAI and later Director of AI at Tesla, where he led the Autopilot vision team. He is also one of the best teachers in the field: the Stanford course CS231n, the Neural Networks: Zero to Hero videos and small, readable projects like nanoGPT have taught a generation how neural networks really work. He coined the term "vibe coding" in 2025, and in May 2026 he joined Anthropic to lead a pre-training research team.',
        },
      ],
    },
  ],

  // The dotted stretch between education and the first job.
  gap: { start: '1995', end: '1997', label: 'From DTU to the first job' },

  education: [
    {
      school: 'DTU - Technical University of Denmark',
      link: 'https://www.dtu.dk/',
      logo: 'resources/logos/dtu.jpg',
      logoFit: 'cover',
      logoBg: '#9a0000',
      degree: 'M.Sc., Computer Modelling',
      start: '1989',
      end: '1995',
    },
    {
      school: 'Kildegaard Gymnasium',
      note: 'Today Kildegård Privatskole, Hellerup',
      link: 'https://kildegaard.dk/',
      logo: 'resources/logos/kildegaard.png',
      logoFit: 'contain',
      logoBg: '#ffffff',
      start: '1976',
      end: '1989',
    },
  ],
};
