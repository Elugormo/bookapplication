const graphql = require('graphql');
const _ = require('lodash')
const Book = require('../models/book')
const Author = require('../models/author')


const {  GraphQLObjectType,
         GraphQLString, 
         GraphQLSchema, 
         GraphQLID,
         GraphQLInt, 
         GraphQLList,
         GraphQLNonNull
     } = graphql;


// var books = [
//     {name: 'Name of the Wind', genre:'Fantasy', id: '1', authorId:'1'},
//     {name: 'The Final Empire', genre:'Adventurous', id: '2', authorId:'2'},
//     {name: 'The Long Earth', genre:'Sci-fi', id: '3', authorId:'3'}
// ]

// var authors = [
//     { name: 'Patrick Rothfuss', age: 44, id:'1'},
//     { name: 'Brandon  Sanderson', age: 33, id:'2'},
//     { name: 'Terry Pratchett', age: 67, id:'3'}
// ]



const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: {
            type: AuthorType, 
            resolve(parent, args) {
                return Author.findById(parent.authorId);
               // return _.find(authors, {id: parent.authorId});
            }
        }
    })
});


const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books: { 
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return Book.find({
                    authorId: parent.id 
                })
              //  return _.filter(books, { authorId: parent.id })
            }
        }
    })
});


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: { 
            type: BookType,
            args: { id: { type: GraphQLID }},
            resolve(parent, args) {
                    //code to get data from db or other source 
                    //console.log(typeof(args.id))
                  // return _.find(books, { id: args.id })

                  return Book.findById(args.id);
            }
        },
        author: {
            type: AuthorType,
            args: {id : { type: GraphQLID}},
            resolve(parent, args) {
                return Author.findById(args.id)
              //  return _.find(authors, {id: args.id })
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return Book.find({})
              //  return books;
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                return Author.find({})
              //  return authors;
            }
        }
    }
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation', 
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                age: {
                    type: new GraphQLNonNull(GraphQLInt)
                }
            },
            resolve(parent, args) {
                let author = new Author({
                    name: args.name, 
                    age: args.age
                });
              return  author.save();
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                genre: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                authorId: {
                    type: GraphQLID
                }
            },
            resolve(parent, args) {
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                })
                return book.save();
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})