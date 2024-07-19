const express = require("express");

const port = 1225;
const app = express();
app.use(express.json());

const contracts = [];

app.post("/contract", (req, res) => {
    console.log("add or get contract");
    console.log(req.body);
    let contract = contracts.filter(contract => contract.arbiter == req.body.arbiter);
    if(contract.length == 0){
        contracts.push(req.body);
        res.json(req.body);
    }
    else{
        res.json(contract[0]);
    }
    
});

app.get("/address", (req, res) => {
    let contract = contracts.filter(contract => contract.arbiter == req.query.arbiter);
    if(contract.length > 0)
        res.json(contract[0].address);
    else    
        res.json(null);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});