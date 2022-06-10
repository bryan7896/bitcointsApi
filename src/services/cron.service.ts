import {bind, BindingScope, inject} from '@loopback/core';
import {BitcoinService} from './bitcoints.service';
const cron = require('node-cron');

@bind({scope: BindingScope.TRANSIENT})
export class CronService {
  constructor(
    @inject('trip.service')
    public bitcoinService: BitcoinService,
  ) { }

  /**
   * K = Formats
   */
  formats = {
    minute: '* * * * *',
  };

  async bitcoinTime() {
    //Service to be run every minute to update bitcoins
    this.bitcoinService.updateBitcoins();
  }


  /**
   * Function to set cron Schedule
   * @param format string minute, hour, day, week or custom
   * @param action object
   *
   */
  cronSchedule(format: string, action: any) {
    let filter = format;
    if (filter in this.formats) filter = eval('this.formats.' + format);
    cron.schedule(filter, async () => {
      let actionNow = `this.${action}()`;
      eval(actionNow);
    });
  }
}
