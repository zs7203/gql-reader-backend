const { ApolloServer, gql } = require('apollo-server')
const CategoryAPI = require('./api/CategoryAPI')
const BookAPI = require('./api/BookAPI')
const RankAPI = require('./api/RankAPI')

const typeDefs = gql`

  type Query {
    channel: Channel!
    book(id: String!): Book
    chapter(id: String!): Chapter
    search(keyword: String!): [Book]!
    ranks: RankList
  }

  type Mutation {
    addBook(title: String, author: String): Book
  }

  type Channel {
    male: [Category]!
    female: [Category]!
    picture: [Category]!
    press: [Category]!
  }

  type Category {
    type: String!
    name: String!
    bookCount: Int!
    bookCover: [String]!
    mins: [String]!
  }

  type SubCategory {
    name: [String]!
  }

  type Book {
    _id : ID!
    _sourceId: ID
    author: String!
    cover: String
    title: String!
    lastChapter: String
    tags: String
    longIntro: String
    shortIntro: String
    relatedBooks: [Book]
    authorBooks: [Book]
    chapters: [ChapterSummary]
    comments: [ShortComment]
  }
  
  type ChapterSummary{
    id: ID!
    title: String!
    link: String!
    chapterCover: String
    totalPage: Int!
    order: Int!
    currency: Int!
    unreadble: Boolean!
    isVip: Boolean! 
    content: String
  }
  
  type Chapter{
    id: ID!
    title: String!
    body: String
    isVip: Boolean!
    order: Int!
    currency: Int!
    created: String!
    updated: String!
    cpContent: String!
  }
  
  type ShortComment{
    _id: ID!
    rating: Int
    author: User!
    type: String!
    likeCount: Int!
    block: String!
    haveImage: Boolean
    state: String!
    updated: String!
    created: String!
    commentCount: Int!
    voteCount: Int!
    content: String!
  }
  
  type User {
    _id: ID!
    avatar: String!
    nickname: String!
    activityAvatar: String!
    type: String!
    lv: Int!
    gender: String!
  }
  
  type RankList {
    male: [Rank]!
    female: [Rank]!
    picture: [Rank]!
    epub: [Rank]!
  }
  
  type Rank {
    _id: ID!
    title: String!
    cover: String!
    collapse: Boolean!
    shortTitle: String!
    books: [Book]!
  }
`

const resolvers = {
  Mutation: {
    addBook: (root, { title, author }) => {
      let book = { title, author }
      books.push(book)
      return book
    }
  },
  Query: {
    channel: async (_parent, _args, { dataSources }) => {
      return await dataSources.categoryAPI.getChannels()
    },
    book: async (_parent, { id }, { dataSources }) => {
      return await dataSources.bookAPI.getBookById(id)
    },
    chapter: async (_parent, { id }, { dataSources }) => {
      let rawChapterContent = await dataSources.bookAPI.getChapterContent(id)
      return rawChapterContent.chapter
    },
    search: async (_parent, { keyword }, { dataSources }) => {
      let rawSearch = await dataSources.bookAPI.fuzzySearch(keyword)
      return rawSearch.books
    },
    ranks: async (_parent, _, { dataSources }) => {
      return await dataSources.rankAPI.getRanks()
    }
  },
  Category: {
    mins: async (parent, _args, { dataSources }) => {
      let categories = await dataSources.categoryAPI.getSubCategories()
      return categories[parent.type].find(cat => cat.major === parent.name).mins || []
    }
  },
  Book: {
    _sourceId: async (book, _args, { dataSources }) => {
      let sources = await dataSources.bookAPI.getBookSource(book._id)
      return sources[0]._id
    },
    relatedBooks: async (book, _args, { dataSources }) => {
      let rawRelated = await dataSources.bookAPI.getRelatedBooks(book._id)
      return rawRelated.books
    },
    authorBooks: async (book, _args, { dataSources }) => {
      let rawAuthor = await dataSources.bookAPI.getAuthorBooks(book._id)
      return rawAuthor.books
    },
    chapters: async (book, _args, { dataSources }) => {
      let sources = await dataSources.bookAPI.getBookSource(book._id)
      let rawChapters = await dataSources.bookAPI.getChapters(sources[0]._id)
      return rawChapters.chapters
    },
    comments: async (book, _args, { dataSources }) => {
      let rawReviews = await dataSources.rankAPI.getShortReviews(book._id)
      return rawReviews.docs
    }
  },
  Rank: {
    books: async (rank, _args, { dataSources }) => {
      let rawRank = await dataSources.rankAPI.getRankBooks(rank._id)
      return rawRank.ranking.books
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    categoryAPI: new CategoryAPI(),
    bookAPI: new BookAPI(),
    rankAPI: new RankAPI(),
  })
})

server.listen().then(({ url }) => console.log(`🚀  Server ready at ${url}`))