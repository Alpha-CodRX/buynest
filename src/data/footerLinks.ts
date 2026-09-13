import { FooterSection } from "@/types/footer";

export const footerLinks: FooterSection[] = [
  {
    title: "About",
    links: [
      { title: "About Us", href: "/about" },
      { title: "Careers", href: "/careers" },
      { title: "Contact", href: "/contact" },
    ],
  },

  {
    title: "Help",
    links: [
      { title: "FAQ", href: "/faq" },
      { title: "Shipping", href: "/shipping" },
      { title: "Returns", href: "/returns" },
    ],
  },

  {
    title: "Policy",
    links: [
      { title: "Privacy Policy", href: "/privacy" },
      { title: "Terms", href: "/terms" },
      { title: "Refund Policy", href: "/refund" },
    ],
  },
];