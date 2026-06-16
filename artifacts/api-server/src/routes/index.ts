import { Router, type IRouter } from "express";
import healthRouter from "./health";
import kitRouter from "./kit";

const router: IRouter = Router();

router.use(healthRouter);
router.use(kitRouter);

export default router;
