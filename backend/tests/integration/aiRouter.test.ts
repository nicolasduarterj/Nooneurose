import request from 'supertest'
import app from '@src/server'
import Paths from '@src/common/constants/Paths'
import { describe, test, expect } from 'vitest'

describe('AI Router', () => {
    describe(`Paths.AI.Send (${Paths.AI.Send}) (POST)`, () => {
        test('Invalid content-type returns 400', async () => {
            const response = await request(app)
                .post(`${Paths._}${Paths.AI._}${Paths.AI.Send}`)
                .send('Hello')

            expect(response.status).toBe(400)
        })

        test('Missing message returns 400', async () => {
            const response = await request(app)
                .post(`${Paths._}${Paths.AI._}${Paths.AI.Send}`)
                .send({ message: '' })

            expect(response.status).toBe(400)
        })
    })
})