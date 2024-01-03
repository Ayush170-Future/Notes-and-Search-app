const router = require("express").Router();
const validateToken = require("../middleware/validateTokenHandler");
const limiter = require("../middleware/rateLimit")
const {getAllNotes, getNoteById, createNote, updateNoteById, deleteNoteById} = require("../controllers/noteControllers");

router.use(validateToken);
router.use(limiter);

router.get('/', getAllNotes);
router.get('/:id', getNoteById);
router.post('/', createNote);
router.put('/:id', updateNoteById);
router.delete('/:id', deleteNoteById);

module.exports = router;