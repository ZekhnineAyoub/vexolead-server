const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  profession: { type: String, required: true },
  message: { type: String, required: true },

  // 🔥 NOUVEAUX CHAMPS DE QUALIFICATION
  budgetReady: {
    type: String,
    enum: ['oui_demarrer', 'oui_clair', 'reflexion', 'non'],
    required: true
  },

  startReady: {
    type: String,
    enum: ['cette_semaine', 'deux_semaines', 'reflexion', 'non'],
    required: true
  },

  isQualified: {
    type: Boolean,
    default: false
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contact', contactSchema);