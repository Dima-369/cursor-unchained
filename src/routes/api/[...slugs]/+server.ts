// src/routes/api/[...slugs]/+server.ts
import sendStreamCppRequest from "$lib/streamCpp";
import { Elysia, t } from "elysia";

const app = new Elysia({ prefix: "/api" })
  .get("/test", () => {
    const time = Date.now();
    return new Response(`hi ${time}`, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  })
  .post("/streamCpp", async ({ body }) => {
    // Check if the request uses the detailed format with current_file
    const requestBody = body as { code?: string; current_file?: any };

    if (requestBody.current_file) {
      // Detailed format: {"current_file": {...}}
      // For now, extract the contents from the detailed format
      // In the future, this could be enhanced to properly use cursor position
      const code = requestBody.current_file.contents || "function";
      console.log("Code (from detailed format):", code);
      const streamCpp = await sendStreamCppRequest(code);
      console.log("Response:", streamCpp);
      return new Response(streamCpp, {
        headers: { "Content-Type": "application/json" },
      });
    } else {
      // Simple format: {"code": "..."}
      const code = requestBody.code || "function";
      console.log("Code (from simple format):", code);
      const streamCpp = await sendStreamCppRequest(code);
      console.log("Response:", streamCpp);
      return new Response(streamCpp, {
        headers: { "Content-Type": "application/json" },
      });
    }
  })
  .get("/streamCpp", async () => {
    const streamCpp = await sendStreamCppRequest();
    return new Response(streamCpp, {
      headers: { "Content-Type": "application/json" },
    });
  })
  .post("/", ({ body }) => body, {
    body: t.Object({
      name: t.String(),
    }),
  });

type RequestHandler = (v: { request: Request }) => Response | Promise<Response>;

export const fallback: RequestHandler = ({ request }) => app.handle(request);
