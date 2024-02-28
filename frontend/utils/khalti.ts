import axios from "axios";
const URL = "https://a.khalti.com/api/v2/epayment/initiate/";

const createHeaders = () => {
  return {
    headers: {
      Authorization: `Key dbf107a9c72548468029bdf82a8335de`,
    },
  };
};

export const initiatePayment = async (data: any) => {
  try {
    const response = await axios.post(URL, data, createHeaders());
    return response.data;
  } catch (error) {
    return error;
  }
};
