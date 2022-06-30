const router = require('express').Router();
const {
    getAllThoughts,
    getThoughtById,
    addThought,
    updateThought,
    deleteThought,
    addReaction,
    deleteReaction
} = require('../../controllers/thought-controller');

router.route('/')
    .get(getAllThoughts)

router.route('/:userId')
    .post(addThought)

router.route('/:userId/:thoughtId')
    .get(getThoughtById)
    .put(updateThought)
    .delete(deleteThought)

router.route('/:userId/:thoughtId/reactions/')
    .put(addReaction)

router.route('/:userId/:thoughtId/reactions/:reactionId')
    .delete(deleteReaction)

module.exports = router;