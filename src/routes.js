"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// get, post, put, delete (CRUD)
router.get("/", (req, res) => {
    res.status(200).send('Welcome to the MENTS API');
});
exports.default = router;
//# sourceMappingURL=routes.js.map