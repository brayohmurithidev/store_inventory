import pino, { levels } from "pino";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const transport = pino.transport({
  targets: [
    {
      target: "pino/file",
      options: { destination: `${__dirname}/../../app.log` },
    },
    // {
    //   target: "@logtail/pino",
    //   options:{sourceToken: ""}
    // },
    {
      target: "pino-pretty", // logs to the standard output by default
    },
  ],
});

const formatter = {
  level: (label) => {
    return { severity: label.toUpperCase() };
  },
};

export default pino(
  {
    timestamp: () => `,"timestamp":"${new Date(Date.now()).toISOString()}"`,
    // formatters: formatter,
    redact: {
      paths: ["*.name"], //WHAT TO NOT LOG, use asterik incase there are nested ones
      censor: "[hidden for security purposes]", //chnange redact msg
      remove: true, //- removes the field completely
    },
  },
  transport
);

// USE LOGTAIL FOR LOG MONITORING
