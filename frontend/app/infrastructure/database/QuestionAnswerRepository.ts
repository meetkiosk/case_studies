import type { CreateQuestionAnswerDTO, QuestionAnswer } from "../../domain/csrd-form/QuestionAnswer";
import { prisma } from "./prisma-client";

export class QuestionAnswerRepository {
  async create(dto: CreateQuestionAnswerDTO): Promise<QuestionAnswer> {
    const result = await prisma.questionAnswer.create({
      data: {
        questionId: dto.questionId,
        answer: dto.answer,
      },
    });

    return {
      id: result.id,
      questionId: result.questionId,
      answer: result.answer,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async createMany(dtos: ReadonlyArray<CreateQuestionAnswerDTO>): Promise<ReadonlyArray<QuestionAnswer>> {
    const results = await Promise.all(
      dtos.map(async (dto) => {
        return this.create(dto);
      })
    );

    return results;
  }

  async findByQuestionId(questionId: string): Promise<QuestionAnswer | null> {
    const result = await prisma.questionAnswer.findFirst({
      where: { questionId },
      orderBy: { createdAt: "desc" },
    });

    if (!result) {
      return null;
    }

    return {
      id: result.id,
      questionId: result.questionId,
      answer: result.answer,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }
}
