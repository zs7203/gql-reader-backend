const {rank: Rank} = require('./api')
const {RESTDataSource} = require('apollo-datasource-rest')

class RankAPI extends RESTDataSource {

  async getRanks() {
    return await this.get(`${Rank.rankCategory}`)
  }

  async getRankBooks(id) {
    return await this.get(`${Rank.rankInfo}/${id}`)
  }
}

module.exports = RankAPI