import { Router, type IRouter } from "express";
import healthRouter from "./health";
import kitRouter from "./kit";
import authRouter from "./auth";
import passkeysRouter from "./passkeys";
import blogRouter from "./blog";
import seoRouter from "./seo";

const router: IRouter = Router();

router.use(healthRouter);
router.use(kitRouter);
router.use(authRouter);
router.use(passkeysRouter);
router.use(blogRouter);
router.use(seoRouter);

export default router;
