import { mocked } from 'ts-jest/utils';

import Client from "../../../lib/client";
import Search from "../../../lib/search/search";

import { simpleHashSchema, SimpleHashEntity, SimpleJsonEntity, simpleJsonSchema } from "../helpers/test-entity-and-schema";
import { mockClientSearchToReturnNothing, mockClientSearchToReturnSingleHash,
  mockClientSearchToReturnSingleJsonString, SIMPLE_ENTITY_1 } from '../helpers/search-helpers';

jest.mock('../../../lib/client');


beforeEach(() => mocked(Client).mockReset());
beforeEach(() => mocked(Client.prototype.search).mockReset());

describe("Search", () => {

  let client: Client;

  describe("#returnFirst", () => {

    beforeAll(() => client = new Client());

    describe("when running against hashes", () => {

      let search: Search<SimpleHashEntity>
      let entity: SimpleHashEntity;
      let indexName = 'SimpleHashEntity:index', query = '*';

      beforeEach(() => search = new Search<SimpleHashEntity>(simpleHashSchema, client));

      describe("when querying no results", () => {
        beforeEach( async () => {
          mockClientSearchToReturnNothing();
          entity = await search.return.first();
        });

        it("asks the client for the first result of a given repository", () => {
          expect(Client.prototype.search).toHaveBeenCalledTimes(1);
          expect(Client.prototype.search).toHaveBeenCalledWith({
            indexName, query, offset: 0, count: 1 });
        });

        it("return no result", () => expect(entity).toBe(null));
      });

      describe("when getting a result", () => {
        beforeEach(async () => {
          mockClientSearchToReturnSingleHash();
          entity = await search.return.first();
        });

        it("asks the client for the first result of a given repository", () => {
          expect(Client.prototype.search).toHaveBeenCalledTimes(1)
          expect(Client.prototype.search).toHaveBeenCalledWith({
            indexName, query, offset: 0, count: 1 });
        });

        it("returns the first result of a given repository", () => {
          expect(entity.entityData.aBoolean).toEqual(SIMPLE_ENTITY_1.aBoolean);
          expect(entity.entityData.aNumber).toEqual(SIMPLE_ENTITY_1.aNumber);
          expect(entity.entityData.aString).toEqual(SIMPLE_ENTITY_1.aString);
          expect(entity.entityId).toEqual(SIMPLE_ENTITY_1.entityId);
        });
      });
    });

    describe("when running against JSON Objects", () => {

      let search: Search<SimpleJsonEntity>
      let entity: SimpleJsonEntity;
      let indexName = 'SimpleJsonEntity:index', query = '*';

      beforeEach(() => search = new Search<SimpleJsonEntity>(simpleJsonSchema, client));

      describe("when querying no results", () => {
        beforeEach( async () => {
          mockClientSearchToReturnNothing();
          entity = await search.return.first();
        });

        it("asks the client for the first result of a given repository", () => {
          expect(Client.prototype.search).toHaveBeenCalledTimes(1);
          expect(Client.prototype.search).toHaveBeenCalledWith({
              indexName, query, offset: 0, count: 1 });
        });

        it("return no result", () => expect(entity).toBe(null));
      });

      describe("when getting a result", () => {
        beforeEach(async () => {
          mockClientSearchToReturnSingleJsonString();
          entity = await search.return.first();
        });

        it("asks the client for the first result of a given repository", () => {
          expect(Client.prototype.search).toHaveBeenCalledTimes(1)
          expect(Client.prototype.search).toHaveBeenCalledWith({
            indexName, query, offset: 0, count: 1 });
        });

        it("returns the first result of a given repository", () => {
          expect(entity.entityData.aBoolean).toEqual(SIMPLE_ENTITY_1.aBoolean);
          expect(entity.entityData.aNumber).toEqual(SIMPLE_ENTITY_1.aNumber);
          expect(entity.entityData.aString).toEqual(SIMPLE_ENTITY_1.aString);
          expect(entity.entityId).toEqual(SIMPLE_ENTITY_1.entityId);
        });
      });
    });
  });
});
