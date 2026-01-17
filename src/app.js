require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());

app.use('/auth', require('./routes/auth'));
app.use('/skrining', require('./routes/skrining'));
app.use('/admin', require('./routes/admin'));

// ERROR HANDLER (PALING BAWAH)
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

