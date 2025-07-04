
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); 

dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json()); 
app.use(cors()); 


mongoose.connect(process.env.MONGO_URI, {
  
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error(err));


const clientDashboardRoutes = require('./routes/clientDashboardRoutes'); 

app.use('/api', clientDashboardRoutes);


app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));