const express = require('express');
const { protect, isHostelOwner } = require('../middleware/authMiddleware');
const { 
    addHostel, 
    updateHostel, 
    deleteHostel, 
    getAllHostels, 
    getHostelById,
    searchHostels 
} = require('../controllers/hostelController');

const router = express.Router();

router.post('/add', protect, isHostelOwner, addHostel);
router.put('/update/:id', protect, isHostelOwner, updateHostel);
router.delete('/delete/:id', protect, isHostelOwner, deleteHostel);
router.get('/all', getAllHostels);
router.get('/search', searchHostels);
router.get('/:id', getHostelById);

module.exports = router;