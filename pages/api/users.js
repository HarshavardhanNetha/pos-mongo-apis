import clientPromise from "../../lib/mongodb";

export default async (req, res) => {
   try {
       const client = await clientPromise;
       const db = client.db("pos");

       const movies = await db
           .collection("users")
           .find({})
           .toArray();

       res.json(movies);
   } catch (e) {
       console.error(e);
   }
};