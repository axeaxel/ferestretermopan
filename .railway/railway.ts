import { defineRailway, github, project, service } from "railway/iac";

export default defineRailway(() => {
  const web = service("ferestretermopan", {
    source: github("axeaxel/ferestretermopan", { branch: "main" }),
    build: "npm run build",
    start: "npm start",
    healthcheck: "/",
  });

  return project("ferestretermopan", {
    resources: [web],
  });
});
