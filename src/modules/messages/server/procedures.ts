import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";
import prisma from "@/lib/db";
import { inngest } from "@/inngest/client";


export const messageRouter = createTRPCRouter({
    getMany: baseProcedure
        .query(async () => {
            const message = await prisma.message.findMany({
                orderBy: { 
                    updatedAt: "asc",
                },
            });
            return message;
        }),
    create: baseProcedure
      .input(
        z.object({
            value: z.string().min(1, { message: "Message is required"}),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        const createMessage =await prisma.message.create({
            data: {
                content: input.value,
                role: "USER",
                type: "RESULT",
            },
        });
        await inngest.send({
            name: "code-agent/run",
            data: {
                value: input.value,
            },
        });
        return createMessage;
      }
      )
});