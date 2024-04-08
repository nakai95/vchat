export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "vchat",
  description: "You can start 1on1 video chat without registering an account.",
  pages: {
    home: "/",
    host: "/rooms/host",
    guest: "/rooms/guest",
  },
  links: {
    profile: "https://github.com/nakai95",
    github: "https://github.com/nakai95/vchat",
  },
};
