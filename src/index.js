const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require('prisma-binding')

// 2
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: (root, args, context, info) => {
      return context.db.query.links({}, info)
    },
    link: (root, args) => {
      const id = args.id
      let matched_link = links.filter(function(link) {
        let link_id = link.id.split('-')[1]
        return link_id == id
      })
      return matched_link[0]
    }
  },
  Mutation: {
    // 2
    post: (root, args, context, info) => {
      return context.db.mutation.createLink({
        data: {
          url: args.url,
          description: args.description,
        },
      }, info)
    },
    updateLink: (root, args) => {
      const id = args.id

      let matched_link
      for (let i = 0; i < links.length; i++) {
        let link_id = links[i].id.split('-')[1]

        if(id == link_id) {

          links[i].description = args.description
          links[i].url = args.url
          matched_link = links[i]
          break;
        }

      }

      return matched_link
    },
    deleteLink: (root, args) => {
      const id = args.id

      let matched_link_index
      for (let i = 0; i < links.length; i++) {
        let link_id = links[i].id.split('-')[1]

        if(id == link_id) {

          matched_link_index = i
          break;
        }

      }

      let matched_link = links[matched_link_index]
      links.splice(matched_link_index, 1)
      return matched_link
    }
  }
}

// 3
const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: 'src/generated/prisma.graphql',
      endpoint: 'https://eu1.prisma.sh/public-slashhoof-433/hackernews-server/dev',
      secret: 'mysecret123',
      debug: true,
    }),
  }),
})
server.start(() => console.log(`Server is running on http://localhost:4000`))