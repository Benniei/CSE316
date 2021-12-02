const Top5List = require('../models/top5list-model');
const {ObjectID} = require('mongodb');
let object = new ObjectID();


createTop5List = (req, res) => {
    const body = req.body;
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Top 5 List',
        })
    }

    const top5List = new Top5List(body);
    console.log("creating top5List: " + JSON.stringify(top5List));
    if (!top5List) {
        return res.status(400).json({ success: false, error: err })
    }

    top5List
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                top5List: top5List,
                message: 'Top 5 List Created!'
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Top 5 List Not Created!'
            })
        })
}

updateTop5List = async (req, res) => {
    const body = req.body
    console.log("updateTop5List: " + JSON.stringify(body));
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }
    Top5List.findOne({ _id: req.params.id }, (err, top5List) => {
        console.log("top5List found: " + JSON.stringify(top5List));
        if (err) {
            return res.status(404).json({
                err,
                message: 'Top 5 List not found!',
            })
        }

        // TODO update the views using here
        // Normal list update
        if(body._id){
            if(body.name != null && body.items != null){
                top5List.name = body.name
                top5List.items = body.items
            }
        }
        else{
            if(body.likes != null){
                if(top5List.likes)
                    top5List.likes.push(body.likes);
                else{
                    top5List.likes = [body.likes];
                }
            }
            if(body.dislikes != null) {
                if(top5List.dislikes)
                    top5List.dislikes.push(body.dislikes);
                else{
                    top5List.dislikes = [body.dislikes];
                }
            }
            if(body.views != null) {
                if(top5List.views)
                    top5List.views = top5List.views + 1;
                else
                    top5List.views = 1;
            }
            if(body.comments){
                if(body.comments.length > 0) {
                    top5List.comments.push(body.comments)
                }
            }
        }

        top5List
                .save()
                .then(() => {
                    console.log("SUCCESS!!!");
                    return res.status(200).json({
                        success: true,
                        id: top5List._id,
                        message: 'Top 5 List updated!',
                    })
                })
                .catch(error => {
                    console.log("FAILURE: " + JSON.stringify(error));
                    return res.status(404).json({
                        error,
                        message: 'Top 5 List not updated!',
                    })
                })

    })
}

function arrayRemove(arr, value) { 
    return arr.filter(function(ele){ 
        return ele != value; 
    });
}

deleteTop5List = async (req, res) => {
    Top5List.findById({ _id: req.params.id }, (err, top5List) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Top 5 List not found!',
            })
        }
        // ! Delete the community list
        if(top5List.published){
            let top5Name = top5List.name.toLowerCase();
            Top5List.findOne({community: true, name: top5Name}, (err, list) => {
                if(err || list == null){
                    return;
                }
                for(let i = 0; i < top5List.items.length; i++){
                    let score = 5 - i;
                    let obj = list.itemSort.find(x => x.name === top5List.items[i])
                    if(obj){
                        obj.score = obj.score - score;
                        if(obj.score == 0){
                            list.itemSort = arrayRemove(list.itemSort, obj);
                        }
                        console.log(obj.name + "---->" + obj.score);
                    } else{
                        console.log("error item not found");
                    }
                }
                if(list.itemSort.length > 0){
                    list.itemSort.sort((a, b) => {
                        return b.score - a.score
                    });
                    list.items = [];
                    for(let i = 0; i < 5; i++){
                        list.items.push(list.itemSort[i].name);
                    }
                    console.log("Update Community List(Delete): " + JSON.stringify(list));
                    list.save()     
                }
                else{
                    Top5List.findOneAndDelete({ _id: list.id }, () => {
                        console.log("Delete Community List " + list.name);
                    }).catch(err => console.log(err))
                }
            })
        }
        Top5List.findOneAndDelete({ _id: req.params.id }, () => {
            return res.status(200).json({ success: true, data: top5List })
        }).catch(err => console.log(err))
    })
}

getTop5ListById = async (req, res) => {
    await Top5List.findById({ _id: req.params.id }, (err, list) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        return res.status(200).json({ success: true, top5List: list })
    }).catch(err => console.log(err))
}

getTop5Lists = async (req, res) => {
    await Top5List.find({}, (err, top5Lists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!top5Lists.length) {
            return res
                .status(404)
                .json({ success: false, error: `Top 5 Lists not found` })
        }
        return res.status(200).json({ success: true, data: top5Lists })
    }).catch(err => console.log(err))
}

