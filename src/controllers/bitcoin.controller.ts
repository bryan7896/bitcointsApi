import {
  Count,
  CountSchema, repository,
  Where
} from '@loopback/repository';
import {
  get, getModelSchemaRef,
  param, response
} from '@loopback/rest';
import {Bitcoin} from '../models';
import {BitcoinRepository} from '../repositories';

export class BitcoinController {
  constructor(
    @repository(BitcoinRepository)
    public bitcoinRepository: BitcoinRepository,
  ) { }

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

  // Returns 7 data from the database filtered
  // by the selected day and from the page requested by the user
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
  async bitcoins(
    @param.filter(Bitcoin) filter?: any,
  ): Promise<Bitcoin[]> {
    let {page, dateUser} = filter.where;
    const newDateUser: Date = new Date(dateUser)
    const filter2 = {
      where: {
        and: [
          {createdAt: {gte: (new Date(newDateUser.getFullYear(), newDateUser.getMonth(), newDateUser.getDate(), 0, 0, 0))}},
          {createdAt: {lte: (new Date(newDateUser.getFullYear(), newDateUser.getMonth(), newDateUser.getDate(), 23, 59, 59))}}
        ]
      },
      limit: 7,
      skip: (page - 1) * 7,
      order: ['createdAt DESC'],
    }
    return this.bitcoinRepository.find(filter2);
  }

  //Returns the 5 days to display based on the position of the page
  @get('/daysBitcoin')
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
    @param.filter(Bitcoin) filter?: any,
  ): Promise<Bitcoin[]> {
    //Variable to store the last report of each day
    let listDays: Array<any> = [];

    //Converts the current page number to a negative number so it can be used as a pager
    let page = (filter.where.page * -5) + 1

    //Filter by each of the 5 days that will be displayed on the front
    let day1 = await this.bitcoinRepository.find(this.filter(page + 4));
    let day2 = await this.bitcoinRepository.find(this.filter(page + 3));
    let day3 = await this.bitcoinRepository.find(this.filter(page + 2));
    let day4 = await this.bitcoinRepository.find(this.filter(page + 1));
    let day5 = await this.bitcoinRepository.find(this.filter(page));
    listDays = [
      ...day1,
      ...day2,
      ...day3,
      ...day4,
      ...day5,
    ]
    return listDays
  }
  filter(page: number) {
    const filter1 = {
      where: {
        and: [
          {createdAt: {gte: this.startDate(page).toISOString()}},
          {createdAt: {lte: this.endDate(page).toISOString()}}
        ]
      },
      limit: 1,
      order: ['createdAt DESC'],
    }
    return filter1;
  }

  endDate(num: number) {
    const currentDate = new Date();
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + num, 23, 59, 59);
  }
  startDate(num: number) {
    const currentDate = new Date();
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + num, 0, 0, 0);
  }


  //Returns the last value reported in the database
  @get('/currentBitcoins')
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
  async currentBitcoins(
  ): Promise<Bitcoin[]> {
    let filter = {
      order: ['createdAt DESC'],
      limit: 2
    }
    return this.bitcoinRepository.find(filter);
  }
}

