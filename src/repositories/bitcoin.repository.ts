import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DatabaseDataSource} from '../datasources';
import {Bitcoin, BitcoinRelations} from '../models';

export class BitcoinRepository extends DefaultCrudRepository<
  Bitcoin,
  typeof Bitcoin.prototype.id,
  BitcoinRelations
> {
  constructor(
    @inject('datasources.database') dataSource: DatabaseDataSource,
  ) {
    super(Bitcoin, dataSource);
  }
}
