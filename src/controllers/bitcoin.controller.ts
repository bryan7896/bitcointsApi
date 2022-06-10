import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import {Bitcoin} from '../models';
import {BitcoinRepository} from '../repositories';

export class BitcoinController {
  constructor(
    @repository(BitcoinRepository)
    public bitcoinRepository: BitcoinRepository,
  ) { }

  @post('/bitcoins')
  @response(200, {
    description: 'Bitcoin model instance',
    content: {'application/json': {schema: getModelSchemaRef(Bitcoin)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Bitcoin, {
            title: 'NewBitcoin',
            exclude: ['id'],
          }),
        },
      },
    })
    bitcoin: Omit<Bitcoin, 'id'>,
  ): Promise<Bitcoin> {
    return this.bitcoinRepository.create(bitcoin);
  }

  @get('/bitcoins/count')
  @response(200, {
    description: 'Bitcoin model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Bitcoin) where?: Where<Bitcoin>,
  ): Promise<Count> {
    return this.bitcoinRepository.count(where);
  }

  @get('/bitcoins')
  @response(200, {
    description: 'Array of Bitcoin model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Bitcoin, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Bitcoin) filter?: Filter<Bitcoin>,
  ): Promise<Bitcoin[]> {
    return this.bitcoinRepository.find(filter);
  }

  @patch('/bitcoins')
  @response(200, {
    description: 'Bitcoin PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Bitcoin, {partial: true}),
        },
      },
    })
    bitcoin: Bitcoin,
    @param.where(Bitcoin) where?: Where<Bitcoin>,
  ): Promise<Count> {
    return this.bitcoinRepository.updateAll(bitcoin, where);
  }

  @get('/bitcoins/{id}')
  @response(200, {
    description: 'Bitcoin model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Bitcoin, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: string,
    @param.filter(Bitcoin, {exclude: 'where'}) filter?: FilterExcludingWhere<Bitcoin>
  ): Promise<Bitcoin> {
    return this.bitcoinRepository.findById(id, filter);
  }

  @patch('/bitcoins/{id}')
  @response(204, {
    description: 'Bitcoin PATCH success',
  })
  async updateById(
    @param.path.number('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Bitcoin, {partial: true}),
        },
      },
    })
    bitcoin: Bitcoin,
  ): Promise<void> {
    await this.bitcoinRepository.updateById(id, bitcoin);
  }

  @put('/bitcoins/{id}')
  @response(204, {
    description: 'Bitcoin PUT success',
  })
  async replaceById(
    @param.path.number('id') id: string,
    @requestBody() bitcoin: Bitcoin,
  ): Promise<void> {
    await this.bitcoinRepository.replaceById(id, bitcoin);
  }

  @del('/bitcoins/{id}')
  @response(204, {
    description: 'Bitcoin DELETE success',
  })
  async deleteById(@param.path.number('id') id: string): Promise<void> {
    await this.bitcoinRepository.deleteById(id);
  }
}
