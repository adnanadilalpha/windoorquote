export const privacyMeta = {
  title: "Privacy Policy • WinDoor Quote",
  description:
    "How WinDoor Quote collects, uses, and protects personal information when you visit our website or use our apps and services.",
} as const;

export const privacyHero = {
  title: "Privacy Policy",
  body: "Thank you for visit our website. When you visit our website, you trust us with your personal information. We take your privacy very seriously.",
} as const;

export type PrivacyBlock =
  | { type: "p"; text: string }
  | {
      type: "plink";
      before: string;
      link: { href: string; label: string };
      after?: string;
    }
  | { type: "short"; text: string }
  | { type: "list"; items: string[] };

export const privacySections: {
  id: string;
  title?: string;
  blocks: PrivacyBlock[];
}[] = [
  {
    id: "intro",
    blocks: [
      {
        type: "p",
        text: "In this privacy policy, we seek to explain to you in the clearest way possible what information we collect, how we use it and what rights you have in relation to it. We hope you take some time to read through it carefully, as it is important. If there are any terms in this privacy policy that you do not agree with, please discontinue use of our Sites or Apps and our services.",
      },
    ],
  },
  {
    id: "disclose",
    title: "Personal information you disclose to us",
    blocks: [
      {
        type: "short",
        text: "We collect personal information that you provide to us such as name, address, contact information.",
      },
      {
        type: "p",
        text: "We collect personal information that you voluntarily provide to us when expressing an interest in obtaining information about us or our products and services, when participating in activities on the Services or Apps or otherwise contacting us.",
      },
      {
        type: "p",
        text: "The personal information that we collect depends on the context of your interactions with us and the Services or Apps, the choices you make and the products and features you use. The personal information we collect can include the following:",
      },
      {
        type: "p",
        text: "Publicly Available Personal Information. We collect first name, maiden name, last name, and nickname; ID; phone numbers; business email; business phone number; email addresses; and other similar data.",
      },
      {
        type: "p",
        text: "All personal information that you provide to us must be true, complete and accurate, and you must notify us of any changes to such personal information.",
      },
    ],
  },
  {
    id: "apps",
    title: "Information collected through our Apps",
    blocks: [
      {
        type: "short",
        text: "We may collect information regarding your geo-location, mobile device, push notifications, when you use our apps.",
      },
      {
        type: "p",
        text: "If you use our Apps, we may also collect the following information:",
      },
      {
        type: "list",
        items: [
          "Geo-Location Information. We may request access or permission to and track location-based information from your mobile device, either continuously or while you are using our mobile application, to provide location-based services. If you wish to change our access or permissions, you may do so in your device’s settings.",
          "Mobile Device Access. We may request access or permission to certain features from your mobile device, including your mobile device’s camera, sensors, storage, and other features. If you wish to change our access or permissions, you may do so in your device’s settings.",
          "Mobile Device Data. We may automatically collect device information (such as your mobile device ID, model and manufacturer), operating system, version information and IP address.",
          "Push Notifications. We may request to send you push notifications regarding your account or the mobile application. If you wish to opt-out from receiving these types of communications, you may turn them off in your device’s settings.",
        ],
      },
    ],
  },
  {
    id: "rights",
    title: "WHAT ARE YOUR PRIVACY RIGHTS?",
    blocks: [
      {
        type: "short",
        text: "You may review, change, or terminate your account at any time.",
      },
      {
        type: "plink",
        before:
          "If you are resident in the European Economic Area and you believe we are unlawfully processing your personal information, you also have the right to complain to your local data protection supervisory authority. You can find their contact details ",
        link: {
          href: "https://ec.europa.eu/info/law/law-topic/data-protection_en",
          label: "here",
        },
        after: ".",
      },
      {
        type: "plink",
        before:
          "Cookies and similar technologies: Most Web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove cookies and to reject cookies. If you choose to remove cookies or reject cookies, this could affect certain features or services of our Services or Apps. To opt-out of interest-based advertising by advertisers on our Services or Apps visit ",
        link: {
          href: "http://www.aboutads.info/choices/",
          label: "http://www.aboutads.info/choices/",
        },
        after: ".",
      },
    ],
  },
  {
    id: "review",
    title: "HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?",
    blocks: [
      {
        type: "p",
        text: "Based on the laws of some countries, you may have the right to request access to the personal information we collect from you, change that information, or delete it in some circumstances.",
      },
    ],
  },
];
