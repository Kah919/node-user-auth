const express = require('express');
const app = express();
const bcrypt = require('bcrypt');

app.use(express.json()); // lets us read json

const users = [];

app.get('/users', (req, res) => {
    res.json(users);
});


// bcrypt is asynchronous so we use async
app.post('/users', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt()
        // we can remove the salt variable and set the salt to 10 if we don't want to generate it (10 is default)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        console.log(salt)
        console.log(hashedPassword)

        const user = { name: req.body.name, password: hashedPassword }
        users.push(user)
        res.status(201).send()
    } catch {
        res.status(500).send()
    }

    
});

app.post('/users/login', async (req, res) => {
    const user = users.find(user => user.name = req.body.name)

    if(user === null) {
        return res.status(400).send("Can't find user")
    }

    try {
        if(await bcrypt.compare(req.body.password, user.password)) {
            res.send('Success')
        } else {
            res.send('Not Allowed')
        }
    } catch {
        res.status(500).send()
    }
})

app.listen(3000)