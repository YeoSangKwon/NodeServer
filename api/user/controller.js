const a = require('../comm/common');

let users = [
    {
      id: 1,
      name: 'alice'
    },
    {
      id: 2,
      name: 'bek'
    },
    {
      id: 3,
      name: 'chris'
    }
  ]

exports.index = (req, res) => {
    //Routing 로직 작성부분
    console.log(a.aaa(2,2));
    return res.json(users);
};
  
exports.show = (req, res) => {
    const id = parseInt(req.params.id, 10);
    if(!id){
        return res.status(400).json({error: "Uncorrect ID"});
    }

    let user = users.filter((user) => {return user.id === id;})[0];

    if(!user){
        return res.status(404).json({error: "Unknown user"});	
    }
    
    return res.json(user);
};
  
exports.destroy = (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (!id) {
      return res.status(400).json({error: 'Incorrect id'});
    }
  
    const userIdx = users.findIndex(user => user.id === id);
    if (userIdx === -1) {
      return res.status(404).json({error: 'Unknown user'});
    }
  
    users.splice(userIdx, 1);
    res.status(204).send();
};
  
exports.post = (req, res) => {
    const name = req.body.name || '';
    console.log(req.body);
    if(!name.length){
        return res.status(400).json({error: 'Incorrect name'});
    }
  
    const id = users.reduce((maxId, user) => {return user.id > maxId ? user.id : maxId}, 0) + 1;
  
    const newUser = {id: id,name: name};
    users.push(newUser);
    return res.status(201).json(newUser);
};
