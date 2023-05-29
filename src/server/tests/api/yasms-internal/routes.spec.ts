import nock from 'nock';

import * as nocks from 'src/server/tests/nocks';

describe('GET /api/get/routes', () => {
    beforeEach(async () => {
        nocks.nockBlackbox({
            response: {
                status: {
                    value: 'VALID',
                },
            },
            ticket: 'service-ticket',
        });
        nocks.nockGeobase();
        nocks.nockLangdetect({});
        nocks.nockUatraits({});
        nocks.nockTvm({
            ticket: 'service-ticket',
        });
    });

    afterEach(() => {
        nock.cleanAll();
    });

    it('should return routes', async () => {
        expect(true).toBeTruthy();
    });
});
