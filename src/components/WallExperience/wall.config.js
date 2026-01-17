export const WALL_CONFIG = {
  layout: {
    containerHeight: "200vh", // taller than viewport for scroll storytelling
    sceneHeight: "100vh",
    maxWidth: "1600px",
    horizontalPadding: "6vw",
  },

  images: {
    emptyWall: {
      zIndex: 1,
      scale: [1.15, 1],
      y: ["0vh", "-10vh"],
    },
    decor: {
      zIndex: 3,
      scale: [0.9, 1],
      opacity: [0, 1],
      y: ["8vh", "0vh"],
      shadow: "0 30px 80px rgba(0,0,0,0.35)",
    },
  },

  typography: {
    wrapper: {
      maxWidth: "720px",
      align: "center",
      offsetY: "-6vh",
    },
    title: {
      fontSize: ["2.2rem", "3.6rem"],
      lineHeight: "1.15",
      color: "#1c1c1c",
    },
    subtitle: {
      fontSize: ["1rem", "1.15rem"],
      color: "#6b6b6b",
      marginTop: "1.2rem",
    },
  },

  scrollTimings: {
    decorFadeInStart: 0.25,
    decorFadeInEnd: 0.55,
    textFadeOutStart: 0.6,
    textFadeOutEnd: 0.85,
  },
};
