import homeRouter from './home.route.js';
import userRouter from './user.route.js';

const webRoutes = (app) => {
    app.use('/', homeRouter);
    app.use('/api/v1/user', userRouter);
}

export default webRoutes