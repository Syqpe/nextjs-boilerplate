import { NextPageContext } from 'next';
import Error from 'next/error';
import React, { FC } from 'react';

const ErrorPage: FC<NextPageContext> = ({ res, err }) => {
    const errStatusCode = err ? err.statusCode : undefined;
    const statusCode = res ? res.statusCode : errStatusCode;

    if (statusCode) {
        return <Error statusCode={statusCode} />;
    }

    return <p>Произошла ошибка</p>;
};

export default ErrorPage;
