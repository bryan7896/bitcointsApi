import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Bitcoin extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'number',
    required: true,
  })
  bitcointPrice: number;

  @property({
    type: 'date',
    required: true,
  })
  createdAt: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Bitcoin>) {
    super(data);
  }
}

export interface BitcoinRelations {
  // describe navigational properties here
}

export type BitcoinWithRelations = Bitcoin & BitcoinRelations;
