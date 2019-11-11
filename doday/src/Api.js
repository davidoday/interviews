import axios from 'axios'

let API_URL = 'https://fhir-open.sandboxcerner.com/dstu2/0b8a0111-e8e6-4c26-a91c-5069cbc6b1ca/'
let PATIENT_CALL = 'Patient?_id='
let CONDITION_CALL = 'Condition?patient='
const config = {
    headers: {
      Accept: 'application/json+fhir'
    },
    json: true
  };

const checkError = (error) => {
    console.log("API Error", error)
}


export function getPatientInfo(patientID) {
    return axios.get(`${API_URL}${PATIENT_CALL}${patientID}`, config)
      .catch((error) => {
          checkError(error)
        })
}

export function getPatientConditions(patientID) {
    return axios.get(`${API_URL}${CONDITION_CALL}${patientID}`, config)
      .catch((error) => {
          checkError(error)
        })
}
