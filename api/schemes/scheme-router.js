const express = require("express");
const { up } = require("../../data/migrations/20190713080440_create-tables.js");

const Schemes = require("./scheme-model.js");

const router = express.Router();

router.get("/", (req, res) => {
  Schemes.find()
    .then((schemes) => {
      res.status(200).json(schemes);
    })
    .catch((err) => {
      res.status(500).json({ message: "Failed to get schemes" });
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;

  Schemes.findById(id)
    .then((scheme) => {
      if (scheme) {
        res.json(scheme);
      } else {
        res
          .status(404)
          .json({ message: "Could not find scheme with given id." });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Failed to get schemes" });
    });
});

router.get("/:id/steps", (req, res) => {
  const { id } = req.params;

  Schemes.findSteps(id)
    .then((steps) => {
      if (steps.length) {
        res.json(steps);
      } else {
        res
          .status(404)
          .json({ message: "Could not find steps for given scheme" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Failed to get steps" });
    });
});

router.post("/", (req, res) => {
  const schemeData = req.body;
  if (!schemeData.scheme_name) {
    res.status(404).json({ message: "you must add a name to your scheme" });
  } else {
    Schemes.add(schemeData)
      .then((scheme) => {
        res.status(201).json(scheme);
      })
      .catch((err) => {
        res.status(500).json({ message: "Failed to create new scheme" });
      });
  }
});

router.post("/:id/steps", (req, res) => {
  const stepData = req.body;
  const { id } = req.params;

  Schemes.findById(id)
    .then((scheme) => {
      if (scheme) {
        return Schemes.addStep(stepData, id);
      } else {
        res
          .status(404)
          .json({ message: "Could not find scheme with given id." });
      }
    })
    .then((step) => {
      res.status(201).json(step);
    })
    .catch((err) => {
      res.status(500).json({ message: "Failed to create new step" });
    });
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const changes = req.body;
  if (!changes.scheme_name) {
    res.status(404).json({ message: "You must name your scheme to update" });
  } else {
    try {
      const updatedScheme = await Schemes.update(id, changes);
      if (updatedScheme) {
        res.status(201).json(updatedScheme);
      }
    } catch (err) {
      res.status(500).json({ message: "server error", error: err.message });
    }
  }
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  Schemes.remove(id)
    .then((deleted) => {
      if (deleted) {
        res.json({ removed: deleted });
      } else {
        res
          .status(404)
          .json({ message: "Could not find scheme with given id" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Failed to delete scheme" });
    });
});

module.exports = router;
