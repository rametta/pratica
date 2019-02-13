import { parseDate } from './../src/parseDate'
import { doesNotReject } from 'assert';

describe('parseDate', () => {

  it('should properly parse date strings and return a Maybe', done => {
    const goodDate = '2019-02-13T21:04:10.984Z'
    const badDate = '2019-02-13T21:04:1'

    parseDate(goodDate).cata({
      Just: date => expect(date.toISOString()).toBe(goodDate),
      Nothing: done.fail
    })

    parseDate(badDate).cata({
      Just: done.fail,
      Nothing: done
    })

    parseDate(null).cata({
      Just: x => expect(x).toBe(),
      Nothing: done
    })

    done()
  })

})