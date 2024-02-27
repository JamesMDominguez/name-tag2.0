import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import typeDefs from './typeDefs';
import mongo from '../util/mongo.js'
import { ObjectId } from 'mongodb';

const credential = JSON.parse(
  Buffer.from(process.env.GOOGLE_SERVICE_KEY, "base64").toString().replace(/\n/g, "")
);

const storage = new Storage({
  projectId: "raspimon",
  credentials: {
    client_email: credential.client_email,
    private_key: credential.private_key,
  }
});
const bucketName = 'codenext';

const resolvers = {
  Query: {
    getUser: async (_, { username }) => {
      const db = await mongo();
      return await db.collection('User').findOne({ name: username });
    },
    getUsers: async (_, { username }) => {
      const db = await mongo();
      const pattern = new RegExp(`^${username}`, 'i');
      return await db.collection('User').find({ email: { $regex: pattern } }).limit(5).toArray();
    },
    getNameTags: async (_, { username }) => {
      const db = await mongo();
      return await db.collection('Collaborator').find({ email: username }).toArray();
    },
    getFaces: async () => {
      const db = await mongo();
      return await db.collection('Face').find().toArray();
    },
    getCollaborators: async (_, { nameTagId }) => {
      const db = await mongo();
      return await db.collection('Collaborator').find({ nameTagId: nameTagId }).toArray();
    },
    getNameTag: async (_, { id }) => {
      const db = await mongo();
      return await db.collection('NameTag').findOne({ _id: new ObjectId(id) });
    }
  },
  Mutation: {
    createUser: async (_, args) => {
      const db = await mongo();
      const data = await db.collection('User').insertOne(args);
      return data.acknowledged
    },
    createNameTag: async (_, { title, email }) => {
      const db = await mongo();
      const data = await db.collection('NameTag').insertOne({ title: title, banner: "https://www.colliers.com/-/media/images/colliers/canada/images/news/2022/gender-diversity-in-the-canadian-commercial-real-estate-industry-hero.ashx?sc_lang=en-ca&bid=4b1e28c01f6340e689c162740e05f15c&hash=681B6DC390DBF8FFA1D737BCABBF7932" });
      const CollaboratorData = await db.collection('Collaborator').insertOne({ email: email, nameTagId: data.insertedId, access: "owner" });
      return CollaboratorData.acknowledged
    },
    createFace: async (_, { nameTagId, image }) => {
      const db = await mongo();
      const imageBuffer = Buffer.from(image, 'base64');
      const bucket = storage.bucket('codenext');
      const fileName = `${uuidv4()}.png`
      const file = bucket.file(fileName);

      const uploadPromise = new Promise((resolve, reject) => {
        const stream = file.createWriteStream({
          resumable: false,
        });
        stream.on('error', (error) => reject(error));
        stream.on('finish', () => resolve(fileName));
        stream.end(imageBuffer);
      });

      try {
        const uploadedFileName = await uploadPromise;
        console.log(`Image uploaded to ${uploadedFileName}`);
        const data = await db.collection('Face').insertOne({
          nameTagId: nameTagId,
          image: `https://storage.googleapis.com/${bucketName}/${uploadedFileName}`,
          name: '',
        });
        return data.acknowledged;
      } catch (error) {
        console.error('Error creating face:', error);
        throw new Error('Failed to create face');
      }
    },
    createCollaborator: async (_, { email, nameTagId, access }) => {
      const db = await mongo();
      const data = await db.collection('Collaborator').insertOne({ email: email, nameTagId: new ObjectId(nameTagId), access: access });
      return data.acknowledged
    },

    updateUser: async (_, args) => {
      const db = await mongo();
      const data = await db.collection('User').updateOne({ _id: args.id }, { $set: args })
      return data.acknowledged
    },
    updateNameTag: async (_, args) => {
      const db = await mongo();
      const data = await db.collection('NameTag').updateOne({ _id: new ObjectId(args._id) }, { $set: { title: args.title } })
      return data.acknowledged
    },
    updateFace: async (_, args) => {
      const db = await mongo();
      const data = await db.collection('Face').updateOne({ _id: new ObjectId(args.id) }, { $set: args })
      return data.acknowledged
    },
    updateCollaborator: async (_, args) => {
      const db = await mongo();
      const data = await db.collection('Collaborator').updateOne({ _id: args.id }, { $set: args })
      return data.acknowledged
    },

    deleteNameTag: async (_, { tagID }) => {
      const db = await mongo();
      await db.collection('NameTag').deleteOne({ _id: new ObjectId(tagID) })
      const deleteCollaborator = await db.collection('Collaborator').deleteMany({ nameTagId: new ObjectId(tagID) })
      return deleteCollaborator.acknowledged
    },
    deleteUser: async (_, { ownerEmail }) => {
      const db = await mongo();
      const data = await db.collection('User').deleteOne({ ownerEmail: ownerEmail })
      return data.acknowledged
    },
    deleteFace: async (_, { id, fileName }) => {
      const db = await mongo();
      const bucket = storage.bucket(bucketName);
      const file = bucket.file(fileName);
      file.delete().then(() => {
        console.log(`Image ${fileName} successfully deleted.`);
      }).catch((err) => {
        console.error('Error deleting image:', err);
      });
      console.log(id)
      const data = await db.collection('Face').deleteOne({ _id: new ObjectId(id) })
      return data.acknowledged
    },
    deleteCollaborator: async (_, { id }) => {
      const db = await mongo();
      const data = await db.collection('Collaborator').deleteOne({ _id: id })
      return data.acknowledged
    }
  },
  NameTag: {
    collaborators: async (parent) => {
      const db = await mongo();
      return await db.collection('Collaborator').find({ nameTagId: parent._id }).toArray();
    },
    faces: async (parent) => {
      const db = await mongo();
      return await db.collection('Face').find({ nameTagId: parent._id.toString() }).toArray();
    }
  },
  Collaborator: {
    user: async (parent) => {
      const db = await mongo();
      return await db.collection('User').findOne({ email: parent.email })
    },
    nameTag: async (parent) => {
      const db = await mongo();
      return await db.collection('NameTag').findOne({ _id: new ObjectId(parent.nameTagId) })
    }
  }
};

const server = new ApolloServer({ resolvers, typeDefs });

const handler = startServerAndCreateNextHandler(server);

export async function GET(request) {
  return handler(request);
}

export async function POST(request) {
  return handler(request);
}
