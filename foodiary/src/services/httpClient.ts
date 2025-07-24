import axios from "axios"

export const httpClient = axios.create({
  baseURL: "https://ulm9880sdf.execute-api.us-east-1.amazonaws.com"
})

