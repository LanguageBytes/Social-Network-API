const { User, Thought } = require('../models/index');

const userController = {

    // GET 
    // All users, a user By ID
    getAllUsers(req, res) {
        User.find({})
            .populate({ path: 'thoughts', select: '-__v' })
            .populate({ path: 'friends', select: '-__v -thoughts' })
            .select('-__v')
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                return res.status(400).json(err);
            });
    },

    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
            .populate({ path: 'thoughts', select: '-__v' })
            .populate({ path: 'friends', select: '-__v' })
            .select('-__v')
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found' });
                    return;
                }
                return res.json(dbUserData);
            })
            .catch(err => {
                console.log(err);
                return res.status(400).json(err);
            });
    },

// POST 
// A user
    createUser({ body }, res) {
        User.create(body)
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.status(400).json(err));
    },

// PUT 
// A user
    updateUser({ params, body }, res) {
        User.findOneAndUpdate(
            { _id: params.id },
            body,
            { new: true, runValidators: true }
        )
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found' });
                    return;
                }
                return res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err));
    },

    // DELETE 
    // A user
    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found' });
                    return;
                }
                return Thought.deleteMany({ userId: params.id })
            })
            .then(data => res.json(data))
            .catch(err => res.status(400).json(err));
    },

    // PUT
    // Add a Friend
    addFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $addToSet: { friends: params.friendId } },
            { new: true, runValidators: true }
        )
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found' });
                    return;
                };
                return res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },

// DELETE
// A friend
    deleteFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $pull: { friends: params.friendId } },
            { new: true }
        )
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.json(err));
    }
};

module.exports = userController;