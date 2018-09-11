const {book: Book, comment: Comment} = require('./api')
const {RESTDataSource, encodeURI} = require('apollo-datasource-rest')

class BookAPI extends RESTDataSource {
  async getBookById(id) {
    return await this.get(`${Book.bookInfo}/${id}`)
  }

  async getRelatedBooks(id) {
    return await this.get(`${Book.relatedRecommendedBooks}/${id}/recommend`)
  }

  async getAuthorBooks(id) {
    return await this.get(`${Book.authorBooks}?author=${encodeURI(book.author)}`)
  }

  async getBookSource(id) {
    return await this.get(`${Book.bookSources}?view=summary&book=${id}`)
  }

  async getChapters(id) {
    return await this.get(`${Book.bookChapters}/${id}?view=chapters`)
  }

  async getChapterContent(id) {
    return await this.get(`${Book.chapterContent}/http://vip.zhuishushenqi.com/chapter/${id}`)
  }

  async getShortReviews(id) {
    // (lastUpdated|newest|mostlike)
    let sortType = "newest"
    let start = 0
    let limit = 20
    return await this.get(`${Comment.shortReviews}?book=${id}&sortType=${sortType}&start=${start}&limit=${limit}`)
  }

  async fuzzySearch(keyword) {
    return await this.get(`${Book.bookSearch}?query=${keyword}`)
  }
}

module.exports = BookAPI