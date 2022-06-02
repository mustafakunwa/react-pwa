import axios from "axios";

export const getBank = () => {
  return axios.get("http://localhost:3000/banks");
};
