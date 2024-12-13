import homeRouter from './home.route.js';
import userRouter from './user.route.js';
import authRouter from './auth.route.js';
import healthRouter from './health.route.js'

import testRouter from './test.route.js';
const webRoutes = (app) => {
    app.use('/', homeRouter);
    app.use('/api/v1/auth', authRouter);
    app.use('/api/v1/user', userRouter);
    app.use('/api/v1/health', healthRouter);
    app.use('/api/v1/test', testRouter);
}

export default webRoutes;    