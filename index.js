const { ApolloServer, gql } = require("apollo-server");
const {
  
  ApolloServerPluginLandingPageGraphQLPlayground,
} = require("apollo-server-core");
const { events, users, participants, locations } = require("./data.json");

const typeDefs = gql`
type Event {
    id: ID!
    title: String!
    desc: String!
    date: String!
    from: String!
    to: String!
    location_id: ID!
    user_id: ID!
    users: [User!]!
    locations: [Location!]!
    participants: [Participant!]!
}

type Location {
    id: ID!
    name: String!
    desc: String!
    lat: String!
    lng: String!
}


type  User {
    id: ID!
    username: String!
    email: String!
    event_id: ID!
}

type Participant {
    id: ID!
    user_id: ID!
    event_id: ID!
}

type Query {
    events: [Event!]!
    event(id: ID!): Event!

    locations: [Location!]!
    location(id: ID!): Location!

    users: [User!]!
    user(id: ID!): User!

    participants: [Participant!]!
    participant(id: ID!): Participant!
    
  }
`;

const resolvers = {
    Query: {
      events: () => events,
      event: (parent, args) => events.find((event) => event.id  == args.id),

      locations: () => locations,
      location: (args) => locations.find((location) => location.id == args.id),

      users: () => users,
      user: (args) => users.find((user) => user.id == args.id),

      participants: () => participants,
      participant: (args) => participants.find((participant)=> participant.id == args.id)
    },

    Event: {
      users: (parent) => users.filter((user) => user.id == parent.id),

      locations: (parent) => locations.filter((location) => location.id == parent.id),

      participants: (parent) => participants.filter((participant) => participant.id == parent.id)
    }
  };

  const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground({})],
});

server.listen().then(({ url }) => console.log(`GrapQL server is up ${url}`));
  