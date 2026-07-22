export const manufacturingMeta = {
  title: "Window and Door Manufacturing Software • WinDoor Quote",
  description:
    "Based in Omaha, Nebraska, WDQ provides cloud based software for window, door, screen, and partition manufacturers.",
} as const;

export const manufacturingHero = {
  title: "Window and Door Manufacturing Software",
  body: "Based in Omaha, Nebraska, WDQ provides cloud based software for window, door, screen, and partition manufacturers. WDQ is a fast, reliable, flexible, and intuitive system that will help your company increase sales and process those sales more accurately and efficiently.",
  cta: "Learn More",
  image: "/images/manufacturing/hero-illustration.png",
} as const;

export const manufacturingPartners = [
  {
    name: "Mondo Manufacturing",
    src: "/images/manufacturing/partner-mondo.png",
  },
  {
    name: "FlexScreen",
    src: "/images/manufacturing/partner-flexscreen.png",
  },
  {
    name: "EnerLux Windows & Doors",
    src: "/images/manufacturing/partner-enerlux.png",
  },
  {
    name: "CDW California Deluxe Windows",
    src: "/images/manufacturing/partner-cdw.png",
  },
] as const;

export const manufacturingOneApp = {
  title: "Manage everything with one app",
  body: "Save time and nerves by managing all parts of your business from just one app! We are constantly updating and modifying our software and there is a lot more upcoming features!",
  image: "/images/manufacturing/one-app-illustration.png",
  cards: [
    {
      title: "ALL-IN ONE SOFTWARE",
      body: "Manage, sell, cut, ship, track, review, stats, and many more with WDQ!",
      icon: "layers" as const,
    },
    {
      title: "Upcoming Features",
      body: "All new features will be available free for you through software update!",
      icon: "spark" as const,
    },
  ],
} as const;

export const manufacturingCutOnce = {
  title: "With WDQ, you will cut only once!",
  body: "With our precise software you will be able to adjust all the desired parameters and you will never have to cut more than once. Save on time and raw materials!",
  image: "/images/manufacturing/cut-once-illustration.png",
  cards: [
    {
      title: "SET ALL PARAMETERS",
      body: "Set height, width, length, depht and many other parameters to ensure that you will get a clean cut!",
      icon: "sliders" as const,
    },
    {
      title: "SAVE TIME AND MONEY",
      body: "Stop loosing time and money on wrong cuts! With WDQ you will have 100% success rate and cut only once!",
      icon: "check" as const,
    },
  ],
} as const;

export const manufacturingVideosCta = {
  title: "Learn more about our software?",
  body: "Click on the button below and check 10+ video demos about using our software in first hand.",
  cta: "CHECK VIDEOS",
  href: "/#demos",
} as const;

export const manufacturingContactCta = {
  title: "Intrested in more details?",
  body: "Feel free to contact our team using the Contact Form. We will answer your question within 24 hours.",
  cta: "CONTACT US",
  href: "/#contactus",
  phoneImage: "/images/manufacturing/phone-cta.png",
} as const;
