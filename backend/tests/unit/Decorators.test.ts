import PromptServiceError, { ThrowsPromptServiceError } from "@src/common/types/PromptServiceError";
import { describe, test } from 'vitest'

abstract class TestUtils {

    @ThrowsPromptServiceError
    public static throws() {
        throw new Error('ABC')
    }

    @ThrowsPromptServiceError
    public static async asyncThrows() {
        await Promise.resolve()
        throw new Error('ABC')
    }

    @ThrowsPromptServiceError
    public static returns() {
        return 'OPA'
    }

    @ThrowsPromptServiceError
    public static async asyncReturns() {
        await Promise.resolve()
        return 'OPA'
    }
}

describe('PromptServiceError Wrapper', () => {
    test('Wraps a normal error', () => {
        expect(() => TestUtils.throws()).toThrow(PromptServiceError)
    })

    test('Returns properly when function does not throw', () => {
        expect(() => TestUtils.returns()).not.toThrow()
        const res = TestUtils.returns()
        expect(res).toBe('OPA')
    })

    test('Wraps an async error', async () => {
        await expect(TestUtils.asyncThrows()).rejects.toThrow(PromptServiceError)
    })

    test('Returns properly in async function', async () => {
        await expect(TestUtils.asyncReturns()).resolves.toBe('OPA')
    })
})
