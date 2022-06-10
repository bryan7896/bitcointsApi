import {BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {BitcoinRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class BitcoinService {
  constructor(
    @repository(BitcoinRepository)
    public bitcoinRepository: BitcoinRepository,
  ) { }

  async updateBitcoins() {
    /*
    * We generated the bitcoin price randomly,
    * I was going to generate it with a TradingView webhook,
    * but I would have to upload this to the network
    * */
    let bitcoin = {
      bitcointPrice: getRandomArbitrary(20903.90, 30903.90),
      createdAt: new Date().toISOString(),
      additionalProp1: {}
    }
    return this.bitcoinRepository.create(bitcoin);
  }

}

function getRandomArbitrary(min: number, max: number) {
  return Number((Math.random() * (max - min) + min).toFixed(2));
}
