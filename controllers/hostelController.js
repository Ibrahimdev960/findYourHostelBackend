const Hostel = require('../models/hostelModel');

const addHostel = async (req, res) => {
    try {
        const { name, location, amenities, price, availability } = req.body;

        // Validate required fields
        if (!name || !location || !price) {
            return res.status(400).json({ message: "Name, Location, and Price are required" });
        }

        const newHostel = new Hostel({
            name,
            location,
            amenities,
            price,
            availability,
            owner: req.user.id  
        });

        await newHostel.save();

        res.status(201).json({ message: "Hostel added successfully", hostel: newHostel });

    } catch (error) {
        console.error("Error in addHostel:", error);  // Log full error
        res.status(500).json({ message: "Error adding hostel", error: error.message });
    }
};


const updateHostel = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, location, amenities, price, availability } = req.body;

        // Ensure ID is provided
        if (!id) {
            return res.status(400).json({ message: "Hostel ID is required" });
        }

        // Update hostel details
        const updatedHostel = await Hostel.findByIdAndUpdate(
            id,
            { name, location, amenities, price, availability },
            { new: true, runValidators: true } // 👈 Ensures validation runs
        );

        if (!updatedHostel) {
            return res.status(404).json({ message: "Hostel not found" });
        }

        res.status(200).json({ message: "Hostel updated successfully", hostel: updatedHostel });

    } catch (error) {
        console.error("Error in updateHostel:", error); // 👈 Log full error
        res.status(500).json({ message: "Error updating hostel", error: error.message });
    }
};


const deleteHostel = async (req, res) => {
    try {
        const { id } = req.params;

        // Ensure ID is provided
        if (!id) {
            return res.status(400).json({ message: "Hostel ID is required" });
        }

        // Find and delete hostel
        const deletedHostel = await Hostel.findByIdAndDelete(id);

        if (!deletedHostel) {
            return res.status(404).json({ message: "Hostel not found" });
        }

        res.status(200).json({ message: "Hostel deleted successfully", hostel: deletedHostel });

    } catch (error) {
        console.error("Error in deleteHostel:", error); // 👈 Log full error
        res.status(500).json({ message: "Error deleting hostel", error: error.message });
    }
};


const getAllHostels = async (req, res) => {
  try {
    const hostels = await Hostel.find();
    res.json(hostels);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching hostels', error });
  }
};

const getHostelById = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    if (!hostel) {
      return res.status(404).json({ message: 'Hostel not found' });
    }
    res.json(hostel);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching hostel', error });
  }
};
const searchHostels = async (req, res) => {
    try {
        console.log(req.params, req.query); // Debugging
        const { location, amenities, priceMin, priceMax } = req.query;
        let query = {};
        
        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }
        
        if (amenities) {
            query.amenities = { $all: amenities.split(',') };
        }
        
        if (priceMin || priceMax) {
            query.price = {};
            if (priceMin) query.price.$gte = parseInt(priceMin);
            if (priceMax) query.price.$lte = parseInt(priceMax);
        }

        const hostels = await Hostel.find(query);
        res.status(200).json(hostels);
    } catch (error) {
        console.error('Error searching hostels:', error);
        res.status(500).json({ message: 'Error searching hostels', error: error.message });
    }
};



module.exports = {
  addHostel,
  updateHostel,
  deleteHostel,
  getAllHostels,
  getHostelById,
  searchHostels
};
