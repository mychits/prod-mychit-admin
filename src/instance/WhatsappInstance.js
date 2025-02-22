import axios from "axios";
const whatsappApi = axios.create({
  baseURL: "http://13.53.131.163:3000/whatsapp/message",
  // baseURL: "http://localhost:3000/whatsapp/message",
 
});

export default whatsappApi;
