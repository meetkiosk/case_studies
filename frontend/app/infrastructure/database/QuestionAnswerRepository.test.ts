import { describe, it, expect, beforeEach, vi } from "vitest";
import { QuestionAnswerRepository } from "./QuestionAnswerRepository";
import type { CreateQuestionAnswerDTO } from "../../domain/csrd-form/QuestionAnswer";

// Mock Prisma client
vi.mock("./prisma-client", () => {
  const mockPrisma = {
    questionAnswer: {
      create: vi.fn(),
      findFirst: vi.fn(),
    },
  };
  return { prisma: mockPrisma };
});

import { prisma } from "./prisma-client";

describe("QuestionAnswerRepository", () => {
  let repository: QuestionAnswerRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new QuestionAnswerRepository();
  });

  describe("create", () => {
    it("should create a question answer with string value", async () => {
      const dto: CreateQuestionAnswerDTO = {
        questionId: "Q1",
        answer: "Test answer",
      };

      const mockResult = {
        id: "test-id-123",
        questionId: "Q1",
        answer: "Test answer",
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-01T00:00:00Z"),
      };

      vi.mocked(prisma.questionAnswer.create).mockResolvedValue(mockResult);

      const result = await repository.create(dto);

      expect(prisma.questionAnswer.create).toHaveBeenCalledWith({
        data: {
          questionId: "Q1",
          answer: "Test answer",
        },
      });

      expect(result).toEqual({
        id: "test-id-123",
        questionId: "Q1",
        answer: "Test answer",
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-01T00:00:00Z"),
      });
    });

    it("should create a question answer with boolean value", async () => {
      const dto: CreateQuestionAnswerDTO = {
        questionId: "Q2",
        answer: true,
      };

      const mockResult = {
        id: "test-id-456",
        questionId: "Q2",
        answer: true,
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-01T00:00:00Z"),
      };

      vi.mocked(prisma.questionAnswer.create).mockResolvedValue(mockResult);

      const result = await repository.create(dto);

      expect(result.answer).toBe(true);
    });

    it("should create a question answer with number value", async () => {
      const dto: CreateQuestionAnswerDTO = {
        questionId: "Q3",
        answer: 2024,
      };

      const mockResult = {
        id: "test-id-789",
        questionId: "Q3",
        answer: 2024,
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-01T00:00:00Z"),
      };

      vi.mocked(prisma.questionAnswer.create).mockResolvedValue(mockResult);

      const result = await repository.create(dto);

      expect(result.answer).toBe(2024);
    });

    it("should create a question answer with object value", async () => {
      const dto: CreateQuestionAnswerDTO = {
        questionId: "Q4",
        answer: { key: "value", nested: { data: "test" } },
      };

      const mockResult = {
        id: "test-id-abc",
        questionId: "Q4",
        answer: { key: "value", nested: { data: "test" } },
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-01T00:00:00Z"),
      };

      vi.mocked(prisma.questionAnswer.create).mockResolvedValue(mockResult);

      const result = await repository.create(dto);

      expect(result.answer).toEqual({ key: "value", nested: { data: "test" } });
    });
  });

  describe("createMany", () => {
    it("should create multiple question answers", async () => {
      const dtos: ReadonlyArray<CreateQuestionAnswerDTO> = [
        { questionId: "Q1", answer: "Answer 1" },
        { questionId: "Q2", answer: true },
      ];

      const mockResults = [
        {
          id: "test-id-1",
          questionId: "Q1",
          answer: "Answer 1",
          createdAt: new Date("2024-01-01T00:00:00Z"),
          updatedAt: new Date("2024-01-01T00:00:00Z"),
        },
        {
          id: "test-id-2",
          questionId: "Q2",
          answer: true,
          createdAt: new Date("2024-01-01T00:00:00Z"),
          updatedAt: new Date("2024-01-01T00:00:00Z"),
        },
      ];

      vi.mocked(prisma.questionAnswer.create)
        .mockResolvedValueOnce(mockResults[0])
        .mockResolvedValueOnce(mockResults[1]);

      const results = await repository.createMany(dtos);

      expect(results.length).toBe(2);
      expect(results[0].questionId).toBe("Q1");
      expect(results[1].questionId).toBe("Q2");
      expect(prisma.questionAnswer.create).toHaveBeenCalledTimes(2);
    });

    it("should handle empty array", async () => {
      const results = await repository.createMany([]);

      expect(results.length).toBe(0);
      expect(prisma.questionAnswer.create).not.toHaveBeenCalled();
    });
  });

  describe("findByQuestionId", () => {
    it("should find existing answer by question id", async () => {
      const mockResult = {
        id: "test-id-123",
        questionId: "Q1",
        answer: "Existing answer",
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-01T00:00:00Z"),
      };

      vi.mocked(prisma.questionAnswer.findFirst).mockResolvedValue(mockResult);

      const result = await repository.findByQuestionId("Q1");

      expect(prisma.questionAnswer.findFirst).toHaveBeenCalledWith({
        where: { questionId: "Q1" },
        orderBy: { createdAt: "desc" },
      });

      expect(result).toEqual({
        id: "test-id-123",
        questionId: "Q1",
        answer: "Existing answer",
        createdAt: new Date("2024-01-01T00:00:00Z"),
        updatedAt: new Date("2024-01-01T00:00:00Z"),
      });
    });

    it("should return null when answer not found", async () => {
      vi.mocked(prisma.questionAnswer.findFirst).mockResolvedValue(null);

      const result = await repository.findByQuestionId("non-existing");

      expect(result).toBeNull();
    });
  });
});
