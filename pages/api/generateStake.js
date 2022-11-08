import clientPromise from "../../lib/mongodb";

export default async function generateStake(req,res){
    try{

        const client = await clientPromise;
        const db = client.db("pos");

        let sumOfStake = await db.collection("users").aggregate([{$group: {_id:'',"totalFee":{$sum: '$fee'}}},{$project: {_id:0}}]).toArray()

        console.log(sumOfStake[0].totalFee);
        sumOfStake = sumOfStake[0].totalFee
        let forOneDegree = 360/sumOfStake
        console.log(forOneDegree);
        let result = {}
        let users = await db.collection("users").aggregate([{$project: {_id:0, name:1, fee:1}}]).toArray()
        // console.log(users);
        users.forEach((user) => {
            let userName = user.name
            let userFee = user.fee
            let stake = userFee*forOneDegree
            result[userName] = stake
        })
        // let result = 0
        res.send(result)
    }
    catch(err){
        res.send({"err":err})
    }
}