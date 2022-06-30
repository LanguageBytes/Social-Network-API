const { Thought, User } = require('../models');

//GET 
//All Thoughts, a Thought
const thoughtController = {

    getAllThoughts(req, res) {
        Thought.find({})
            .select('-__v')
            .then(dbThoughtData => res.json(dbThoughtData))
            .catch(err => {
                console.log(err);
                return res.status(400).json(err);
            });
    },

    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.thoughtId })
            .select('-__v')
            .then(dbThoughtData => {
                if (!dbThoughtData) {
                    res.status(404).json({ message: 'No thought found with this ID!' })
                }
                return res.json(dbThoughtData)
            })
            .catch(err => {
                console.log(err);
                return res.status(400).json(err);
            });
    },

// POST
// A Thought
    addThought({ params, body }, res) {
        Thought.create({
            thoughtText: body.thoughtText,
            username: body.username,
            userId: params.userId
        })
            .then(({ _id }) => {
                return User.findOneAndUpdate(
                    { _id: params.userId },
                    { $addToSet: { thoughts: _id } },
                    { new: true }
                );
            })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this ID!' });
                    return;
                }
                return res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },

// PUT
// A thought
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            body,
            { new: true }
        )
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with that ID!' });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },

// DELETE 
// A thought
    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.thoughtId })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with that ID!' });
                    return;
                }
                return res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },

// POST
// A Reaction
    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $addToSet: { reactions: body } },
            { new: true, runValidators: true }
        )
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No thought found with this ID!' });
                    return;
                }
                return res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },

    // DELETE
    // A  Reaction
    deleteReaction({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { new: true }
        )
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No reaction found with that ID!' });
                    return;
                }
                return res.json(dbUserData);
            })
            .catch(err => res.json(err));
    }
};

module.exports = thoughtController;