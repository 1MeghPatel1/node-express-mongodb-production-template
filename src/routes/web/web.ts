import { Router, Request, Response, NextFunction } from "express";
//ROUTERS USE ADD HERE
const router = Router();

/* GET home page. */
router.get("/", function (req: Request, res: Response, next: NextFunction) {
  res.render("welcome", { title: "Express" });
});

//ROUTERS USE ADD HERE

export default router;
