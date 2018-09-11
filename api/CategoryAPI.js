const {catetory: Category} = require('./api')
const {RESTDataSource} = require('apollo-datasource-rest')

class CategoryAPI extends RESTDataSource {

  async getChannels() {
    let rawChannels = await this.get(`${Category.categoryWithBookCount}`)
    let channelMale = {gender: 'male', categories: rawChannels['male']}
    let channelFemale = {gender: 'female', categories: rawChannels['female']}
    return [channelMale, channelFemale]
  }

  async getSubCategories() {
    let rawSubs = await this.get(Category.categoryWithSubCategories)
    return [...rawSubs['male'], ...rawSubs['female']]
  }
}

module.exports = CategoryAPI