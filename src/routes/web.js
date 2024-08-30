import homeRouter from './home.route.js';
import adminRouter from './admin.route.js';
import userRouter from './user.route.js';
import authRouter from './auth.js';

const webRoutes = (app) => {
    app.use('/', homeRouter);
    // app.use('/api/v1/admin', adminRouter);
    app.use('/api/v1/auth', authRouter);
    app.use('/api/v1/user', userRouter);
}

export default webRoutes    