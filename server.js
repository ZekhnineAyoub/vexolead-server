app.post('/api/contact', async (req, res) => {
  try {
    const {
      name,
      email,
      phoneNumber,
      profession,
      message,
      budgetReady,
      startReady
    } = req.body;

    if (!name || !email || !message || !budgetReady || !startReady) {
      return res.status(400).json({ message: 'Veuillez remplir tous les champs obligatoires.' });
    }

    const isQualified =
      ['oui_clair', 'oui_demarrer'].includes(budgetReady) &&
      ['cette_semaine', 'deux_semaines'].includes(startReady);

    // Sauvegarde toujours le contact en base
    const newContact = new Contact({
      name,
      email,
      phoneNumber,
      profession,
      message,
      budgetReady,
      startReady,
      isQualified
    });

    await newContact.save();

    // Si pas qualifié => pas d'email
    if (!isQualified) {
      return res.status(201).json({
        message: 'Contact enregistré mais non qualifié.',
        qualified: false
      });
    }

    // Email au prospect qualifié
    const htmlProspect = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Bonjour ${name},</h2>
        <p>Merci pour votre intérêt envers <strong>VexoLead</strong> 👋</p>
        <p>Votre profil semble correspondre à notre accompagnement.</p>
        <p>Vous pouvez maintenant réserver un appel afin que nous échangions sur votre projet.</p>
        <br/>
        <p>À très bientôt,</p>
        <p><strong>L’équipe VexoLead</strong></p>
      </div>
    `;

    // Email admin uniquement si qualifié
    const htmlAdmin = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h3>🔥 Nouveau prospect qualifié depuis le site VexoLead</h3>
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Téléphone :</strong> ${phoneNumber || 'Non renseigné'}</p>
        <p><strong>Activité :</strong> ${profession}</p>
        <p><strong>Budget :</strong> ${budgetReady}</p>
        <p><strong>Démarrage :</strong> ${startReady}</p>
        <p><strong>Objectif :</strong><br>${message}</p>
      </div>
    `;

    await Promise.all([
      sendEmail(email, 'Votre demande VexoLead est validée', htmlProspect),
      sendEmail('ayoubzekhnine96@gmail.com', `🔥 Prospect qualifié : ${name}`, htmlAdmin)
    ]);

    return res.status(201).json({
      message: 'Prospect qualifié enregistré avec succès 🚀',
      qualified: true
    });

  } catch (error) {
    console.error('❌ Erreur serveur:', error);
    res.status(500).json({ message: 'Erreur serveur lors de l’envoi du message.' });
  }
});