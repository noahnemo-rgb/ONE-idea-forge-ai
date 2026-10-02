import { forgeNodeHandler } from "../server/forge/node-adapter.js";

export const config = {
  api: {
    bodyParser: false,
  },
  maxDuration: 60,
};

export default function handler(req, res) {
  return forgeNodeHandler(req, res);
}
