import MainAIService from "@src/services/AIService/MainAIService"
import { describe, test, expect } from "vitest"

describe('AI service', () => {
    test('Sending a message returns AI response', () => {
        expect(async () => await MainAIService.sendMessage('explain hamlet to me.', '')).not.toThrow()
    })
})
