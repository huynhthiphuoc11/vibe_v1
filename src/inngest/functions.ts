import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    // Imagaine this is a download step
    await step.sleep("wait-a-moment", "30s");
    // Imagaine this is a transcript step
    await step.sleep("wait-a-moment", "10s");
    // Imagaine this is a summary step
    await step.sleep("wait-a-moment", "5s");
    return { message: `Hello ${event.data.email}!` };
  },
);