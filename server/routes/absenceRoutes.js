const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");
const {
  createAbsence,
  getAbsences,
  deleteAbsence,
} = require("../controllers/absenceController");

router.use(auth);

router.post("/", createAbsence);
router.get("/", getAbsences);
router.delete("/:id", deleteAbsence);

module.exports = router;