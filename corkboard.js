const stories = {
  about: {
    kicker: "01 / hello",
    title: "A little about me.",
    body: [
      "I’m Roni Katcharovski, a Computer Engineering student at the University of Waterloo. I like the satisfying moment when an idea stops being a sketch and starts doing something useful.",
      "My best days tend to involve a messy whiteboard, a hard technical problem, and a team that cares about getting the details right.",
    ],
    links: [
      ["LinkedIn ↗", "https://linkedin.com/in/roni-katcharovski"],
      ["Email me ↗", "mailto:roni.katch@gmail.com"],
    ],
  },
  waterloo: {
    kicker: "02 / the foundation",
    title: "Learning the layers.",
    body: [
      "At Waterloo, I’m studying Computer Engineering: from circuits and embedded systems to software that needs to work reliably in the real world.",
      "The through-line is curiosity. I enjoy understanding not just what a system does, but why it behaves that way.",
    ],
    links: [["See my projects", "projects.html"]],
  },
  tesla: {
    kicker: "a coast-to-desert chapter",
    title: "Tesla: California to Reno.",
    body: [
      "At Tesla, I worked in Manufacturing Test and Engineering Software, building software around in-house test equipment and product validation.",
      "California and Reno became two snapshots of the same chapter: factory-scale engineering, close collaboration, and a lot of learning by doing.",
    ],
    links: [["Read the Tesla story", "tesla-server.html"]],
  },
  whoop: {
    kicker: "a pinned memory",
    title: "Building at WHOOP.",
    body: [
      "At WHOOP, I got to experience the pace and care behind a product people wear every day. It sharpened the way I think about shipping software, collaborating across disciplines, and making small details count.",
      "The work mattered, but so did the people around it.",
    ],
    links: [["View experience", "whoop-server.html"]],
  },
  ford: {
    kicker: "an early chapter",
    title: "Engineering at Ford.",
    body: [
      "At Ford, I worked with the Manufacturing Software team on embedded-systems validation, unit testing, and real-time telemetry control code.",
      "It was a practical lesson in reliability: make the code testable, make the behavior observable, and keep improving the system one careful change at a time.",
    ],
    links: [["Read the Ford story", "ford-server.html"]],
  },
  work: {
    kicker: "03 / the work",
    title: "The trail so far.",
    body: [
      "I’ve worked across embedded systems, manufacturing software, and real-time products. Each chapter has added a different tool to the kit — and a new appreciation for careful engineering.",
      "I’m drawn to teams making thoughtful things that have a tangible effect beyond the screen.",
    ],
    links: [
      ["Tesla", "tesla-server.html"],
      ["Ford", "ford-server.html"],
      ["Electrium", "electrium-server.html"],
      ["Exceed Robotics", "exceed-server.html"],
    ],
  },
  projects: {
    kicker: "04 / the rabbit holes",
    title: "Things I make to learn.",
    body: [
      "Projects are where I pull on an interesting thread and see where it goes. They’re a chance to test an idea, make mistakes cheaply, and build taste through repetition.",
      "The drawer is always open — there is usually something being rebuilt in there.",
    ],
    links: [["Open projects", "projects.html"]],
  },
};

const dialog = document.querySelector("#storyModal");
const title = document.querySelector("#modalTitle");
const kicker = document.querySelector("#modalKicker");
const body = document.querySelector("#modalBody");
const links = document.querySelector("#modalLinks");

function openStory(key) {
  const story = stories[key];
  if (!story) return;

  kicker.textContent = story.kicker;
  title.textContent = story.title;
  body.replaceChildren(
    ...story.body.map((text) => {
      const paragraph = document.createElement("p");
      paragraph.textContent = text;
      return paragraph;
    }),
  );
  links.replaceChildren(
    ...story.links.map(([label, href]) => {
      const link = document.createElement("a");
      link.href = href;
      link.textContent = label;
      if (href.startsWith("http")) {
        link.target = "_blank";
        link.rel = "noreferrer";
      }
      return link;
    }),
  );
  dialog.showModal();
  document.querySelector(".close-modal").focus();
}

document.querySelectorAll("[data-card]").forEach((card) => {
  card.addEventListener("click", () => openStory(card.dataset.card));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openStory(card.dataset.card);
    }
  });
});

document.querySelector(".close-modal").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});
document.querySelector("#year").textContent = new Date().getFullYear();
