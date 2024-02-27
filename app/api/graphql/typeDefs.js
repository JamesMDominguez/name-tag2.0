import { gql } from 'graphql-tag';

const typeDefs = gql`
type User {
    _id: ID!
    name: String!
    email: String! 
    profile_image: String!
}

type Collaborator{
  _id: ID!
  email: ID!
  user: User!
  nameTagId: ID!
  access: String!
  nameTag: NameTag!
}

type Face {
  _id: ID
  nameTagId: String
  image: String
  name: String
}

type NameTag {
  _id: ID
  title: String
  banner: String
  faces: [Face]
  collaborators: [Collaborator]
}

type Query {
  getUser(username: String!): User
  getUsers(username: String!):[User]
  getNameTags(username: String!):[Collaborator]
  getNameTag(id: String!):NameTag
  getFaces:[Face]
  getCollaborators(nameTagId: String!):[Collaborator]
}

type Mutation {
  createUser(name: String!,email: String!,profile_image: String!): Boolean!
  createNameTag(title: String!,email: String!): Boolean!
  createFace(nameTagId:ID!,image:String!): Boolean!
  createCollaborator(email:ID!,nameTagId:ID!,access:String!): Boolean!

  updateNameTag(_id:ID!,title: String,banner:String): Boolean!
  updateUser(email:String): Boolean!
  updateFace(id: ID!,name:String!): Boolean!
  updateCollaborator(id: ID!): Boolean!

  deleteNameTag(tagID: String!): Boolean!
  deleteUser(email:String): Boolean!
  deleteFace(id: ID!,fileName: String!): Boolean!
  deleteCollaborator(id: ID!): Boolean!
}
`;
export default typeDefs;