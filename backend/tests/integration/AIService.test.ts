import AIService from "@src/services/aiService"
import { describe, test, expect } from "vitest"

describe('AI service', () => {
    test('Sending a message returns AI response', () => {
        expect(async () => await AIService.sendMessage('explain hamlet to me.')).not.toThrow()
    })
})
