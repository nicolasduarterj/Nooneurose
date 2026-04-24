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
                .send({ message: '', chatUUID: '4f8439ab-20a8-4ea5-9d17-8991dc0f136d' })

            expect(response.status).toBe(400)
        })

        test('Missing chat uuid return 400', async () => {
            const response = await request(app)
                .post(`${Paths._}${Paths.AI._}${Paths.AI.Send}`)
                .send({ message: 'Lorem ipsum', chatUUID: '' })

            expect(response.status).toBe(400)
        })
    })
})
