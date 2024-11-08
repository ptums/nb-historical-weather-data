import { SITE_DEFAULTS } from "@/lib/constants";

export const SiteTitle = () => (
  <h1 className="text-4xl mb-8 text-center font-['Comic_Sans_MS'] text-black">
    {SITE_DEFAULTS.title}
  </h1>
);
