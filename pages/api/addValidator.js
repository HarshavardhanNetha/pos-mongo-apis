import clientPromise from "../../lib/mongodb";

export default async function addValidator(req,res){
    try{

        const client = await clientPromise;
        const db = client.db("pos");

        let body = req.body
        if(!body.email){
            res.send({"err":"Email is mandatory!"})
        }
        else{
            let isUserPresent = await db.collection("users").find({email:body.email}).toArray()
            
            if(!isUserPresent.length){
                let createUser = await db.collection("users").insertOne(body)
                res.status(200).send({"msg":"Validator created successfully."})
            }
            else{
                res.status(200).send({"err":"Validator already exists."})
            }
        }
    }
    catch(err){
        res.status(400).send({"err":err})
    }
}