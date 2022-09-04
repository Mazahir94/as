const { ApolloServer, gql } = require("apollo-server");
const {ApolloServerPluginLandingPageGraphQLPlayground,
} = require("apollo-server-core");
const { v4: uuidv4 } = require('uuid');
const { events, users, participants, locations } = require("./data.json");

const typeDefs = gql`
# event

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

input createEventInput {
    title: String!
    desc: String!
    date: String!
    from: String!
    to: String!
}

input updateEventInput{
    title: String!
    desc: String!
    date: String!
    from: String!
    to: String!
}

# location

type Location {
   id: ID! 
   name: String!
   desc: String!
   lat: String!
   lng: String!
}

input createLocationInput {
  name: String!
  desc: String!
  lat: String!
  lng: String!
}

input updateLocationInput {
  name: String!
  desc: String!
  lat: String!
  lng: String!
}

# user

type  User {
    id: ID!
    username: String!
    email: String!
    event_id: ID!
}

input createUserInput {
  username: String!
  email: String!
}

# participant

type Participant {
    id: ID!
    user_id: ID!
    event_id: ID!
}

input createParticipantInput {
   user_id: ID!
   event_id: ID!
}

type Mutation {
  # event
  createEvent(data: createEventInput!): Event!
  updateEvent(id: ID!, data: updateEventInput!): Event!

  # location
  createLocation(data: createLocationInput!): Location!
  updateLocation(id: ID!, data: updateLocationInput!): Location!
  # user
  createUser(data: createUserInput!): User!

  # participant
  createParticipant(data: createParticipantInput): Participant!
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
Mutation: {
  // event
  createEvent: (parent, {data})=>{
    const event = {
      id: uuidv4(),
      ...data,
    };
    events.push(event);
    return event;
  },

  updateEvent: (parent, {id, data}) => {
    const event_index = events.findIndex((event) => event.id === parseInt(id) );

    if (event_index === -1) {
      throw new Error ('Event not found');
    }

    const updated_event = (events[event_index] = {
      ...events[event_index],
      ...data
    });

    return updated_event
  },

// location
  createLocation: (parent, {data}) => {
    const location = {
      id: uuidv4(),
      ...data,
    };
    locations.push(location);
    return location;
  },
  updateLocation: (parent, {id, data}) => {
    const location_index = locations.findIndex((location) => location.id === parseInt(id));

    if (location_index === -1) {
      throw new Error ('location bulunamadi');
    }

    const updatedLocation = (locations[location_index] ={ 
      ...locations[location_index],
      ...data
    });
    return location_index;
  },
// user
  createUser: (parent, {data}) => {
    const user = {
      id: uuidv4(),
      ...data,
    };
    users.push(user);
    return user;
  },

  // participant
  createParticipant: (parent, {data})=> {
    const participant = {
      id: uuidv4(),
      ...data,
    };
    participants.push(participant);
    return participant;
  },
},
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
  