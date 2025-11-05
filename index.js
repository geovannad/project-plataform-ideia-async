const categoryRoutes = require('./routes/v1/categoryRoutes');
const userRoutes = require('./routes/v1/userRoutes');
const ideaRoutes = require('./routes/v1/ideaRoutes');
// ...

app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/idea', ideaRoutes);