import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.URI_MONGODB); 
    console.log("Conexión a la base de datos MongoDB exitosa");
  } catch (error) {
    console.log("error al conectar a la base de datos MongoDB", error.message);
  } 
}

export default connectMongoDB;