getTop5ListPairs = async (req, res) => {
    const body = req.body
    await Top5List.find({ }, (err, top5Lists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!top5Lists) {
            console.log("!top5Lists.length");
            return res
                .status(404)
                .json({ success: false, error: 'Top 5 Lists not found' })
        }
        else {
            // PUT ALL THE LISTS INTO ID, NAME PAIRS
            let pairs = [];
            for (let key in top5Lists) {
                let list = top5Lists[key];
                let pair = {
                    _id: list._id,
                    name: list.name,
                    loginName: list.loginName,
                    community: list.community,
                    published: list.published
                };
                
                // ! pruning results to fit the body
                if(body.homeState === 1){
                    if(pair.community)
                        continue;
                    if(body.search){
                        if(pair.name.toLowerCase().indexOf(body.search.toLowerCase()) === 0)
                            pairs.push(pair)
                    }
                    else if(pair.loginName === body.loginName)
                        pairs.push(pair);
                }
                else if(body.homeState === 2){
                    // Search by LIST NAME
                    if(pair.community || !pair.published)
                        continue;
                    if(body.search){
                        if(pair.name.toLowerCase().indexOf(body.search.toLowerCase()) === 0)
                            pairs.push(pair)
                    }
                    else if(pair.published === true){
                        pairs.push(pair);
                    }
                }
                else if(body.homeState === 3) {
                    // Search by USER NAME
                    if(pair.community || !pair.published)
                        continue;
                    if(body.search){
                        if(pair.loginName.toLowerCase().indexOf(body.search.toLowerCase()) === 0)
                            pairs.push(pair)
                    }
                    else if(pair.published === true){
                        pairs.push(pair);
                    }
                }
                else if (body.homeState === 4) {
                    if(!pair.community)
                        continue;
                    if(body.search){
                        if(pair.name.toLowerCase().indexOf(body.search.toLowerCase()) === 0)
                            pairs.push(pair)
                    }
                    else if (pair.community === true){
                        // Query for Community List
                        pairs.push(pair);
                    }
                }
            }
            return res.status(200).json({ success: true, idNamePairs: pairs })
        }
    }).catch(err => console.log(err))
}

/** Additional Functions */

publishList = async (req, res) => {
    const body = req.body
    console.log("publishTop5List: " + JSON.stringify(body));
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }
    Top5List.findById({ _id: body.id }, (err, top5List) => {
        console.log("top5List found for publishing: " + JSON.stringify(top5List));
        if (err) {
            return res.status(404).json({
                err,
                message: 'Top 5 List not found!',
            })
        }
        top5List.publishedDate = object.getTimestamp();
        top5List.published = true;
            
        // Update Community List
        let top5Name = top5List.name.toLowerCase();
        Top5List.findOne({community: true, name: top5Name}, (err, list) => {
            if(err || list == null) {
                console.log("Create New Community List");
                const newList = {
                    name: top5Name,
                    community: true,
                    items: [],
                    itemSort: [],
                    comments: [],
                    likes: [],
                    dislikes: []
                }
                list = new Top5List(newList);
            }
            else{
                console.log("Found Community List");
            }
            for(let i = 0; i < top5List.items.length; i++){
                let score = 5 - i;
                let obj = list.itemSort.find(x => x.name === top5List.items[i])
                if(obj){
                    obj.score = obj.score + score;
                } else{
                    list.itemSort.push({name: top5List.items[i], score: score})
                }
            }
            list.itemSort.sort((a, b) => {
                return b.score - a.score
            });
            list.items = [];
            for(let i = 0; i < 5; i++){
                list.items.push(list.itemSort[i].name);
            }
            console.log(list.items);
            console.log("Update Community List(Add): " + JSON.stringify(list));
            list.save()
        })

        // Send back feeback
        top5List
                .save()
                .then(() => {
                    console.log("SUCCESS!!!");
                    return res.status(200).json({
                        success: true,
                        id: top5List._id,
                        message: 'Top 5 List updated!',
                    })
                })
                .catch(error => {
                    console.log("FAILURE: " + JSON.stringify(error));
                    return res.status(404).json({
                        error,
                        message: 'Top 5 List not updated!',
                    })
                })
    })
}

getTop5ListExist = async (req, res) => {
    const body = req.body;
    await Top5List.find({ name: body.listName, loginName: body.user, published: true }, (err, list) => {
        if (err || list.length === 0) {
            return res.status(400).json({ success: false, error: err });
        }
        return res.status(200).json({ success: true, top5List: list })
    }).catch(err => console.log(err))
}

module.exports = {
    createTop5List,
    updateTop5List,
    deleteTop5List,
    getTop5Lists,
    getTop5ListPairs,
    getTop5ListById,
    getTop5ListExist,
    publishList
}