import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
import { z } from "zod";
import prisma from "@/lib/db";
import { inngest } from "@/inngest/client";
import { TRPCError } from "@trpc/server";


export const messageRouter = createTRPCRouter({
    getMany: protectedProcedure
    .input(
        z.object({
            projectId: z.string().min(1, { message: "Project ID is required"}),

        }),
    )
        .query(async ({ input, ctx }) => {
            const message = await prisma.message.findMany({
                where: {
                    projectId: input.projectId,
                    project:{
                        userId: ctx.auth.userId,
                    },
                },
                include: {
                    fragment: true,
                },
                orderBy: {
                    updatedAt: "asc",
                },
            });
            return message;
        }),
    create: protectedProcedure
      .input(
        z.object({
            value: z.string()
            .min(1, { message: "Message is required"})
            .max(1000, { message: "Message is too long"}),
            projectId: z.string().min(1, { message: "Project ID is required"}),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        const existingProject = await prisma.project.findUnique({
            where: {
                id: input.projectId,
                userId: ctx.auth.userId,
            },
        });
        
        if (!existingProject){
            throw new TRPCError({ code: "NOT_FOUND", message: "Project not found" });
        }
        const createMessage =await prisma.message.create({
            data: {
                projectId: existingProject.id,
                content: input.value,
                role: "USER",
                type: "RESULT",
            },
        });
        await inngest.send({
            name: "code-agent/run",
            data: {
                value: input.value,
                projectId: input.projectId,
            },
        });
        return createMessage;
      }
      )
});