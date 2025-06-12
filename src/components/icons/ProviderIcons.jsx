import React from "react";
import { Mail } from "lucide-react";

// Icônes SVG des providers
const GmailIcon = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      fill="#EA4335"
      d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"
    />
  </svg>
);

const OutlookIcon = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      fill="#0078D4"
      d="M24 7.875v10.569q0 .502-.335.837t-.837.335h-8.145v-5.212h5.212L24 7.875zm0-1.46l-4.104 6.528h-5.212V7.731l9.316-5.798v4.482zM13.788 2.86v7.083H6.144L.837 3.196Q.502 2.86 0 2.86t-.837.335Q-1.172 3.53-1.172 4.032v15.936q0 .502.335.837t.837.335h13.788V24h8.145q1.506 0 2.572-1.066t1.066-2.572V4.482q0-.418-.293-.711L14.499 2.149q-.293-.293-.711-.293z"
    />
  </svg>
);

const YahooIcon = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      fill="#6001D2"
      d="M18.86 1.56L14.27 11.87H19.4L24 1.56H18.86M0 6.71L5.15 18.27L3.3 22.44H7.83L14.69 6.71H10.15L7.37 13.3L4.52 6.71H0Z"
    />
  </svg>
);

// Icône par défaut pour les providers non reconnus
const DefaultMailIcon = ({ size = 32 }) => <Mail size={size} color="#666" />;

// Mapping des providers vers leurs icônes
const providerIconsMap = {
  gmail: GmailIcon,
  outlook: OutlookIcon,
  yahoo: YahooIcon,
  // Ajouter d'autres providers ici
};

// Composant principal qui retourne l'icône appropriée
export const ProviderIcon = ({ provider, size = 32 }) => {
  const IconComponent =
    providerIconsMap[provider?.toLowerCase()] || DefaultMailIcon;
  return <IconComponent size={size} />;
};

// Export des icônes individuelles si besoin
export { GmailIcon, OutlookIcon, YahooIcon, DefaultMailIcon };
