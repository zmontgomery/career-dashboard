import { constructBackendRequest } from "./http-helper";

describe('Http help method', () => {
    it ('should create correct url', () => {
        const expected = 'http://localhost:8080/api/hello';

        const actual = constructBackendRequest('hello');

        expect(expected).toEqual(actual);
    });

    it ('should create correct url with a query param', () => {
        const expected = 'http://localhost:8080/api/hello?general=kenobi';

        const actual = constructBackendRequest('hello', {key: 'general', value: 'kenobi'});

        expect(expected).toEqual(actual);
    });

    it ('should create correct url with 2 query params', () => {
        const expected = 'http://localhost:8080/api/hello?general=kenobi&you=are';

        const actual = constructBackendRequest('hello', {key: 'general', value: 'kenobi'}, {key: 'you', value: 'are'});

        expect(expected).toEqual(actual);
    });

    it ('should create correct url with multiple query params', () => {
        const expected = 'http://localhost:8080/api/hello?general=kenobi&you=are&bold=one';

        const actual = constructBackendRequest(
            'hello', 
            {key: 'general', value: 'kenobi'}, 
            {key: 'you', value: 'are'}, 
            {key: 'bold', value: 'one'}
        );

        expect(expected).toEqual(actual);
    });

    it ('should uri encode', () => {
        const expected = 'http://localhost:8080/api/hello?general=ken%20obi&you=a%20r%20e&b%20o%20l%20d=one';

        const actual = constructBackendRequest(
            'hello', 
            {key: 'general', value: 'ken obi'}, 
            {key: 'you', value: 'a r e'}, 
            {key: 'b o l d', value: 'one'}
        );

        expect(expected).toEqual(actual);
    });
});