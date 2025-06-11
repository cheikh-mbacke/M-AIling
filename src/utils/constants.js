export const EMAIL_STYLES = [
  { id: "professional", label: "Professionnel", icon: "💼", color: "#4f46e5" },
  { id: "friendly", label: "Amical", icon: "😊", color: "#06b6d4" },
  { id: "casual", label: "Familier", icon: "👋", color: "#10b981" },
  { id: "polite", label: "Poli", icon: "🎩", color: "#8b5cf6" },
  { id: "direct", label: "Direct", icon: "⚡", color: "#f59e0b" },
];

export const EMAIL_TEMPLATES = {
  professional: [
    {
      template: `Bonjour,
  
  J'espère que ce message vous trouve en bonne santé. Je me permets de vous contacter concernant {SUBJECT}.
  
  {DETAILS}
  
  Je serais reconnaissant si vous pouviez examiner cette demande et me faire part de votre retour.
  
  Dans l'attente de votre réponse, je vous prie d'agréer mes salutations distinguées.
  
  Cordialement,`,
      variables: ["SUBJECT", "DETAILS"],
    },
    {
      template: `Madame, Monsieur,
  
  Je vous écris pour vous informer de {SUBJECT}.
  
  {DETAILS}
  
  Votre expertise dans ce domaine serait grandement appréciée. Pourriez-vous, s'il vous plaît, prendre un moment pour considérer cette question ?
  
  Je reste à votre disposition pour tout complément d'information.
  
  Bien cordialement,`,
      variables: ["SUBJECT", "DETAILS"],
    },
    {
      template: `Bonjour,
  
  Suite à notre échange, je souhaiterais porter à votre attention {SUBJECT}.
  
  {DETAILS}
  
  Votre avis éclairé sur cette question me serait précieux. Seriez-vous disponible pour en discuter ?
  
  Je vous remercie par avance pour votre temps et votre considération.
  
  Très cordialement,`,
      variables: ["SUBJECT", "DETAILS"],
    },
  ],
  friendly: [
    {
      template: `Salut !
  
  J'espère que tu vas bien ! 😊
  
  Je voulais te parler de {SUBJECT}. {DETAILS}
  
  Ce serait super si tu pouvais jeter un œil et me dire ce que tu en penses !
  
  Merci d'avance et à bientôt !`,
      variables: ["SUBJECT", "DETAILS"],
    },
    {
      template: `Hello !
  
  Comment vas-tu ? J'ai pensé à toi concernant {SUBJECT}.
  
  {DETAILS}
  
  Tu aurais un moment pour qu'on en discute ? Ça me ferait vraiment plaisir d'avoir ton avis !
  
  Belle journée à toi !`,
      variables: ["SUBJECT", "DETAILS"],
    },
    {
      template: `Coucou !
  
  J'espère que tout roule pour toi ! 🌟
  
  Je me demandais si tu pourrais m'aider avec {SUBJECT}. {DETAILS}
  
  Ton aide serait vraiment la bienvenue 🙏
  
  Merci beaucoup et à très vite !`,
      variables: ["SUBJECT", "DETAILS"],
    },
  ],
  casual: [
    {
      template: `Salut,
  
  {SUBJECT} - {DETAILS}
  
  Tu peux checker ça quand tu as 5 min ? Pas urgent mais ce serait cool d'avoir ton retour.
  
  Merci !`,
      variables: ["SUBJECT", "DETAILS"],
    },
    {
      template: `Hey !
  
  Petite question rapide sur {SUBJECT}.
  
  {DETAILS}
  
  Tu peux me dire ce que t'en penses ?
  
  A+`,
      variables: ["SUBJECT", "DETAILS"],
    },
    {
      template: `Yo !
  
  {SUBJECT} - ça te dit quelque chose ?
  
  {DETAILS}
  
  J'aurais besoin de ton aide là-dessus.
  
  Thanks !`,
      variables: ["SUBJECT", "DETAILS"],
    },
  ],
  polite: [
    {
      template: `Bonjour,
  
  J'espère ne pas vous déranger. Auriez-vous l'amabilité de m'accorder quelques instants concernant {SUBJECT} ?
  
  {DETAILS}
  
  Je serais très reconnaissant de bénéficier de votre aide.
  
  En vous remerciant par avance, je vous souhaite une excellente journée.
  
  Respectueusement,`,
      variables: ["SUBJECT", "DETAILS"],
    },
    {
      template: `Cher/Chère collègue,
  
  Si vous me le permettez, j'aimerais solliciter votre avis sur {SUBJECT}.
  
  {DETAILS}
  
  Votre expertise serait d'une aide précieuse. Quand cela vous conviendrait-il ?
  
  Avec mes remerciements anticipés et mes meilleures salutations.`,
      variables: ["SUBJECT", "DETAILS"],
    },
    {
      template: `Bonjour,
  
  Puis-je me permettre de vous solliciter concernant {SUBJECT} ?
  
  {DETAILS}
  
  Je comprendrais parfaitement si vous n'aviez pas le temps, mais votre aide me serait très utile.
  
  Je vous remercie sincèrement pour votre considération.
  
  Très respectueusement,`,
      variables: ["SUBJECT", "DETAILS"],
    },
  ],
  direct: [
    {
      template: `Bonjour,
  
  {SUBJECT}
  
  {DETAILS}
  
  Besoin de votre retour rapide sur ce point.
  
  Merci.`,
      variables: ["SUBJECT", "DETAILS"],
    },
    {
      template: `Hello,
  
  Voici la situation : {SUBJECT}
  
  {DETAILS}
  
  Pouvez-vous traiter cela en priorité ?
  
  Cordialement,`,
      variables: ["SUBJECT", "DETAILS"],
    },
    {
      template: `Bonjour,
  
  {SUBJECT} à traiter.
  
  {DETAILS}
  
  Merci de me confirmer la prise en compte.
  
  Cdt,`,
      variables: ["SUBJECT", "DETAILS"],
    },
  ],
};

export const STORAGE_KEYS = {
  DRAFT: "emailAssistant_draft",
  STYLE: "emailAssistant_style",
  HISTORY: "emailAssistant_history",
};
