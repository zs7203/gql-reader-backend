const { catetory: Category } = require('./api')
const { RESTDataSource } = require('apollo-datasource-rest')

class CategoryAPI extends RESTDataSource {

  async getChannels() {
    let rawChannels = await this.get(`${Category.categoryWithBookCount}`)
    let channels = {
      male: rawChannels.male.map(category => (category.type = "male", category)),
      female: rawChannels.female.map(category => (category.type = "female", category)),
      picture: rawChannels.picture.map(category => (category.type = "picture", category)),
      press: rawChannels.press.map(category => (category.type = "press", category)),
    }
    return channels
  }

  async getSubCategories() {
    return await this.get(Category.categoryWithSubCategories)
  }
}

module.exports = CategoryAPI