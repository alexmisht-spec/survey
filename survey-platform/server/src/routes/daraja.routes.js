import { Router } from "express";

import {

    b2cResultCallback,

    b2cTimeoutCallback

} from "../controllers/daraja.callback.controller.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| B2C CALLBACKS
|--------------------------------------------------------------------------
*/

router.post(

    "/result",

    b2cResultCallback

);

router.post(

    "/timeout",

    b2cTimeoutCallback

);

export default router;