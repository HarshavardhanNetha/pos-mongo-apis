import clientPromise from "../../lib/mongodb";

export default async function chooseValidator(req,res){
    try{

        const client = await clientPromise;
        const db = client.db("pos");

        let sumOfStake = await db.collection("users").aggregate([{$group: {_id:'',"totalFee":{$sum: '$fee'}}},{$project: {_id:0}}]).toArray()
        
        console.log(sumOfStake[0].totalFee);
        sumOfStake = sumOfStake[0].totalFee
        let forOneDegree = 360/sumOfStake
        console.log(forOneDegree);
        let result = {}
        const users = await db.collection("users").aggregate([{$project: {_id:0, name:1, fee:1}}]).toArray()
        // console.log(users);
        let probabilityList = []

        users.forEach((user) => {
            let userName = user.name
            let userFee = user.fee
            let stake = userFee*forOneDegree
            result[userName] = stake
            let i;
            for(i = 0; i<stake; i++){
                probabilityList.push(userName)
            }
        })
        function shuffle(array) {
            let currentIndex = array.length,  randomIndex;
          
            // While there remain elements to shuffle.
            while (currentIndex != 0) {
          
              // Pick a remaining element.
              randomIndex = Math.floor(Math.random() * currentIndex);
              currentIndex--;
          
              // And swap it with the current element.
              [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
            }
          
            return array;
        }

        probabilityList = shuffle(probabilityList)
        const randomElement = probabilityList[Math.floor(Math.random() * probabilityList.length)];

        res.status(200).send({"validator":randomElement})
    }
    catch(err){
        res.status(400).send({"err":err})
    }
}