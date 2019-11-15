export const typeDef = `
type Card {
  id: String
  createdBy: User
  updatedBy: User
  createdAt: DateTime
  updatedAt: DateTime
  list: List
  name: String!
  image: String
  duedate: String
  checklists(query: JSON): [Checklist]
  posts(query: JSON): [Post]
  attachments(query: JSON): [Attachment]
}
input CardFilter {
  AND: [CardFilter!]
  OR: [CardFilter!]
  id: String
  id_not: String
  id_in: [String]
  id_not_in: [String]
  id_lt: String
  id_lte: String
  id_gt: String
  id_gte: String
  id_contains: String
  id_not_contains: String
  id_starts_with: String
  id_not_starts_with: String
  id_ends_with: String
  id_not_ends_with: String
  createdBy: UserFilter
  createdBy_some: UserFilter
  createdBy_none: UserFilter
  updatedBy: UserFilter
  updatedBy_some: UserFilter
  updatedBy_none: UserFilter
  createdAt: DateTime
  createdAt_not: DateTime
  createdAt_in: [DateTime]
  createdAt_not_in: [DateTime]
  createdAt_lt: DateTime
  createdAt_lte: DateTime
  createdAt_gt: DateTime
  createdAt_gte: DateTime
  updatedAt: DateTime
  updatedAt_not: DateTime
  updatedAt_in: [DateTime]
  updatedAt_not_in: [DateTime]
  updatedAt_lt: DateTime
  updatedAt_lte: DateTime
  updatedAt_gt: DateTime
  updatedAt_gte: DateTime
  list: ListFilter
  list_some: ListFilter
  list_none: ListFilter
  name: String
  name_not: String
  name_in: [String]
  name_not_in: [String]
  name_lt: String
  name_lte: String
  name_gt: String
  name_gte: String
  name_contains: String
  name_not_contains: String
  name_starts_with: String
  name_not_starts_with: String
  name_ends_with: String
  name_not_ends_with: String
  image: String
  image_not: String
  image_in: [String]
  image_not_in: [String]
  image_lt: String
  image_lte: String
  image_gt: String
  image_gte: String
  image_contains: String
  image_not_contains: String
  image_starts_with: String
  image_not_starts_with: String
  image_ends_with: String
  image_not_ends_with: String
  duedate: String
  duedate_not: String
  duedate_in: [String]
  duedate_not_in: [String]
  duedate_lt: String
  duedate_lte: String
  duedate_gt: String
  duedate_gte: String
  duedate_contains: String
  duedate_not_contains: String
  duedate_starts_with: String
  duedate_not_starts_with: String
  duedate_ends_with: String
  duedate_not_ends_with: String
  checklists: ChecklistFilter
  checklists_some: ChecklistFilter
  checklists_none: ChecklistFilter
  posts: PostFilter
  posts_some: PostFilter
  posts_none: PostFilter
  attachments: AttachmentFilter
  attachments_some: AttachmentFilter
  attachments_none: AttachmentFilter
}
enum CardOrderBy {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
  name_ASC
  name_DESC
  image_ASC
  image_DESC
  duedate_ASC
  duedate_DESC
}
type CardConnection {
  total: Int
  limit: Int
  skip: Int
  data: [Card]
}
input CreateCardInput {
  listId: String
  name: String!
  image: Upload
  duedate: String
}
input UpdateCardInput {
  listId: String
  name: String
  image: Upload
  duedate: String
}
extend type Query {
  cards(
    query: JSON
    where: CardFilter
    orderBy: CardOrderBy
    skip: Int
    limit: Int
  ): [Card]
  card(id: String!): Card
  cardsConnection(
    query: JSON
    where: CardFilter
    orderBy: CardOrderBy
    skip: Int
    limit: Int
  ): CardConnection
}
extend type Subscription {
  cardAdded: Card
  cardUpdated: Card
  cardDeleted: Card
}
extend type Mutation {
  createCard(input: CreateCardInput): Card
  updateCard(input: UpdateCardInput, id: String!): Card
  deleteCard(id: String!): Card
}
`
export const resolvers = ({ pubSub }) => ({
    Query: {
        cards: async (_, { where = {}, limit, skip, orderBy, query = {} }, { requester, resolvers, headers }) => {
            try {
                return await requester.cardRequester.send({ type: 'find', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        card: async (_, { id }, { requester, resolvers, headers }) => {
            try {
                return await requester.cardRequester.send({ type: 'get', id, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        cardsConnection: async (_, { where = {}, query = {}, limit, skip, orderBy }, { requester, resolvers, headers }) => {
            try {
                return await requester.cardRequester.send({ type: 'findConnection', where: Object.assign(where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Card: {
        createdBy: async ({ createdBy }, args, { headers, requester }) => {
            try {
                return await requester.userRequester.send({ type: 'get', id: createdBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        updatedBy: async ({ updatedBy }, args, { headers, requester }) => {
            try {
                return await requester.userRequester.send({ type: 'get', id: updatedBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        list: async ({ listId }, args, { headers, requester }) => {
            try {
                return await requester.listRequester.send({ type: 'get', id: listId, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        checklists: async ({ id }, { where = {}, limit, skip, orderBy, query = {} }, { headers, requester }) => {
            try {
                return await requester.checklistRequester.send({ type: 'find', where: Object.assign({ cardId: id }, where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        posts: async ({ id }, { where = {}, limit, skip, orderBy, query = {} }, { headers, requester }) => {
            try {
                return await requester.postRequester.send({ type: 'find', where: Object.assign({ cardId: id }, where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
        attachments: async ({ id }, { where = {}, limit, skip, orderBy, query = {} }, { headers, requester }) => {
            try {
                return await requester.attachmentRequester.send({ type: 'find', where: Object.assign({ cardId: id }, where, query), limit, skip, orderBy, headers })
            } catch (e) {
                throw new Error(e)
            }
        },
    },
    Subscription: {
        cardAdded: {
            subscribe: () => pubSub.asyncIterator('cardAdded')
        },
        cardUpdated: {
            subscribe: () => pubSub.asyncIterator('cardUpdated')
        },
        cardDeleted: {
            subscribe: () => pubSub.asyncIterator('cardDeleted')
        },
    },
    Mutation: {
        createCard: async (_, { input = {} }, { requester: { cardRequester }, headers, bucket, uuid, storageUrl, storageRequester }) => {
            try {
                if (input.image) {
                    let imageCard = await input.image
                    const key = "card/" + uuid() + "." + imageCard.mimetype.split("/")[1]
                    const url = storageUrl + key
                    input.image = url
                    const rs = imageCard.createReadStream()
                    let buffers = []
                    return new Promise((resolve, reject) => {
                        rs.on('data', async (data) => {
                            buffers.push(data)
                        })
                        rs.on('end', async (data) => {
                            let buffer = Buffer.concat(buffers)
                            const card = cardRequester.send({
                                type: 'create',
                                body: input,
                                headers,
                                file: {
                                    buffer,
                                    key,
                                    mimeType: imageCard.mimetype,
                                    bucket
                                }
                            })
                            pubSub.publish("cardAdded", { cardAdded: card })
                            resolve(card)
                        })
                    })
                } else {
                    let card = await cardRequester.send({ type: 'create', body: input, headers })
                    pubSub.publish("cardAdded", { cardAdded: card })
                    return card
                }
            } catch (e) {
                throw new Error(e)
            }
        },
        updateCard: async (_, { input = {}, id }, { requester: { cardRequester }, headers, bucket, uuid, storageUrl, storageRequester }) => {
            try {
                if (input.image) {
                    let imageCard = await input.image
                    delete input.image

                    const rs = imageCard.createReadStream()
                    let buffers = []
                    return new Promise((resolve, reject) => {
                        rs.on('data', async (data) => {
                            buffers.push(data)
                        })
                        rs.on('end', async (data) => {
                            let buffer = Buffer.concat(buffers)
                            const card = await cardRequester.send({
                                type: 'patch',
                                body: input,
                                id,
                                headers,
                                file: {
                                    buffer,
                                    mimeType: imageCard.mimetype,
                                    bucket
                                }
                            })
                            pubSub.publish("cardUpdated", { cardUpdated: card })
                            resolve(card)
                        })

                    })
                } else {
                    let card = await cardRequester.send({ type: 'patch', body: input, id, headers })
                    pubSub.publish("cardUpdated", { cardUpdated: card })
                    return card
                }
            } catch (e) {
                throw new Error(e)
            }

        },
        deleteCard: async (_, { id }, { requester: { cardRequester }, headers, bucket, uuid, storageUrl, storageRequester }) => {
            try {
                let card = await cardRequester.send({ type: 'delete', id, headers })
                if (card.url) {
                    const key = card.url.split(storageUrl).join("")
                    storageRequester.send({
                        type: "deleteFile",
                        body: {
                            bucket,
                            key
                        }
                    })
                }
                pubSub.publish("cardDeleted", { cardDeleted: card })
                return card
            } catch (e) {
                throw new Error(e)
            }
        },
    }
})