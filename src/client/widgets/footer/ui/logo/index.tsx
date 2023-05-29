import React, { FC } from 'react';

import { LinkLego } from '@ccomponents/index';

import styles from './index.module.scss';

interface Props {
    href: string;
    mode: 'dark' | 'light';
}

const Logo: FC<Props> = ({ href, mode }) => {
    return (
        <LinkLego href={href}>
            <div className={styles.Logo}>
                <svg
                    className={styles.Logo__icon}
                    width="120"
                    height="120"
                    viewBox="0 0 120 120"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <mask
                        id="mask0_323_2032"
                        style={{ maskType: 'alpha' }}
                        maskUnits="userSpaceOnUse"
                        x="0"
                        y="0"
                        width="120"
                        height="120"
                    >
                        <circle cx="60" cy="60" r="60" fill="white" />
                    </mask>
                    <g mask="url(#mask0_323_2032)">
                        <rect width="120" height="120" fill="#FC3F1D" />
                        <path
                            d="M61.6276 66.1987C65.1336 73.8787 66.3023 76.55 66.3023 85.7743V98.0039H53.7806V77.3848L30.1562 26.0039H43.2206L61.6276 66.1987ZM77.071 26.0039L61.7528 60.8143H74.4832L89.8432 26.0039H77.071Z"
                            fill="white"
                        />
                    </g>
                </svg>

                <svg
                    className={styles.Logo__word}
                    width="214"
                    height="94"
                    viewBox="0 0 214 94"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M36.78 93.3C46.53 93.3 53.16 89.79 57.19 87.06V74.45C51.99 78.22 46.27 81.08 37.95 81.08C23.65 81.08 16.89 69.51 16.89 46.89C16.89 23.62 23.39 12.57 38.73 12.57C45.88 12.57 52.51 15.69 57.19 18.68V6.07C53.03 3.08 46.27 0.349994 37.95 0.349994C13.9 0.349994 0.9 18.03 0.9 46.89C0.9 76.53 14.42 93.3 36.78 93.3ZM98.9413 92H112.461L130.921 23.75V92H146.391V1.64999H125.331L107.131 68.6L88.9313 1.64999H67.6113V92H80.4813V23.75L98.9413 92ZM192.678 93.3C202.428 93.3 209.058 89.79 213.088 87.06V74.45C207.888 78.22 202.168 81.08 193.848 81.08C179.548 81.08 172.788 69.51 172.788 46.89C172.788 23.62 179.288 12.57 194.628 12.57C201.778 12.57 208.408 15.69 213.088 18.68V6.07C208.928 3.08 202.168 0.349994 193.848 0.349994C169.798 0.349994 156.798 18.03 156.798 46.89C156.798 76.53 170.318 93.3 192.678 93.3Z"
                        fill={mode === 'dark' ? 'white' : 'black'}
                    />
                </svg>
            </div>
        </LinkLego>
    );
};

export { Logo };
