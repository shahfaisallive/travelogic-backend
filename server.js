const express = require('express');
const dotenv = require("dotenv")
const HttpError = require('./Models/HttpError');
const connectDB = require('./config/db')
const path = require('path')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const csurf = require('csurf')


dotenv.config({ path: './config/config.env' })

// IMPORTING ROUTES HERE
const DestinationRoutes = require('./Routes/DestinationRoutes');
const BookingRoutes = require('./Routes/BookingRoutes');
const TransportRoutes = require('./Routes/TransportRoutes');
const AnswerRoutes = require('./Routes/AnswerRoutes');
const UserRoutes = require('./Routes/UserRoutes');
const QuestionRoutes = require('./Routes/QuestionRoutes');
const TripRoutes = require('./Routes/TripRoutes');
const HotelRoutes = require('./Routes/HotelRoutes');
const UploadRoutes = require('./Routes/UploadRoutes');
const AdminRoutes = require('./Routes/AdminRoutes')
const TripPlannerDestinationRoutes = require('./Routes/TripPlannerDestinationRoutes');
const PlanATripRoutes = require('./Routes/PlanATripRoutes')
const FeedbackRoutes = require('./Routes/FeedbackRoutes')
const RouteRoutes = require('./Routes/RouteRoutes');
const SearchRoutes = require('./Routes/SearchRoutes');


const app = express();
app.use(express.json());

app.use(cookieParser());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });

app.use(cors({
    origin: [
        "https://admin.travelogic.pk",
        "http://localhost:3000",
        "http://localhost:3001",
        "https://travelogic.pk",
    ],
    credentials: true,
}));

//Use the routes here
app.use('/api/destinations', DestinationRoutes);
app.use('/api/bookings', BookingRoutes);
app.use('/api/transports', TransportRoutes);
app.use('/api/answers', AnswerRoutes)
app.use('/api/users', UserRoutes)
app.use('/api/questions', QuestionRoutes)
app.use('/api/trips', TripRoutes)
app.use('/api/hotels', HotelRoutes)
app.use('/api/upload', UploadRoutes)
app.use('/api/plan', PlanATripRoutes)
app.use('/api/feedbacks', FeedbackRoutes)
app.use('/api/tripplannerdestination', TripPlannerDestinationRoutes)
app.use('/api/routes', RouteRoutes)
app.use('/api/search', SearchRoutes)

// For admin
app.use('/api/admin', AdminRoutes)

//Default route
app.use('/', (req, res) => res.send('Travelogic Server'))

// Static Folder fo images upload
// app.use('/uploads', express.static(path.join(__dirname, '/uploads')))
app.use('/uploads/images', express.static(path.join('uploads', 'images')))
app.use('/uploads/users', express.static(path.join('uploads', 'users')))
app.use('/uploads/trips', express.static(path.join('uploads', 'trips')))

const csrfProtection = csurf({
    cookie: true
})
app.use(csrfProtection)


//Error handling on server side
app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404);
    throw error;
});

app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500)
    res.json({ message: error.message || 'An unknown error has occurred!' });
});

//DATABASE CONNECTION HERE
connectDB();
const PORT = process.env.PORT || 4000
app.listen(PORT);
