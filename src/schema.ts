import { gql } from "apollo-server-core"

export const schema = gql`
  scalar DateTime
  scalar Upload

  type User {
    id: String!

    name: String!

    createdAt: DateTime!

    """
    Requires authentification.
    """
    email: String!

    bio: String!

    posts: [Post!]!
    postCount: Int!

    comments: [Comment!]!

    votes: [Vote!]!
    karma: Int!

    bluedits: [Bluedit!]!
  }

  type Post {
    id: String!

    createdAt: DateTime!
    lastEditedAt: DateTime!

    title: String!
    content: String!
    contentType: ContentType!

    author: User!

    comments: [Comment!]!
    commentCount: Int!

    bluedit: Bluedit!

    votes: [Vote!]!
    """
    Require authentification.
    """
    userVote: Vote
    voteCount: Int!

    trendingScore: Float!
  }

  type Comment {
    id: String!

    createdAt: DateTime!
    lastEditedAt: DateTime!

    deleted: Boolean!

    content: String!

    author: User!

    post: Post!

    comment: Comment
    childComments: [Comment!]!

    votes: [Vote!]!
    """
    Require authentification.
    """
    userVote: Vote
    voteCount: Int!
  }

  type Bluedit {
    id: String!

    name: String!
    description: String!

    posts: [Post!]!
    postCount: Int!

    subscribers: [User!]!
    subscriberCount: Int!

    """
    Require authentification.
    """
    userSubscribed: Boolean!
  }

  type Vote {
    id: String!

    up: Boolean!

    post: Post!
    postId: String!

    comment: Comment

    author: User!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  enum SortType {
    Trending
    Best
    New
  }

  enum ContentType {
    TEXT
    IMAGE
    LINK
  }

  input PaginationInput {
    skip: Int!
    take: Int!
  }

  union SearchResult = User | Bluedit | Post

  type Query {
    search(query: String!): [SearchResult!]!

    """
    Requires authentification.
    """
    me: User!

    users: [User!]!
    bluedits: [Bluedit!]!

    mainFeed(sort: SortType!, pagination: PaginationInput): [Post!]!
    """
    Requires authentification.
    """
    personalFeed(sort: SortType!, pagination: PaginationInput): [Post!]!

    blueditFeed(id: String, name: String, sort: SortType!, pagination: PaginationInput): [Post!]!

    postComments(postid: String!): [Comment!]!

    post(id: String!): Post!
    bluedit(id: String, name: String): Bluedit!
    user(id: String, name: String): User!
    comment(id: String!): Comment!
  }

  input CreatePostInput {
    title: String!
    contentType: ContentType!
    textContent: String
    fileContent: Upload
    blueditId: String!
  }

  type Mutation {
    ####################
    # Account creation #
    ####################

    createAccount(name: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    forgotPassword(email: String!): Boolean!

    ######################
    # Account management #
    ######################
    """
    Requires authentification.
    """
    subscribe(id: String!): Bluedit!
    """
    Requires authentification.
    """
    unsubscribe(id: String!): Bluedit!
    """
    Requires authentification.
    """
    changeAccountSettings(name: String, email: String, bio: String, password: String): User!

    #########
    # Posts #
    #########
    """
    Requires authentification.
    """
    createPost(input: CreatePostInput!): Post!
    """
    Requires authentification.
    """
    removePost(id: String!): Post!

    #########
    # Votes #
    #########
    """
    Requires authentification.
    Voting with different "direction" update current vote.
    Voting the same "direction" twice deletes the vote.
    """
    vote(up: Boolean!, postId: String!, commentId: String): Vote

    ############
    # Comments #
    ############
    """
    Requires authentification.
    """
    comment(content: String!, postId: String!, commentId: String): Comment!
    """
    Requires authentification.
    """
    editComment(id: String!, content: String!): Comment!
    """
    Requires authentification.
    """
    removeComment(id: String!): Comment!

    websitePreview(url: String!): String!
  }
`
