import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async () => {
  return json({
    agents: [
      {
        id: "1",
        name: "Agent Smith",
        status: "active",
        created_at: new Date().toISOString(),
      },
    ],
  });
};
