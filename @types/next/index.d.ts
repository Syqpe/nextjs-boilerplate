import { Request, Response } from 'express';

declare module 'next' {
    /**
     * Тип запроса, зависит от используемой платформы на сервере (Express/Fastify/etc).
     */
    export type PlatformRequest = Request;

    /**
     * Тип ответа, зависит от используемой платформы на сервере (Express/Fastify/etc).
     */
    export type PlatformResponse = Response;
}
