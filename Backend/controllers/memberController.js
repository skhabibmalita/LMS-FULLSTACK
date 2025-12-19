// controllers/memberController.js
const Member = require('../models/member');

// Get all members
exports.getMembers = async (req, res) => {
  try {
    const members = await Member.find().sort({ membershipDate: -1 });
    res.json(members);
  } catch (err) {
    console.error("❌ Error fetching members:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// Create new member
exports.createMember = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    const exists = await Member.findOne({ email });
    if (exists)
      return res.status(400).json({ message: 'Member with this email already exists' });

    const member = new Member({
      name,
      email,
      phone,
      address
    });

    await member.save();
    res.status(201).json(member);
  } catch (err) {
    console.error("❌ Error creating member:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// Update member
exports.updateMember = async (req, res) => {
  try {
    const updatedMember = await Member.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedMember)
      return res.status(404).json({ message: 'Member not found' });

    console.log("✅ Member updated:", updatedMember);
    res.json(updatedMember);
  } catch (err) {
    console.error("❌ Error updating member:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// Delete member
exports.deleteMember = async (req, res) => {
  try {
    const deletedMember = await Member.findByIdAndDelete(req.params.id);

    if (!deletedMember)
      return res.status(404).json({ message: 'Member not found' });

    console.log("✅ Member deleted:", deletedMember);
    res.json({ message: 'Member deleted successfully' });
  } catch (err) {
    console.error("❌ Error deleting member:", err.message);
    res.status(500).json({ message: err.message });
  }
};
