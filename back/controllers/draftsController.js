// ============================================================================
// 📁 controllers/draftsController.js - Nouveau contrôleur à créer
// ============================================================================

const Draft = require("../models/Draft");
const { reformulateMessage } = require("../services/openaiService");

/**
 * GET /api/drafts - Récupérer tous les brouillons de l'utilisateur
 */
const getDrafts = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10 } = req.query;

    const drafts = await Draft.find({ userId })
      .sort({ updatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select("-__v");

    const total = await Draft.countDocuments({ userId });

    res.json({
      drafts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalDrafts: total,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des brouillons:", error);
    res.status(500).json({
      error: "Erreur serveur",
      details:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Impossible de récupérer les brouillons",
    });
  }
};

/**
 * POST /api/drafts - Créer un nouveau brouillon
 */
const createDraft = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      title,
      originalMessage,
      to,
      subject,
      styleConfig,
      autoReformulate = false,
    } = req.body;

    // Validation
    if (!originalMessage || originalMessage.trim().length === 0) {
      return res.status(400).json({
        error: "Message requis",
        details: "Le message original ne peut pas être vide",
      });
    }

    // Créer le brouillon
    const draftData = {
      userId,
      title: title || `Brouillon du ${new Date().toLocaleDateString("fr-FR")}`,
      originalMessage: originalMessage.trim(),
      to,
      subject,
      styleConfig: {
        language: styleConfig?.language || "FR",
        tone: styleConfig?.tone || "Professionnel",
        length: styleConfig?.length || "Moyen",
        emoji: styleConfig?.emoji || false,
      },
    };

    // Reformulation automatique si demandée
    if (autoReformulate) {
      try {
        const reformulationResult = await reformulateMessage(
          originalMessage,
          draftData.styleConfig
        );
        draftData.reformulatedMessage = reformulationResult.reformulated;
        draftData.isReformulated = true;
      } catch (reformulationError) {
        console.error(
          "⚠️ Échec de la reformulation automatique:",
          reformulationError
        );
        // Continuer sans reformulation
      }
    }

    const draft = new Draft(draftData);
    await draft.save();

    console.log(`✅ Brouillon créé pour l'utilisateur ${userId}`);

    res.status(201).json({
      message: "Brouillon créé avec succès",
      draft,
    });
  } catch (error) {
    console.error("❌ Erreur lors de la création du brouillon:", error);
    res.status(500).json({
      error: "Erreur lors de la création",
      details:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Impossible de créer le brouillon",
    });
  }
};

/**
 * PUT /api/drafts/:id - Mettre à jour un brouillon
 */
const updateDraft = async (req, res) => {
  try {
    const userId = req.user._id;
    const draftId = req.params.id;
    const updates = req.body;

    // Vérifier que le brouillon appartient à l'utilisateur
    const draft = await Draft.findOne({ _id: draftId, userId });
    if (!draft) {
      return res.status(404).json({
        error: "Brouillon introuvable",
        details: "Ce brouillon n'existe pas ou ne vous appartient pas",
      });
    }

    // Champs autorisés à la mise à jour
    const allowedUpdates = [
      "title",
      "originalMessage",
      "reformulatedMessage",
      "to",
      "subject",
      "styleConfig",
    ];
    const actualUpdates = {};

    for (const key of allowedUpdates) {
      if (updates[key] !== undefined) {
        actualUpdates[key] = updates[key];
      }
    }

    // Si le message original a changé, marquer comme non reformulé
    if (
      updates.originalMessage &&
      updates.originalMessage !== draft.originalMessage
    ) {
      actualUpdates.isReformulated = false;
      actualUpdates.reformulatedMessage = undefined;
    }

    const updatedDraft = await Draft.findByIdAndUpdate(draftId, actualUpdates, {
      new: true,
      runValidators: true,
    });

    console.log(
      `✅ Brouillon ${draftId} mis à jour par l'utilisateur ${userId}`
    );

    res.json({
      message: "Brouillon mis à jour avec succès",
      draft: updatedDraft,
    });
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour du brouillon:", error);
    res.status(500).json({
      error: "Erreur lors de la mise à jour",
      details:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Impossible de mettre à jour le brouillon",
    });
  }
};

/**
 * DELETE /api/drafts/:id - Supprimer un brouillon
 */
const deleteDraft = async (req, res) => {
  try {
    const userId = req.user._id;
    const draftId = req.params.id;

    const deletedDraft = await Draft.findOneAndDelete({ _id: draftId, userId });

    if (!deletedDraft) {
      return res.status(404).json({
        error: "Brouillon introuvable",
        details: "Ce brouillon n'existe pas ou ne vous appartient pas",
      });
    }

    console.log(`✅ Brouillon ${draftId} supprimé par l'utilisateur ${userId}`);

    res.json({
      message: "Brouillon supprimé avec succès",
    });
  } catch (error) {
    console.error("❌ Erreur lors de la suppression du brouillon:", error);
    res.status(500).json({
      error: "Erreur lors de la suppression",
      details:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Impossible de supprimer le brouillon",
    });
  }
};

/**
 * POST /api/drafts/:id/reformulate - Reformuler un brouillon existant
 */
const reformulateDraft = async (req, res) => {
  try {
    const userId = req.user._id;
    const draftId = req.params.id;
    const { styleConfig } = req.body;

    const draft = await Draft.findOne({ _id: draftId, userId });
    if (!draft) {
      return res.status(404).json({
        error: "Brouillon introuvable",
        details: "Ce brouillon n'existe pas ou ne vous appartient pas",
      });
    }

    // Utiliser la config fournie ou celle du brouillon
    const configToUse = styleConfig || draft.styleConfig;

    // Reformuler le message
    const result = await reformulateMessage(draft.originalMessage, configToUse);

    // Mettre à jour le brouillon
    draft.reformulatedMessage = result.reformulated;
    draft.styleConfig = configToUse;
    draft.isReformulated = true;
    await draft.save();

    console.log(
      `✅ Brouillon ${draftId} reformulé par l'utilisateur ${userId}`
    );

    res.json({
      message: "Brouillon reformulé avec succès",
      draft,
      metadata: result.metadata,
    });
  } catch (error) {
    console.error("❌ Erreur lors de la reformulation du brouillon:", error);
    res.status(500).json({
      error: "Erreur lors de la reformulation",
      details:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Impossible de reformuler le brouillon",
    });
  }
};

module.exports = {
  getDrafts,
  createDraft,
  updateDraft,
  deleteDraft,
  reformulateDraft,
};
