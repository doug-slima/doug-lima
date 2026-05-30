export type Section = "playground" | "selected-works";

export type Project = {
  name: string;
  label: string;
  logo: string;
  images: string[];
  hugLast?: boolean;
};

const PLAYGROUND = "/assets/playground-works";
const SELECTED = "/assets/selected-works";

export const craftProjects: Record<Section, Project[]> = {
  playground: [
    {
      name: "Agroprop",
      label: "brand",
      logo: `${PLAYGROUND}/Agroprop/agroprop-logo.png`,
      images: Array.from({ length: 12 }, (_, i) => `${PLAYGROUND}/Agroprop/agroprop-${i + 1}.png`),
    },
    {
      name: "LFC",
      label: "brand",
      logo: `${PLAYGROUND}/LFC/LFC-logo.png`,
      images: Array.from({ length: 14 }, (_, i) => `${PLAYGROUND}/LFC/LFC-${i + 1}.png`),
    },
    {
      name: "Proxy",
      label: "brand",
      logo: `${PLAYGROUND}/Proxy/proxy-logo.png`,
      images: Array.from({ length: 9 }, (_, i) => `${PLAYGROUND}/Proxy/proxy-${i + 1}.png`),
      hugLast: true,
    },
    {
      name: "Purple",
      label: "brand",
      logo: `${PLAYGROUND}/Purple/purple-logo.png`,
      images: Array.from({ length: 6 }, (_, i) => `${PLAYGROUND}/Purple/purple-${i + 1}.png`),
    },
  ],
  "selected-works": [
    {
      name: "Picking Handheld",
      label: "product",
      logo: `${SELECTED}/project-picking-handheld/mercado-livre-logo.png`,
      images: Array.from({ length: 9 }, (_, i) => `${SELECTED}/project-picking-handheld/handheld-${i + 1}.png`),
    },
    {
      name: "Checkin Desktop",
      label: "product",
      logo: `${SELECTED}/project-checkin-desktop/mercado-livre-logo.png`,
      images: Array.from({ length: 11 }, (_, i) => `${SELECTED}/project-checkin-desktop/checkin-${i + 1}.png`),
    },
  ],
};
